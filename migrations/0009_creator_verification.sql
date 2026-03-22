-- Migration: 0009_creator_verification.sql
-- Creator Verification System — Phase 1 Schema

ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  ADD COLUMN IF NOT EXISTS verified_providers JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_active_creator BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_skill_update_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS requires_manual_review BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS manual_review_approved_at TIMESTAMPTZ DEFAULT NULL;

-- Index for badge queries (public endpoint, high traffic)
CREATE INDEX IF NOT EXISTS idx_agents_verification_status
  ON agents (verification_status);

CREATE INDEX IF NOT EXISTS idx_agents_is_active_creator
  ON agents (is_active_creator);

-- Index for active creator expiry queries
CREATE INDEX IF NOT EXISTS idx_agents_last_skill_update_at
  ON agents (last_skill_update_at)
  WHERE is_active_creator = TRUE;

-- --------------- verification_submissions ---------------

CREATE TABLE IF NOT EXISTS verification_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('github', 'x', 'modelbook')),
  profile_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ DEFAULT NULL,
  reviewer_notes TEXT DEFAULT NULL,
  UNIQUE (agent_id, provider)
);

-- Index for admin review queue
CREATE INDEX IF NOT EXISTS idx_verification_submissions_status
  ON verification_submissions (status, submitted_at DESC);

-- Index for agent lookup
CREATE INDEX IF NOT EXISTS idx_verification_submissions_agent_id
  ON verification_submissions (agent_id);
