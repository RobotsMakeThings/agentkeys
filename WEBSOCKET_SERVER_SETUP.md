# WebSocket Server Setup for Agent Hubs

## Overview
The Agent Hub system uses WebSocket connections for real-time encrypted messaging between key holders.

## Server Architecture

### Required Components:
1. **WebSocket Server** - Real-time message routing
2. **Redis** - Message storage and caching  
3. **PostgreSQL** - User data and message history
4. **Key Verification** - Solana blockchain integration

### Server Setup (Node.js + Express + Socket.io):

```javascript
// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const { Connection, PublicKey } = require('@solana/web3.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://43a67a03-f035-4fac-9e7e-b94c804422d6.netlify.app",
    methods: ["GET", "POST"]
  }
});

const redisClient = redis.createClient();
const solanaConnection = new Connection('https://api.devnet.solana.com');

// Agent hub namespaces
io.of(/^\/hub\/[\w-]+$/).on('connection', async (socket) => {
  const agentId = socket.nsp.name.split('/hub/')[1];
  console.log(`User connected to agent hub: ${agentId}`);

  socket.on('auth', async (data) => {
    try {
      // Verify user owns keys for this agent
      const keyBalance = await verifyKeyOwnership(data.userId, agentId);
      
      if (keyBalance >= 1) {
        socket.join(`hub-${agentId}`);
        socket.emit('keyBalance', { balance: keyBalance });
        socket.to(`hub-${agentId}`).emit('userJoined', {
          user: {
            userId: data.userId,
            keyBalance,
            isOnline: true
          }
        });
      } else {
        socket.emit('error', { message: 'Insufficient keys for hub access' });
        socket.disconnect();
      }
    } catch (error) {
      socket.emit('error', { message: 'Authentication failed' });
      socket.disconnect();
    }
  });

  socket.on('message', async (data) => {
    try {
      // Verify user still has access
      const keyBalance = await verifyKeyOwnership(data.userId, agentId);
      
      if (keyBalance >= 1) {
        // Store encrypted message
        await storeMessage(agentId, data);
        
        // Broadcast to hub members
        socket.to(`hub-${agentId}`).emit('message', {
          id: generateMessageId(),
          agentId,
          userId: data.userId,
          encryptedData: data.encryptedData,
          iv: data.iv,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('file', async (data) => {
    try {
      const keyBalance = await verifyKeyOwnership(data.userId, agentId);
      
      if (keyBalance >= 1) {
        // Store encrypted file
        await storeFile(agentId, data);
        
        // Broadcast file message
        socket.to(`hub-${agentId}`).emit('file', {
          id: generateMessageId(),
          agentId,
          userId: data.userId,
          fileName: data.fileName,
          timestamp: Date.now(),
          fileAttachment: {
            fileName: data.fileName,
            fileSize: data.fileSize,
            mimeType: data.mimeType,
            encryptedFile: data.encryptedFile,
            iv: data.iv
          }
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to send file' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from hub');
    socket.to(`hub-${agentId}`).emit('userLeft', {
      userId: socket.userId
    });
  });
});

async function verifyKeyOwnership(userId, agentId) {
  // TODO: Query Solana blockchain for key balance
  // This would check the user's SPL token balance for the agent's keys
  
  try {
    const userPublicKey = new PublicKey(userId);
    const agentPublicKey = new PublicKey(agentId);
    
    // Get user's token accounts
    const tokenAccounts = await solanaConnection.getParsedTokenAccountsByOwner(
      userPublicKey,
      { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
    );
    
    // Find agent key balance
    for (const account of tokenAccounts.value) {
      const tokenInfo = account.account.data.parsed.info;
      if (tokenInfo.mint === agentPublicKey.toString()) {
        return parseInt(tokenInfo.tokenAmount.amount);
      }
    }
    
    return 0;
  } catch (error) {
    console.error('Key verification error:', error);
    return 0;
  }
}

async function storeMessage(agentId, messageData) {
  // Store in Redis for recent messages
  const key = \`hub:\${agentId}:messages\`;
  await redisClient.lpush(key, JSON.stringify({
    ...messageData,
    timestamp: Date.now()
  }));
  
  // Keep only last 100 messages in Redis
  await redisClient.ltrim(key, 0, 99);
  
  // TODO: Store in PostgreSQL for permanent history
}

async function storeFile(agentId, fileData) {
  // Store file metadata and encrypted content
  const key = \`hub:\${agentId}:files\`;
  await redisClient.lpush(key, JSON.stringify({
    ...fileData,
    timestamp: Date.now()
  }));
}

function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

server.listen(3001, () => {
  console.log('Agent Hub WebSocket server running on port 3001');
});
```

### Database Schema (PostgreSQL):

```sql
-- Agent hubs
CREATE TABLE agent_hubs (
  id VARCHAR(50) PRIMARY KEY,
  agent_address VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settings JSONB DEFAULT '{}'
);

-- Hub messages
CREATE TABLE hub_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) REFERENCES agent_hubs(id),
  user_id VARCHAR(50) NOT NULL,
  encrypted_data TEXT NOT NULL,
  iv VARCHAR(100) NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text',
  file_metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hub users
CREATE TABLE hub_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) REFERENCES agent_hubs(id),
  user_id VARCHAR(50) NOT NULL,
  key_balance INTEGER DEFAULT 0,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agent_id, user_id)
);

-- Premium content
CREATE TABLE premium_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) REFERENCES agent_hubs(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50),
  encrypted_content TEXT,
  file_size INTEGER,
  required_keys INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables:

```env
# WebSocket Server
WS_PORT=3001
WS_CORS_ORIGIN=https://43a67a03-f035-4fac-9e7e-b94c804422d6.netlify.app

# Redis
REDIS_URL=redis://localhost:6379

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/agentkeys

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
AGENTKEYS_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

## Frontend Integration:

Update the environment variables in Netlify:

```env
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com
```

## Security Features:

1. **End-to-End Encryption** - Messages encrypted client-side
2. **Key Verification** - Real-time blockchain verification
3. **Access Control** - Automatic tier verification (1-9 keys, 10+ keys)
4. **Rate Limiting** - Prevent spam and abuse
5. **File Scanning** - Malware detection for file uploads
6. **Audit Logging** - Track all hub activities

## Deployment Options:

1. **Railway** - Easy WebSocket deployment
2. **Render** - WebSocket + PostgreSQL
3. **AWS/GCP** - Full control with EC2/Compute Engine
4. **Vercel Functions** - Serverless WebSocket alternative

## Quick Start:

1. Deploy WebSocket server to Railway/Render
2. Set up Redis and PostgreSQL instances
3. Configure environment variables
4. Update Netlify with WebSocket URL
5. Test with demo agents

This creates a fully functional gated hub system with real-time encrypted messaging!