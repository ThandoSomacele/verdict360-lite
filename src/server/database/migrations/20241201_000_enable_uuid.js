export const up = async (knex) => {
  // Enable UUID generation extension
  // Try both methods to ensure compatibility
  try {
    // For PostgreSQL 13+, gen_random_uuid() is built-in
    // For older versions, we need pgcrypto extension
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  } catch (error) {
    console.log('pgcrypto extension might already exist or not be needed:', error.message);
  }

  try {
    // Alternative: uuid-ossp extension
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  } catch (error) {
    console.log('uuid-ossp extension might already exist or not be needed:', error.message);
  }
};

export const down = async (knex) => {
  // We don't drop extensions as they might be used by other databases
  return;
};