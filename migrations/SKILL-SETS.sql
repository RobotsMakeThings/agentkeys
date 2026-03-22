-- ============================================================
-- Skill Sets, Card Packs & Secondary Market — Schema Migrations
-- Apply after LIVING-SKILLS.sql migrations.
-- ============================================================

-- Migration 001: Create skill_sets table
CREATE TABLE IF NOT EXISTS skill_sets (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_agent_id  UUID        NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  name              TEXT        NOT NULL,
  description       TEXT,
  rarity_tier       TEXT        NOT NULL CHECK (rarity_tier IN ('basic', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  power_level       INTEGER     NOT NULL DEFAULT 0,
  is_published      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE skill_sets IS 'A curated bundle of skills sold as a single card. Rarity and power_level are derived from skill count.';
COMMENT ON COLUMN skill_sets.power_level IS 'Computed from skill count in skill_set_members. Stored for query performance. Recomputed on add/remove skill.';
COMMENT ON COLUMN skill_sets.is_published IS 'FALSE = draft (not visible on marketplace). TRUE = visible. Cannot be set TRUE if power_level = 0.';

CREATE INDEX IF NOT EXISTS idx_skill_sets_creator ON skill_sets(creator_agent_id);
CREATE INDEX IF NOT EXISTS idx_skill_sets_tier ON skill_sets(rarity_tier) WHERE is_published = TRUE;


-- Migration 002: Create skill_set_members table
CREATE TABLE IF NOT EXISTS skill_set_members (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_set_id  UUID        NOT NULL REFERENCES skill_sets(id) ON DELETE CASCADE,
  skill_id      UUID        NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
  position      INTEGER     NOT NULL DEFAULT 0,
  UNIQUE(skill_set_id, skill_id)
);

COMMENT ON TABLE skill_set_members IS 'Junction table mapping skills into skill sets. position controls display order.';
COMMENT ON COLUMN skill_set_members.skill_id IS 'ON DELETE RESTRICT: cannot delete a skill that is a member of a set. Remove from set first.';

CREATE INDEX IF NOT EXISTS idx_ssm_skill_set ON skill_set_members(skill_set_id);
CREATE INDEX IF NOT EXISTS idx_ssm_skill ON skill_set_members(skill_id);


-- Migration 003: Create secondary_listings table
CREATE TABLE IF NOT EXISTS secondary_listings (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  card_holding_id  UUID           NOT NULL REFERENCES card_holdings(id) ON DELETE CASCADE,
  seller_agent_id  UUID           NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  price_sol        DECIMAL(10,9)  NOT NULL CHECK (price_sol > 0),
  is_active        BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE secondary_listings IS 'Secondary market listings. One active listing per card_holding enforced by partial unique index.';

-- One active listing per card_holding at a time; unlimited inactive/historical records
CREATE UNIQUE INDEX IF NOT EXISTS idx_secondary_listings_holding_active
  ON secondary_listings(card_holding_id)
  WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_secondary_listings_seller ON secondary_listings(seller_agent_id);
CREATE INDEX IF NOT EXISTS idx_secondary_listings_active ON secondary_listings(is_active, created_at DESC) WHERE is_active = TRUE;


-- Migration 004: Create holding_skill_versions table
-- Tracks per-skill version state for each card_holding.
-- Replaces the single active_version on card_holdings for skill-set-based purchases.
-- Legacy single-skill holdings continue using card_holdings.active_version.
CREATE TABLE IF NOT EXISTS holding_skill_versions (
  id               UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  card_holding_id  UUID     NOT NULL REFERENCES card_holdings(id) ON DELETE CASCADE,
  skill_id         UUID     NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  active_version   INTEGER  DEFAULT NULL,
  UNIQUE(card_holding_id, skill_id)
);

COMMENT ON TABLE holding_skill_versions IS 'Per-skill version pinning for skill-set holdings. NULL active_version = follow latest.';
COMMENT ON COLUMN holding_skill_versions.active_version IS 'NULL = follow latest (current_version). Integer = pinned. Mirrors card_holdings.active_version but scoped per-skill.';

CREATE INDEX IF NOT EXISTS idx_hsv_holding ON holding_skill_versions(card_holding_id);
CREATE INDEX IF NOT EXISTS idx_hsv_skill ON holding_skill_versions(skill_id);


-- Migration 005: Extend collections table
ALTER TABLE collections
  ADD COLUMN IF NOT EXISTS skill_set_id    UUID    REFERENCES skill_sets(id),
  ADD COLUMN IF NOT EXISTS is_free         BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS rarity_tier     TEXT    CHECK (rarity_tier IN ('basic', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  ADD COLUMN IF NOT EXISTS pack_image_uri  TEXT;

COMMENT ON COLUMN collections.skill_set_id IS 'NULL for legacy single-skill collections. Non-null for skill-set packs.';
COMMENT ON COLUMN collections.is_free IS 'TRUE = free mint (price_sol = 0). Still subject to supply caps.';
COMMENT ON COLUMN collections.rarity_tier IS 'Denormalized from skill_sets.rarity_tier for query performance. Must match.';
COMMENT ON COLUMN collections.pack_image_uri IS 'Image shown before pack is opened (pre-reveal art).';

CREATE INDEX IF NOT EXISTS idx_collections_skill_set ON collections(skill_set_id) WHERE skill_set_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_collections_tier ON collections(rarity_tier) WHERE is_active = TRUE;


-- Migration 006: Extend card_holdings table
ALTER TABLE card_holdings
  ADD COLUMN IF NOT EXISTS skill_set_id   UUID  REFERENCES skill_sets(id),
  ADD COLUMN IF NOT EXISTS acquired_via   TEXT  NOT NULL DEFAULT 'mint'
    CHECK (acquired_via IN ('mint', 'secondary'));

COMMENT ON COLUMN card_holdings.skill_set_id IS 'Denormalized from collection for direct querying. NULL for legacy single-skill holdings.';
COMMENT ON COLUMN card_holdings.acquired_via IS 'mint = primary purchase; secondary = bought on secondary market.';

CREATE INDEX IF NOT EXISTS idx_card_holdings_skill_set ON card_holdings(skill_set_id) WHERE skill_set_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_card_holdings_owner_set ON card_holdings(owner_agent_id, skill_set_id);


-- Migration 007: Extend transactions table
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS platform_fee_sol    DECIMAL(10,9),
  ADD COLUMN IF NOT EXISTS creator_royalty_sol DECIMAL(10,9),
  ADD COLUMN IF NOT EXISTS listing_id          UUID REFERENCES secondary_listings(id);

COMMENT ON COLUMN transactions.platform_fee_sol IS '5% of price_sol on secondary sales. NULL on primary mints.';
COMMENT ON COLUMN transactions.creator_royalty_sol IS '5% of price_sol on secondary sales. NULL on primary mints.';
COMMENT ON COLUMN transactions.listing_id IS 'FK to secondary_listings for secondary sales. NULL on primary mints.';

CREATE INDEX IF NOT EXISTS idx_transactions_listing ON transactions(listing_id) WHERE listing_id IS NOT NULL;
