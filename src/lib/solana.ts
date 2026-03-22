// src/lib/solana.ts
import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
} from '@solana/web3.js'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

// ─────────────────────────────────────────────
// A. Connection Builder
// ─────────────────────────────────────────────

export function buildConnection(): Connection {
  const rpcUrl = process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com'
  return new Connection(rpcUrl, 'confirmed')
}

export function getNetwork(): string {
  return process.env.SOLANA_NETWORK ?? 'devnet'
}

// ─────────────────────────────────────────────
// B. Platform Keypair (mint authority)
// ─────────────────────────────────────────────

let _platformKeypair: Keypair | null = null

export function getPlatformKeypair(): Keypair {
  if (_platformKeypair) return _platformKeypair

  const base64Key = process.env.PLATFORM_KEYPAIR_BASE64
  if (!base64Key) {
    throw new Error('PLATFORM_KEYPAIR_BASE64 environment variable is not set')
  }

  const secretKeyBytes = Buffer.from(base64Key, 'base64')
  if (secretKeyBytes.length !== 64) {
    throw new Error('PLATFORM_KEYPAIR_BASE64 must be a 64-byte Solana secret key')
  }

  _platformKeypair = Keypair.fromSecretKey(secretKeyBytes)
  return _platformKeypair
}

// ─────────────────────────────────────────────
// C. Wallet Signature Verification
// ─────────────────────────────────────────────
//
// Message format agents must sign:
//   "AgentKeys registration\nWallet: <wallet_address>\nTimestamp: <unix_ms>\nNonce: <nonce>"
//
// Example:
//   "AgentKeys registration\nWallet: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU\nTimestamp: 1742000000000\nNonce: a3f9b2c1"

export interface VerifySignatureResult {
  valid: boolean
  error?: string
}

export function verifyWalletSignature(
  message: string,
  signatureBase58: string,
  walletAddress: string
): VerifySignatureResult {
  try {
    // Decode the wallet public key
    let publicKeyBytes: Uint8Array
    try {
      publicKeyBytes = new PublicKey(walletAddress).toBytes()
    } catch {
      return { valid: false, error: 'Invalid wallet address format' }
    }

    // Decode the signature (agents should submit base58-encoded signature)
    let signatureBytes: Uint8Array
    try {
      signatureBytes = bs58.decode(signatureBase58)
    } catch {
      return { valid: false, error: 'Invalid signature encoding (expected base58)' }
    }

    if (signatureBytes.length !== 64) {
      return { valid: false, error: 'Invalid signature length (expected 64 bytes)' }
    }

    // Encode the message as UTF-8 bytes
    const messageBytes = new TextEncoder().encode(message)

    // Verify using Ed25519
    const valid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)

    if (!valid) {
      return { valid: false, error: 'Signature verification failed' }
    }

    return { valid: true }
  } catch (err) {
    return { valid: false, error: `Signature verification error: ${String(err)}` }
  }
}

// ─────────────────────────────────────────────
// D. Message Validation (replay attack prevention)
// ─────────────────────────────────────────────

export interface ValidateMessageResult {
  valid: boolean
  walletFromMessage?: string
  error?: string
}

