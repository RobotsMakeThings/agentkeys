-- AgentKeys Database Schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    wallet VARCHAR(44) NOT NULL UNIQUE,
    twitter VARCHAR(100),
    category VARCHAR(50),
    avatar_url TEXT,
    banner_url TEXT,
    website_url TEXT,
    total_keys_sold INTEGER DEFAULT 0,
    total_volume DECIMAL DEFAULT 0,
    holder_count INTEGER DEFAULT 0,
    current_price DECIMAL DEFAULT 0,
    market_cap DECIMAL DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Key purchases table
CREATE TABLE key_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    buyer_wallet VARCHAR(44) NOT NULL,
    seller_wallet VARCHAR(44),
    amount DECIMAL NOT NULL,
    price DECIMAL NOT NULL,
    transaction_type VARCHAR(10) CHECK (transaction_type IN ('BUY', 'SELL')),
    signature VARCHAR(128) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent stats table (daily snapshots)
CREATE TABLE agent_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price DECIMAL NOT NULL,
    volume DECIMAL DEFAULT 0,
    holder_count INTEGER DEFAULT 0,
    keys_sold INTEGER DEFAULT 0,
    market_cap DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, date)
);

-- User portfolios (derived from purchases)
CREATE VIEW user_portfolios AS
SELECT 
    buyer_wallet,
    agent_id,
    SUM(CASE WHEN transaction_type = 'BUY' THEN amount 
             WHEN transaction_type = 'SELL' THEN -amount 
             ELSE 0 END) as keys_held,
    AVG(CASE WHEN transaction_type = 'BUY' THEN price ELSE NULL END) as avg_buy_price,
    MAX(created_at) as last_transaction
FROM key_purchases 
GROUP BY buyer_wallet, agent_id
HAVING SUM(CASE WHEN transaction_type = 'BUY' THEN amount 
                WHEN transaction_type = 'SELL' THEN -amount 
                ELSE 0 END) > 0;

-- Indexes for performance
CREATE INDEX idx_agents_wallet ON agents(wallet);
CREATE INDEX idx_agents_category ON agents(category);
CREATE INDEX idx_agents_created_at ON agents(created_at);
CREATE INDEX idx_key_purchases_agent_id ON key_purchases(agent_id);
CREATE INDEX idx_key_purchases_buyer_wallet ON key_purchases(buyer_wallet);
CREATE INDEX idx_key_purchases_created_at ON key_purchases(created_at);
CREATE INDEX idx_agent_stats_agent_id ON agent_stats(agent_id);
CREATE INDEX idx_agent_stats_date ON agent_stats(date);

-- Row Level Security (RLS)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_stats ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Allow public read access to agents" ON agents
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to key purchases" ON key_purchases
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to agent stats" ON agent_stats
    FOR SELECT USING (true);

-- Functions for updating agent stats
CREATE OR REPLACE FUNCTION update_agent_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total keys sold and volume
    UPDATE agents SET
        total_keys_sold = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM key_purchases 
            WHERE agent_id = NEW.agent_id AND transaction_type = 'BUY'
        ),
        total_volume = (
            SELECT COALESCE(SUM(amount * price), 0) 
            FROM key_purchases 
            WHERE agent_id = NEW.agent_id
        ),
        holder_count = (
            SELECT COUNT(DISTINCT buyer_wallet) 
            FROM user_portfolios 
            WHERE agent_id = NEW.agent_id
        ),
        updated_at = NOW()
    WHERE id = NEW.agent_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stats on purchases
CREATE TRIGGER update_agent_stats_trigger
    AFTER INSERT OR UPDATE ON key_purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_agent_stats();

-- Insert sample agents for development
INSERT INTO agents (name, description, wallet, category, verified) VALUES
('Oshi Flagship', 'The original Oshi trading agent with proven performance', 'AoxqEL3WPE7kCWL1PnQ3c5YU6DjxiPTVEgPGM4WsWjJW', 'trading', true),
('Research OS', 'Advanced research and analysis AI agent', 'BpxrEL4XQF8kDXM2QoR4d6ZV7EkyjQUWFhQHN5XtXkKX', 'research', true),
('Trade Pilot', 'Automated trading execution and portfolio management', 'CqysFL5YRG9lEYN3RpS5e7aW8FlzkRVXGiRIO6YuYlLY', 'trading', false),
('Alpha Scout', 'Early opportunity detection and market intelligence', 'DrztGM6ZSH0mFZO4SqT6f8bX9GmAlSWYHjSJP7ZvZmMZ', 'research', false),
('Yield Farmer', 'DeFi yield optimization and farming strategies', 'EsAuHN7aTI1nGaP5TrU7g9cY0HnBmTXZIkTKQ8AwAnN', 'defi', false),
('Meme Hunter', 'Social sentiment analysis and meme coin detection', 'FtBvIO8bUJ2oHbQ6UsV8h0dZ1IoCnUYaJlULR9BxBoO', 'social', false);

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;