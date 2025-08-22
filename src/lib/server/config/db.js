const knex = require('knex');
const config = require('./database');
const logger = require('../utils/logger');

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

let db = null;

const connectDatabase = async () => {
  try {
    db = knex(dbConfig);
    
    await db.raw('SELECT 1');
    logger.info(`🗄️  Database connected successfully (${environment})`);
    
    return db;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return db;
};

const disconnectDatabase = async () => {
  if (db) {
    await db.destroy();
    db = null;
    logger.info('Database disconnected');
  }
};

module.exports = {
  connectDatabase,
  getDatabase,
  disconnectDatabase
};