export function validateRegistrationMessage(
  message: string,
  claimedWalletAddress: string,
  maxAgeMs: number = 5 * 60 * 1000 // 5 minutes default
): ValidateMessageResult {
  // Expected format:
  // "AgentKeys registration\nWallet: <address>\nTimestamp: <ms>\nNonce: <hex>"
  const lines = message.split('\n')

  if (lines.length < 4) {
    return { valid: false, error: 'Message format invalid: expected 4 lines' }
  }

  if (lines[0] !== 'AgentKeys registration') {
    return { valid: false, error: 'Message prefix mismatch' }
  }

  const walletLine = lines[1]
  const timestampLine = lines[2]
  // Nonce line[3] is present but just for uniqueness; we don't need to verify it
  //
  // Known limitation: nonces are not persisted to a store, so the same signed message could
  // theoretically be replayed within the 5-minute window. The wallet_address uniqueness
  // constraint in the DB mitigates this for registration. For production, consider storing
  // used nonces in Redis or Supabase with TTL.

  const walletMatch = walletLine.match(/^Wallet: (.+)$/)
  if (!walletMatch) {
    return { valid: false, error: 'Message missing Wallet field' }
  }

  const walletFromMessage = walletMatch[1].trim()
  if (walletFromMessage !== claimedWalletAddress) {
    return {
      valid: false,
      error: `Wallet in message (${walletFromMessage}) does not match claimed wallet (${claimedWalletAddress})`,
    }
  }

  const timestampMatch = timestampLine.match(/^Timestamp: (\d+)$/)
  if (!timestampMatch) {
    return { valid: false, error: 'Message missing Timestamp field' }
  }

  const timestamp = parseInt(timestampMatch[1], 10)
  const now = Date.now()
  const age = now - timestamp

  if (age < 0) {
    return { valid: false, error: 'Message timestamp is in the future' }
  }

  if (age > maxAgeMs) {
    return {
      valid: false,
      error: `Message expired: ${Math.round(age / 1000)}s old (max ${maxAgeMs / 1000}s)`,
    }
  }

  return { valid: true, walletFromMessage }
}

// ─────────────────────────────────────────────
// E. Transaction Verification
// ─────────────────────────────────────────────

export interface VerifyTransactionResult {
  valid: boolean
  actualAmountSol?: number
  error?: string
}

export async function verifyTransaction(
  txSignature: string,
  expectedAmountSol: number,
  expectedRecipient: string
): Promise<VerifyTransactionResult> {
  const connection = buildConnection()

  // Fetch the transaction with a retry for "not yet confirmed" cases
  let tx: ParsedTransactionWithMeta | null = null
  const maxRetries = 5
  const retryDelayMs = 2000

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      tx = await connection.getParsedTransaction(txSignature, {
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed',
      })
      if (tx) break
    } catch (err) {
      if (attempt === maxRetries - 1) {
        return { valid: false, error: `RPC error fetching transaction: ${String(err)}` }
      }
    }

    if (!tx && attempt < maxRetries - 1) {
      await sleep(retryDelayMs)
    }
  }

  if (!tx) {
    return {
      valid: false,
      error: 'Transaction not found on-chain after multiple retries. It may not be confirmed yet.',
    }
  }

  // Check transaction was successful (no errors)
  if (tx.meta?.err) {
    return {
      valid: false,
      error: `Transaction failed on-chain: ${JSON.stringify(tx.meta.err)}`,
    }
  }

  // Verify the recipient received the correct amount
  // We look at pre/post balances for the expected recipient account
  const recipientPubkey = new PublicKey(expectedRecipient)
  const accountKeys = tx.transaction.message.accountKeys

  const recipientIndex = accountKeys.findIndex(
    (k) => k.pubkey.toBase58() === recipientPubkey.toBase58()
  )

  if (recipientIndex === -1) {
    return {
      valid: false,
      error: `Recipient ${expectedRecipient} not found in transaction accounts`,
    }
  }

  const preBalance = tx.meta!.preBalances[recipientIndex]
  const postBalance = tx.meta!.postBalances[recipientIndex]
  const receivedLamports = postBalance - preBalance
  const receivedSol = receivedLamports / LAMPORTS_PER_SOL

  // Allow 0.001 SOL tolerance for floating point / rounding
  const expectedLamports = Math.round(expectedAmountSol * LAMPORTS_PER_SOL)
  const actualLamports = receivedLamports
  const tolerance = 1000 // 0.000001 SOL

  if (Math.abs(actualLamports - expectedLamports) > tolerance) {
    return {
      valid: false,
      actualAmountSol: receivedSol,
      error: `Payment amount mismatch. Expected ${expectedAmountSol} SOL, received ${receivedSol} SOL`,
    }
  }

  return { valid: true, actualAmountSol: receivedSol }
}

// ─────────────────────────────────────────────
// F. Wallet Balance Check
// ─────────────────────────────────────────────

export interface WalletBalanceResult {
  balanceSol: number
  balanceLamports: number
  sufficient: boolean
  error?: string
}

