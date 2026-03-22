// ============================================================
// AgentKeys — Unified Type Definitions
// Updated for: Skill Sets, Card Packs, Rarity, Secondary Market
// ============================================================

// --------------- Core Entities ---------------

export interface Agent {
  id: string;
  wallet_address: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  registered_at: string;
  is_active: boolean;
  skill_count?: number;
  collection_count?: number;
}

export interface Skill {
  id: string;
  agent_id: string;
  name: string;
  slug: string;
  current_version: number;
  created_at: string;
  updated_at: string;
  agent?: Agent;
  latest_version?: SkillVersion;
}

export interface SkillVersion {
  id: string;
  skill_id: string;
  version: number;
  content_md: string;
  changelog: string | null;
  published_at: string;
  change_type: 'patch' | 'minor' | 'major';
}

// --------------- Skill Sets ---------------

export type RarityTier = 'basic' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface SkillSet {
  id: string;
  creator_agent_id: string;
  name: string;
  description: string | null;
  rarity_tier: RarityTier;
  power_level: number;        // computed from skill_set_members count
  is_published: boolean;
  created_at: string;
  // Joined fields
  creator?: Agent;
  members?: SkillSetMember[];
}

export interface SkillSetMember {
  id: string;
  skill_set_id: string;
  skill_id: string;
  position: number;
  // Joined fields
  skill?: Skill;
}

// --------------- Collections ---------------

export interface Collection {
  id: string;
  skill_id: string | null;        // null for skill-set collections (legacy field kept)
  skill_set_id: string | null;    // non-null for skill-set packs
  agent_id: string;
  name: string;
  max_supply: number;
  minted_count: number;
  price_sol: number;
  is_free: boolean;
  rarity_tier: RarityTier | null;
  pack_image_uri: string | null;
  nft_collection_address: string;
  metadata_uri: string;
  is_active: boolean;
  created_at: string;
  // Joined fields
  skill?: Skill;
  skill_set?: SkillSet;
  agent?: Agent;
}

// --------------- Card Holdings ---------------

export interface CardHolding {
  id: string;
  collection_id: string;
  owner_agent_id: string;
  nft_mint_address: string;
  acquired_at: string;
  skill_access_active: boolean;
  active_version: number | null;  // legacy: used for single-skill holdings only
  skill_set_id: string | null;    // non-null for skill-set holdings
  acquired_via: 'mint' | 'secondary';
  // Joined fields
  collection?: Collection;
  skill_set?: SkillSet;
  skill_versions?: HoldingSkillVersion[];  // per-skill version state
}

// --------------- Holding Skill Versions ---------------

export interface HoldingSkillVersion {
  id: string;
  card_holding_id: string;
  skill_id: string;
  active_version: number | null;  // null = follow latest
  // Joined fields
  skill?: Skill;
}

// --------------- Secondary Market ---------------

export interface SecondaryListing {
  id: string;
  card_holding_id: string;
  seller_agent_id: string;
  price_sol: number;
  is_active: boolean;
  created_at: string;
  // Joined fields
  holding?: CardHolding;
  seller?: Agent;
  skill_set?: SkillSet;
}

// --------------- Transactions ---------------

export interface Transaction {
  id: string;
  collection_id: string;
  buyer_agent_id: string;
  seller_agent_id: string | null;
  tx_signature: string;
  price_sol: number;
  platform_fee_sol: number | null;     // non-null on secondary sales
  creator_royalty_sol: number | null;  // non-null on secondary sales
  listing_id: string | null;           // non-null on secondary sales
  type: 'mint' | 'transfer' | 'sale';
  created_at: string;
  // Joined fields
  collection?: Collection;
  buyer?: Agent;
  seller?: Agent | null;
}

// --------------- Version Notifications ---------------

export interface SkillVersionNotification {
  id: string;
  agent_id: string;
  skill_id: string;
  version: number;
  change_type: 'patch' | 'minor' | 'major';
  changelog: string | null;
  seen: boolean;
  decided: boolean;
  created_at: string;
  // Joined fields
  skill_name?: string;
  skill_slug?: string;
  current_version?: number;
  content_md?: string;
}

// --------------- API Responses ---------------

export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: { code: string; message: string };
}

export interface SkillAccessResponse {
  has_access: boolean;
  current_version: number;
  served_version: number;
  is_pinned: boolean;
  content_md?: string;
}

// --------------- Request Bodies ---------------

export interface RegisterAgentRequest {
  wallet_address: string;
  signature: string;
  message: string;
  name: string;
  bio?: string;
}

export interface RegisterAgentResponse {
  agent: Agent;
  api_key: string;
}

export interface CreateSkillSetRequest {
  name: string;
  description?: string;
}

export interface AddSkillToSetRequest {
  skill_id: string;
  position?: number;
}

export interface CreateListingRequest {
  card_holding_id: string;
  price_sol: number;
}

export interface PurchaseListingRequest {
  tx_signature: string;
}

export interface PatchVersionRequest {
  action: 'adopt' | 'reject' | 'pin' | 'rollback';
  version?: number;  // required for 'pin' action
}

// --------------- Helper Types ---------------

export interface RarityConfig {
  tier: RarityTier;
  minSkills: number;
  maxSkills: number | null;  // null = unlimited (mythic)
  maxSupplyCap: number;
}

// Canonical rarity table — use this everywhere tier logic is needed
export const RARITY_TIERS: RarityConfig[] = [
  { tier: 'basic',     minSkills: 1,  maxSkills: 2,  maxSupplyCap: 5000 },
  { tier: 'uncommon',  minSkills: 3,  maxSkills: 4,  maxSupplyCap: 2000 },
  { tier: 'rare',      minSkills: 5,  maxSkills: 7,  maxSupplyCap: 500  },
  { tier: 'epic',      minSkills: 8,  maxSkills: 11, maxSupplyCap: 200  },
  { tier: 'legendary', minSkills: 12, maxSkills: 17, maxSupplyCap: 50   },
  { tier: 'mythic',    minSkills: 18, maxSkills: null, maxSupplyCap: 10 },
];

export function getTierForPowerLevel(powerLevel: number): RarityTier | null {
  const config = RARITY_TIERS.find(t =>
    powerLevel >= t.minSkills && (t.maxSkills === null || powerLevel <= t.maxSkills)
  );
  return config?.tier ?? null;
}

export function getMaxSupplyForTier(tier: RarityTier): number {
  return RARITY_TIERS.find(t => t.tier === tier)?.maxSupplyCap ?? 5000;
}

export const PLATFORM_FEE_RATE = 0.05;   // 5%
export const CREATOR_ROYALTY_RATE = 0.05; // 5%
