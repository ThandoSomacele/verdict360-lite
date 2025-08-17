const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

const { connectDatabase } = require('./config/db');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');
const { resolveTenant } = require('./middleware/tenant');
const { globalRateLimit } = require('./middleware/rateLimit');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();
    
    app.use(helmet());
    app.use(compression());
    app.use(cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3001",
      credentials: true
    }));
    
    app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    app.use(resolveTenant);
    app.use(globalRateLimit);
    
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
      });
    });
    
    const authRoutes = require('./routes/auth');
    const tenantRoutes = require('./routes/tenants');
    const leadRoutes = require('./routes/leads');
    const chatRoutes = require('./routes/chat');
    const analyticsRoutes = require('./routes/analytics');
    const aiRoutes = require('./routes/ai');
    const billingRoutes = require('./routes/billing');
    const calendarRoutes = require('./routes/calendar');
    const adminRoutes = require('./routes/admin');
    const dashboardRoutes = require('./routes/dashboard');
    
    app.use('/api/auth', authRoutes);
    app.use('/api/tenants', tenantRoutes);
    app.use('/api/leads', leadRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/analytics', analyticsRoutes);
    app.use('/api/ai', aiRoutes);
    app.use('/api/billing', billingRoutes);
    app.use('/api/calendar', calendarRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    
    app.use('/api/*', (req, res) => {
      res.status(404).json({ error: 'API endpoint not found' });
    });
    
    app.use(errorHandler);
    
    const chatSocketService = require('./services/chatSocket');
    const chatSocket = chatSocketService(io);
    
    // Make chatSocket available to other parts of the application
    app.set('chatSocket', chatSocket);
    
    server.listen(PORT, () => {
      logger.info(`🚀 Verdict 360 server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

startServer();