export async function getWalletBalance(
  walletAddress: string,
  requiredSol?: number
): Promise<WalletBalanceResult> {
  const connection = buildConnection()

  try {
    const pubkey = new PublicKey(walletAddress)
    const lamports = await connection.getBalance(pubkey)
    const balanceSol = lamports / LAMPORTS_PER_SOL

    return {
      balanceLamports: lamports,
      balanceSol,
      sufficient: requiredSol !== undefined ? balanceSol >= requiredSol : true,
    }
  } catch (err) {
    return {
      balanceLamports: 0,
      balanceSol: 0,
      sufficient: false,
      error: `Failed to fetch wallet balance: ${String(err)}`,
    }
  }
}

// ─────────────────────────────────────────────
// G. NFT Minting
// ─────────────────────────────────────────────

export interface NFTMetadata {
  name: string
  symbol: string
  description: string
  image: string // IPFS URI or HTTPS URL
  attributes: Array<{ trait_type: string; value: string | number }>
}

export interface MintNFTResult {
  success: boolean
  mintAddress?: string
  txSignature?: string
  error?: string
}

export async function mintNFT(
  buyerWalletAddress: string,
  collectionId: string,
  skillId: string,
  metadata: NFTMetadata
): Promise<MintNFTResult> {
  // Import Metaplex Umi lazily (avoids edge runtime issues)
  const { createUmi } = await import('@metaplex-foundation/umi-bundle-defaults')
  const {
    createNft,
    mplTokenMetadata,
  } = await import('@metaplex-foundation/mpl-token-metadata')
  const {
    generateSigner,
    keypairIdentity,
    publicKey: umiPublicKey,
    percentAmount,
  } = await import('@metaplex-foundation/umi')

  try {
    const platformKeypair = getPlatformKeypair()
    const rpcUrl = process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com'

    // Build Umi instance
    const umi = createUmi(rpcUrl).use(mplTokenMetadata())

    // Set platform keypair as the signer/payer
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(platformKeypair.secretKey)
    umi.use(keypairIdentity(umiKeypair))

    // Generate a new mint address for this NFT
    const mintSigner = generateSigner(umi)

    // Build metadata URI — in production, this should be a real IPFS/Arweave URI
    // For devnet, we can use a JSON data URI or a hosted endpoint
    // The metadata JSON must conform to the Metaplex NFT standard
    const metadataUri = await uploadMetadata(metadata, collectionId, skillId)

    // Mint the NFT to the buyer's wallet
    const buyerPubkey = umiPublicKey(buyerWalletAddress)

    const { signature } = await createNft(umi, {
      mint: mintSigner,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(5), // 5% royalty
      tokenOwner: buyerPubkey,
      isMutable: false, // Keycards are immutable once minted
    }).sendAndConfirm(umi)

    // Convert signature bytes to base58 string
    // Uses the top-level `import bs58 from 'bs58'` — no dynamic import needed
    const txSignature = bs58.encode(signature)

    return {
      success: true,
      mintAddress: mintSigner.publicKey.toString(),
      txSignature,
    }
  } catch (err) {
    return {
      success: false,
      error: `NFT minting failed: ${String(err)}`,
    }
  }
}

// ─────────────────────────────────────────────
// H. Metadata Upload Helper
// ─────────────────────────────────────────────
//
// For devnet: return a base64 data URI or a simple hosted URL
// For production: upload to Arweave/IPFS via Bundlr or NFT.storage
// KD1 NOTE: For initial devnet implementation, use a simple JSON endpoint
// or store metadata in Supabase and return a URL to a public API route.

async function uploadMetadata(
  metadata: NFTMetadata,
  collectionId: string,
  skillId: string
): Promise<string> {
  // Devnet approach: serve metadata from our own API
  // This route should be: GET /api/metadata/[collectionId]/[skillId]
  // Which returns the JSON metadata object
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agentkeys.vercel.app'
  return `${baseUrl}/api/metadata/${collectionId}/${skillId}`

  // TODO for production: replace with Arweave upload via Irys
  // (do not use Bundlr — deprecated)
}

// ─────────────────────────────────────────────
// I. Duplicate Purchase Prevention
// ─────────────────────────────────────────────

// This is handled at the DB layer by checking card_holdings for existing records
// before minting. The route should check this before calling mintNFT.
// See updated purchase route for implementation.

// ─────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
