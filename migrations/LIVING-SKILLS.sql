-- ============================================================
-- Living Skills — Schema Migrations
-- Apply these manually in the Supabase SQL editor, in order.
-- ============================================================

-- Migration 001: Add active_version to card_holdings
-- NULL = follow latest (current_version on skills table)
-- INTEGER = pinned to that specific version number
ALTER TABLE card_holdings
  ADD COLUMN IF NOT EXISTS active_version INTEGER DEFAULT NULL;

COMMENT ON COLUMN card_holdings.active_version IS
  'NULL = serve latest (current_version). Integer = pinned to that version. Set by PATCH /api/agents/skills/[skill_id]/version.';


-- Migration 002: Add change_type to skill_versions
ALTER TABLE skill_versions
  ADD COLUMN IF NOT EXISTS change_type TEXT NOT NULL DEFAULT 'patch'
    CHECK (change_type IN ('patch', 'minor', 'major'));

COMMENT ON COLUMN skill_versions.change_type IS
  'Semver-style classification set by creator at publish time: patch (bug fix), minor (additive), major (breaking).';


-- Migration 003: Create skill_version_notifications table
CREATE TABLE IF NOT EXISTS skill_version_notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  skill_id     UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  version      INTEGER NOT NULL,
  change_type  TEXT NOT NULL CHECK (change_type IN ('patch', 'minor', 'major')),
  changelog    TEXT,
  seen         BOOLEAN NOT NULL DEFAULT FALSE,
  decided      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_id, skill_id, version)
);

-- Index for the primary query pattern: agent_id + decided
CREATE INDEX IF NOT EXISTS idx_svn_agent_undecided
  ON skill_version_notifications(agent_id, decided)
  WHERE decided = FALSE;

-- Index for creator distribution queries (Phase 5)
CREATE INDEX IF NOT EXISTS idx_svn_skill_version
  ON skill_version_notifications(skill_id, version);

COMMENT ON TABLE skill_version_notifications IS
  'One row per (agent, skill, version) when a new skill version is published. Tracks whether the holder has seen and acted on the update.';

COMMENT ON COLUMN skill_version_notifications.decided IS
  'TRUE once agent has adopted, rejected, or pinned in response to this notification.';
