export const up = function(knex) {
  return knex.schema.table('users', function(table) {
    // Add admin role support and allow platform admins without tenant
    table.dropForeign('tenant_id'); // Remove the foreign key constraint
    table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
    // Role index already exists from 20241201_002_create_users.js
  })
  .then(() => {
    // Allow tenant_id to be null for platform admins
    return knex.schema.alterTable('users', function(table) {
      table.uuid('tenant_id').nullable().alter();
    });
  });
};

export const down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.uuid('tenant_id').notNullable().alter();
  });
};