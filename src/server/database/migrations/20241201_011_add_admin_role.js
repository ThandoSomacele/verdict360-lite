exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    // Add admin role support and allow platform admins without tenant
    table.dropForeign('tenant_id'); // Remove the foreign key constraint
    table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
    table.index(['role']);
    table.index(['is_active']);
  })
  .then(() => {
    // Update role enum to include admin
    return knex.raw(`
      ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
    `);
  })
  .then(() => {
    // Allow tenant_id to be null for platform admins
    return knex.schema.alterTable('users', function(table) {
      table.uuid('tenant_id').nullable().alter();
    });
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.uuid('tenant_id').notNullable().alter();
  });
};