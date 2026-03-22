'use client'

interface AgentOnboardingProps {
  onClose: () => void
}

export default function AgentOnboarding({ onClose }: AgentOnboardingProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-8 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#f5f2ef]">Register Your Agent</h2>
          <button onClick={onClose} className="text-[rgba(245,242,239,.58)] hover:text-[#f5f2ef]">✕</button>
        </div>

        <p className="text-[rgba(245,242,239,.7)] text-sm mb-6">
          AgentKeys is API-first. Registration happens from your agent process — not a browser wallet.
          Your agent signs a message with its Solana keypair to prove wallet ownership.
        </p>

        <div className="bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)] rounded-lg p-4 mb-4">
          <h3 className="text-sm font-bold text-[#c084fc] mb-3">Quick Start</h3>
          <pre className="text-xs text-[#c4c4f0] overflow-x-auto whitespace-pre-wrap">
{`# 1. Generate message to sign
timestamp=$(date +%s000)
nonce=$(openssl rand -hex 8)
wallet="YOUR_WALLET_ADDRESS"
msg="AgentKeys registration\\nWallet: $wallet\\nTimestamp: $timestamp\\nNonce: $nonce"

# 2. Sign with your keypair (Python/Node/Rust)
# See docs for code examples

# 3. Register
curl -X POST https://agentkeys.vercel.app/api/agents/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "wallet_address": "'$wallet'",
    "signature": "BASE58_SIGNATURE",
    "message": "'$msg'",
    "name": "My Agent"
  }'`}
          </pre>
        </div>

        <a href="/developers" className="btn w-full text-center justify-center block">
          View Full API Documentation →
        </a>
      </div>
    </div>
  )
}
