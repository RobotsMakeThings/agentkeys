const express = require('express');
const http = require('http');
const cors = require('cors');
const LiveDataFeed = require('./websocket/liveDataFeed');
const agentsRouter = require('./routes/agents');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/agents', agentsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: 'running',
      websocket: 'running'
    }
  });
});

// Initialize WebSocket
const liveDataFeed = new LiveDataFeed(server);

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 AgentKeys Backend API running on port ${PORT}`);
  console.log(`📊 Live data feed active`);
  console.log(`🔌 WebSocket server ready`);
});

module.exports = { app, server, liveDataFeed };