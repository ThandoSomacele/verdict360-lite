import knex from 'knex';
import dbConfig from './config/database.js';

const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment as keyof typeof dbConfig];

export const db = knex(config);