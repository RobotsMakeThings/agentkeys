-- AgentKeys Initial Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE agent_category AS ENUM (
    'Trading', 'Research', 'Development', 'Marketing', 
    'Design', 'Writing', 'Analysis', 'Automation', 
    'Education', 'Entertainment'
);

CREATE TYPE transaction_type AS ENUM (
    'BUY', 'SELL', 'REWARD', 'FEE_CLAIM', 'AIRDROP'
);

CREATE TYPE access_type AS ENUM (
    'OneTime', 'Subscription', 'Tiered', 'TimePass'
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(44) UNIQUE NOT NULL,
    username VARCHAR(32) UNIQUE,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    profile_data JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}'
);

-- Agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_address VARCHAR(44) UNIQUE NOT NULL,
    name VARCHAR(32) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    description TEXT,
    category agent_category NOT NULL,
    github_url VARCHAR(255),
    twitter_handle VARCHAR(50),
    token_mint VARCHAR(44) UNIQUE NOT NULL,
    total_keys BIGINT DEFAULT 0,
    total_holders INTEGER DEFAULT 0,
    market_cap DECIMAL(20,6) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE
);

-- Agent Holdings table (tracks user token balances)
CREATE TABLE agent_holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    token_amount BIGINT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, agent_id)
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signature VARCHAR(88) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),
    transaction_type transaction_type NOT NULL,
    token_amount BIGINT,
    sol_amount BIGINT,
    price_per_token DECIMAL(20,9),
    fees_paid BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    block_time TIMESTAMP WITH TIME ZONE,
    confirmed BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'
);

-- Agent Fees table (tracks creator earnings)
CREATE TABLE agent_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_fees BIGINT DEFAULT 0,
    claimable_fees BIGINT DEFAULT 0,
    total_claimed BIGINT DEFAULT 0,
    last_claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access Rules table
CREATE TABLE access_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rule_address VARCHAR(44) UNIQUE NOT NULL,
    resource_id VARCHAR(64) NOT NULL,
    min_tokens_required BIGINT NOT NULL,
    access_type access_type NOT NULL,
    expiry_duration INTEGER, -- in seconds
    is_active BOOLEAN DEFAULT TRUE,
    total_accesses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access Grants table
CREATE TABLE access_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    access_rule_id UUID REFERENCES access_rules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    grant_address VARCHAR(44) UNIQUE NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE
);

-- Price History table (for charts and analytics)
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    price DECIMAL(20,9) NOT NULL,
    supply BIGINT NOT NULL,
    market_cap DECIMAL(20,6),
    volume_24h DECIMAL(20,6) DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),
    data JSONB NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_agents_creator ON agents(creator_id);
CREATE INDEX idx_agents_category ON agents(category);
CREATE INDEX idx_agents_active ON agents(is_active) WHERE is_active = true;
CREATE INDEX idx_holdings_user ON agent_holdings(user_id);
CREATE INDEX idx_holdings_agent ON agent_holdings(agent_id);
CREATE INDEX idx_holdings_amount ON agent_holdings(token_amount) WHERE token_amount > 0;
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_agent ON transactions(agent_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_confirmed ON transactions(confirmed) WHERE confirmed = true;
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_fees_agent ON agent_fees(agent_id);
CREATE INDEX idx_fees_creator ON agent_fees(creator_id);
CREATE INDEX idx_access_rules_agent ON access_rules(agent_id);
CREATE INDEX idx_access_rules_active ON access_rules(is_active) WHERE is_active = true;
CREATE INDEX idx_access_grants_rule ON access_grants(access_rule_id);
CREATE INDEX idx_access_grants_user ON access_grants(user_id);
CREATE INDEX idx_access_grants_active ON access_grants(is_active) WHERE is_active = true;
CREATE INDEX idx_price_history_agent ON price_history(agent_id);
CREATE INDEX idx_price_history_timestamp ON price_history(timestamp DESC);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(read) WHERE read = false;

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_fees_updated_at BEFORE UPDATE ON agent_fees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_access_rules_updated_at BEFORE UPDATE ON access_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();