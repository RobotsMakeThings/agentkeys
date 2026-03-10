-- AgentKeys Database Schema (Key-Based API Access)

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agents table
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  creator_wallet TEXT NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  api_endpoint TEXT NOT NULL,
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  queries_per_key INTEGER NOT NULL DEFAULT 100,
  bonus_tiers JSONB NOT NULL DEFAULT '[]',
  webhook_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table (one per user-agent pair)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key TEXT UNIQUE NOT NULL,
  buyer_wallet TEXT NOT NULL,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  keys_held INTEGER NOT NULL DEFAULT 0,
  daily_quota INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(buyer_wallet, agent_id)
);

-- Daily API usage tracking
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calls_made INTEGER NOT NULL DEFAULT 0,
  UNIQUE(api_key_id, date)
);

-- API call logs
CREATE TABLE api_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  buyer_wallet TEXT NOT NULL,
  query TEXT NOT NULL,
  response_status INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX idx_api_keys_buyer ON api_keys(buyer_wallet);
CREATE INDEX idx_api_keys_agent ON api_keys(agent_id);
CREATE INDEX idx_api_usage_key_date ON api_usage(api_key_id, date);
CREATE INDEX idx_api_calls_agent ON api_calls(agent_id);
CREATE INDEX idx_api_calls_created ON api_calls(created_at);

-- RLS Policies
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_calls ENABLE ROW LEVEL SECURITY;

-- Everyone can view agents
CREATE POLICY "Agents viewable by all" ON agents FOR SELECT USING (true);

-- Users can only see their own API keys
CREATE POLICY "Users own their keys" ON api_keys 
  FOR ALL USING (buyer_wallet = current_setting('request.jwt.claims', true)::json->>'wallet');

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Get usage stats function
CREATE OR REPLACE FUNCTION get_agent_stats(agent_id_param TEXT)
RETURNS TABLE (
  total_calls BIGINT,
  unique_users BIGINT,
  avg_response_time NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    COUNT(DISTINCT buyer_wallet)::BIGINT,
    AVG(response_time_ms)::NUMERIC
  FROM api_calls
  WHERE agent_id = agent_id_param
  AND created_at >= NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
