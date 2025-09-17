import knex from 'knex';
import config from '../../server/config/database.js';

let db: any = null;

export async function getDb() {
  if (db) return db;

  const environment = process.env.NODE_ENV || 'development';
  const dbConfig = config[environment];

  try {
    db = knex(dbConfig);

    // Test connection
    await db.raw('SELECT 1');
    console.log('Database connected successfully');

    return db;
  } catch (error) {
    console.error('Database connection failed:', error);

    // In demo mode, return a mock database
    if (process.env.DEMO_MODE === 'true') {
      console.log('Running in DEMO mode - using mock database');
      return getMockDb();
    }

    throw error;
  }
}

function getMockDb() {
  // Mock database for demo mode
  const mockData: any = {
    users: [
      {
        id: 'demo-user-1',
        email: 'demo@verdict360.com',
        password: '$2b$10$YourHashedPasswordHere',
        first_name: 'Demo',
        last_name: 'User',
        role: 'user',
        tenant_id: 'demo-tenant'
      }
    ],
    tenants: [
      {
        id: 'demo-tenant',
        name: 'Demo Law Firm',
        subdomain: 'demo',
        settings: JSON.stringify({
          primaryColor: '#16a34a',
          logo: null
        })
      }
    ]
  };

  const mockDb = (tableName: string) => ({
    where: (conditions: any) => ({
      first: async () => {
        if (tableName === 'users' && conditions.email) {
          return mockData.users.find((u: any) => u.email === conditions.email);
        }
        return null;
      }
    }),

    insert: async (data: any) => ({
      returning: () => [{ ...data, id: `demo-${Date.now()}` }]
    }),

    select: async () => mockData[tableName] || [],

    first: async () => mockData[tableName]?.[0] || null
  });

  // Add additional properties
  (mockDb as any).raw = async (query: string) => {
    if (query === 'SELECT 1') return { rows: [{ '?column?': 1 }] };
    return { rows: [] };
  };

  (mockDb as any).destroy = async () => {
    console.log('Closing mock database connection');
  };

  return mockDb;
}

export async function closeDb() {
  if (db) {
    await db.destroy();
    db = null;
  }
}