export const up = function(knex) {
  return knex.schema.table('tenants', function(table) {
    // These fields are already added in 20241201_001_create_tenants.js
    // Only add fields that don't exist yet
    table.enum('subscription_plan', ['basic', 'pro', 'enterprise']).nullable();
    table.timestamp('subscription_ends_at').nullable();
    
    table.index(['subscription_plan']);
  });
};

export const down = function(knex) {
  return knex.schema.table('tenants', function(table) {
    table.dropColumn('subscription_plan');
    table.dropColumn('subscription_ends_at');
  });
};