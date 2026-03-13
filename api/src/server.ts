import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Solana connection
const connection = new Connection(
  process.env.RPC_ENDPOINT || 'https://api.devnet.solana.com'
);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.get('/api/v1/agents', async (req, res) => {
  try {
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: agents
    });
  } catch (error) {
    logger.error('Failed to fetch agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents'
    });
  }
});

app.get('/api/v1/agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    logger.error(`Failed to fetch agent ${req.params.id}:`, error);
    res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }
});

app.post('/api/v1/keys/buy', async (req, res) => {
  try {
    const { agentId, amount, signature } = req.body;

    // Verify signature
    // TODO: Add signature verification logic

    // Record transaction
    const { data: purchase, error } = await supabase
      .from('key_purchases')
      .insert({
        agent_id: agentId,
        amount,
        signature,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    logger.error('Failed to process key purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process purchase'
    });
  }
});

app.get('/api/v1/portfolio/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;

    const { data: holdings, error } = await supabase
      .from('key_purchases')
      .select(`
        *,
        agents:agent_id (*)
      `)
      .eq('buyer_wallet', wallet);

    if (error) throw error;

    res.json({
      success: true,
      data: holdings
    });
  } catch (error) {
    logger.error(`Failed to fetch portfolio for ${req.params.wallet}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio'
    });
  }
});

app.post('/api/v1/agents/register', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      wallet, 
      twitter, 
      category,
      signature 
    } = req.body;

    // Verify signature
    // TODO: Add signature verification

    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        name,
        description,
        wallet,
        twitter,
        category,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    logger.error('Failed to register agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register agent'
    });
  }
});

// Analytics endpoints
app.get('/api/v1/analytics/overview', async (req, res) => {
  try {
    const [agentsCount, totalVolume, totalHolders] = await Promise.all([
      supabase.from('agents').select('id', { count: 'exact' }),
      supabase.from('key_purchases').select('amount.sum()'),
      supabase.from('key_purchases').select('buyer_wallet', { count: 'exact' })
    ]);

    res.json({
      success: true,
      data: {
        totalAgents: agentsCount.count || 0,
        totalVolume: totalVolume.data?.[0]?.sum || 0,
        totalHolders: totalHolders.count || 0
      }
    });
  } catch (error) {
    logger.error('Failed to fetch analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  logger.info(`AgentKeys API server running on port ${PORT}`);
});

export default app;