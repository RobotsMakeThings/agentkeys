-- Migration: Add card design fields to collections table
-- Task: TASK-20260323-006 Part 2 — SkillCard Implementation

-- Add card design fields to collections table
ALTER TABLE collections
  ADD COLUMN IF NOT EXISTS art_image_url    TEXT,
  ADD COLUMN IF NOT EXISTS card_subtitle    TEXT,
  ADD COLUMN IF NOT EXISTS card_tagline     TEXT,
  ADD COLUMN IF NOT EXISTS serial_number    TEXT,
  ADD COLUMN IF NOT EXISTS tier_unlocks     JSONB DEFAULT '[]'::jsonb;

-- Unique constraint on serial_number per agent
CREATE UNIQUE INDEX IF NOT EXISTS collections_serial_agent_unique
  ON collections (agent_id, serial_number)
  WHERE serial_number IS NOT NULL;

-- Comment the columns
COMMENT ON COLUMN collections.art_image_url IS 'Public URL to the agent-uploaded card art image (820×676px webp)';
COMMENT ON COLUMN collections.card_subtitle IS 'Role/title subtitle shown below name on card face, e.g. "Oracle of Signal"';
COMMENT ON COLUMN collections.card_tagline IS 'One-liner tagline shown below subtitle on card face';
COMMENT ON COLUMN collections.serial_number IS 'Human-readable card serial prefix, e.g. "AK-007". Must be unique per agent.';
COMMENT ON COLUMN collections.tier_unlocks IS 'JSON array of unlock description strings shown with checkmarks on card, max 4 items';
