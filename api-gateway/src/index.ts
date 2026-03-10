import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Connection, PublicKey } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const queryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Rate limit exceeded'
});

// Initialize Solana
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Types
interface AgentConfig {
  id: string;
  creator_wallet: string;
  name: string;
  symbol: string;
  api_endpoint: string;
  capabilities: string[];
  queries_per_key: number;
  bonus_tiers: { min_keys: number; bonus_percent: number }[];
  webhook_url?: string;
}

interface ApiKeyRecord {
  id: string;
  api_key: string;
  buyer_wallet: string;
  agent_id: string;
  keys_held: number;
  daily_quota: number;
  is_active: boolean;
  created_at: string;
}

// Calculate daily quota with bonuses
function calculateQuota(keysHeld: number, agent: AgentConfig): number {
  const baseQuota = keysHeld * agent.queries_per_key;
  
  // Sort tiers by min_keys descending to find highest applicable
  const sortedTiers = [...agent.bonus_tiers].sort((a, b) => b.min_keys - a.min_keys);
  const applicableTier = sortedTiers.find(t => keysHeld >= t.min_keys);
  
  const bonus = applicableTier?.bonus_percent || 0;
  return Math.floor(baseQuota * (100 + bonus) / 100);
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate API key after purchase
app.post('/api/generate-key', async (req: Request, res: Response) => {
  try {
    const { agentId, buyerWallet, txSignature, amount } = req.body;

    if (!agentId || !buyerWallet || !txSignature || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get agent config
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Generate unique API key
    const apiKey = `ak_${crypto.randomBytes(32).toString('hex')}`;
    
    // Calculate daily quota
    const dailyQuota = calculateQuota(amount, agent);

    // Store API key
    const { error: insertError } = await supabase
      .from('api_keys')
      .insert({
        api_key: apiKey,
        buyer_wallet: buyerWallet,
        agent_id: agentId,
        keys_held: amount,
        daily_quota: dailyQuota,
        is_active: true
      });

    if (insertError) {
      console.error('Error storing API key:', insertError);
      return res.status(500).json({ error: 'Failed to generate API key' });
    }

    res.json({
      apiKey,
      dailyQuota,
      keysHeld: amount,
      agent: {
        name: agent.name,
        capabilities: agent.capabilities
      }
    });
  } catch (error) {
    console.error('Generate key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Query agent
app.post('/api/query', queryLimiter, async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const { query, context } = req.body;
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    if (!query) {
      return res.status(400).json({ error: 'Query required' });
    }

    // Get API key record
    const { data: keyRecord, error: keyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();

    if (keyError || !keyRecord) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Get agent config
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', keyRecord.agent_id)
      .single();

    if (agentError || !agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Check daily usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('api_usage')
      .select('calls_made')
      .eq('api_key_id', keyRecord.id)
      .eq('date', today)
      .single();

    const callsMade = usage?.calls_made || 0;
    
    if (callsMade >= keyRecord.daily_quota) {
      return res.status(429).json({
        error: 'Daily quota exceeded',
        quota: keyRecord.daily_quota,
        used: callsMade,
        message: 'Buy more keys to increase your daily quota'
      });
    }

    // Forward to agent
    let agentResponse;
    try {
      agentResponse = await axios.post(
        agent.api_endpoint,
        {
          query,
          context: {
            ...context,
            buyer_wallet: keyRecord.buyer_wallet,
            keys_held: keyRecord.keys_held,
            quota_remaining: keyRecord.daily_quota - callsMade - 1
          }
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            'X-Source': 'agentkeys-gateway',
            'X-Buyer-Wallet': keyRecord.buyer_wallet
          }
        }
      );
    } catch (error: any) {
      console.error('Agent error:', error.message);
      return res.status(502).json({
        error: 'Agent unavailable',
        message: error.message
      });
    }

    // Update usage
    await supabase
      .from('api_usage')
      .upsert({
        api_key_id: keyRecord.id,
        date: today,
        calls_made: callsMade + 1
      }, { onConflict: 'api_key_id,date' });

    // Log call
    const responseTime = Date.now() - startTime;
    await supabase.from('api_calls').insert({
      api_key_id: keyRecord.id,
      agent_id: keyRecord.agent_id,
      buyer_wallet: keyRecord.buyer_wallet,
      query: query.substring(0, 1000),
      response_status: agentResponse.status,
      response_time_ms: responseTime
    });

    // Webhook
    if (agent.webhook_url) {
      axios.post(agent.webhook_url, {
        event: 'api_call',
        buyer_wallet: keyRecord.buyer_wallet,
        query: query.substring(0, 500),
        timestamp: new Date().toISOString()
      }).catch(() => {});
    }

    res.json({
      success: true,
      data: agentResponse.data,
      quota: {
        daily: keyRecord.daily_quota,
        used: callsMade + 1,
        remaining: keyRecord.daily_quota - callsMade - 1
      },
      agent: {
        name: agent.name,
        capabilities: agent.capabilities
      }
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get API key status
app.get('/api/key-status', async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const { data: keyRecord, error } = await supabase
      .from('api_keys')
      .select(`
        *,
        agents (name, capabilities, queries_per_key, bonus_tiers)
      `)
      .eq('api_key', apiKey)
      .single();

    if (error || !keyRecord) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Get today's usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('api_usage')
      .select('calls_made')
      .eq('api_key_id', keyRecord.id)
      .eq('date', today)
      .single();

    res.json({
      agent: keyRecord.agents,
      keysHeld: keyRecord.keys_held,
      dailyQuota: keyRecord.daily_quota,
      usedToday: usage?.calls_made || 0,
      remainingToday: keyRecord.daily_quota - (usage?.calls_made || 0),
      isActive: keyRecord.is_active
    });
  } catch (error) {
    console.error('Key status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register agent
app.post('/api/register-agent', async (req: Request, res: Response) => {
  try {
    const {
      agentId,
      creatorWallet,
      name,
      symbol,
      apiEndpoint,
      capabilities,
      queriesPerKey,
      bonusTiers,
      webhookUrl
    } = req.body;

    if (!agentId || !creatorWallet || !name || !apiEndpoint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate endpoint
    try {
      await axios.get(apiEndpoint.replace('/query', '/health'), { 
        timeout: 5000 
      });
    } catch {
      // Continue even if no health endpoint
    }

    const { error } = await supabase
      .from('agents')
      .insert({
        id: agentId,
        creator_wallet: creatorWallet,
        name,
        symbol,
        api_endpoint: apiEndpoint,
        capabilities: capabilities || [],
        queries_per_key: queriesPerKey || 100,
        bonus_tiers: bonusTiers || [],
        webhook_url: webhookUrl,
        is_active: true
      });

    if (error) {
      console.error('Register error:', error);
      return res.status(500).json({ error: 'Failed to register' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update keys held (called when user buys/sells)
app.post('/api/update-keys', async (req: Request, res: Response) => {
  try {
    const { buyerWallet, agentId, newAmount } = req.body;

    // Get agent
    const { data: agent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Calculate new quota
    const newQuota = calculateQuota(newAmount, agent);

    // Update API key
    const { error } = await supabase
      .from('api_keys')
      .update({
        keys_held: newAmount,
        daily_quota: newQuota
      })
      .eq('buyer_wallet', buyerWallet)
      .eq('agent_id', agentId);

    if (error) {
      return res.status(500).json({ error: 'Update failed' });
    }

    res.json({
      success: true,
      newQuota,
      keysHeld: newAmount
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agent stats
app.get('/api/agent-stats/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const creatorWallet = req.headers['x-creator-wallet'] as string;

    const { data: agent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('creator_wallet', creatorWallet)
      .single();

    if (!agent) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data: calls } = await supabase
      .from('api_calls')
      .select('*')
      .eq('agent_id', agentId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const totalCalls = calls?.length || 0;
    const avgTime = calls?.reduce((a, c) => a + c.response_time_ms, 0) / (totalCalls || 1);
    const uniqueUsers = new Set(calls?.map(c => c.buyer_wallet)).size;

    res.json({
      totalCalls,
      avgResponseTime: Math.round(avgTime),
      uniqueUsers,
      totalRevenue: totalCalls * 0.001
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`AgentKeys API Gateway on port ${PORT}`);
});

export default app;
