export const up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
    table.string('email').notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.enum('role', ['admin', 'attorney', 'staff']).defaultTo('staff');
    table.enum('status', ['active', 'inactive', 'pending']).defaultTo('pending');
    table.string('avatar_url').nullable();
    table.json('preferences').defaultTo('{}');
    table.timestamp('last_login_at').nullable();
    table.timestamp('email_verified_at').nullable();
    table.string('email_verification_token').nullable();
    table.string('password_reset_token').nullable();
    table.timestamp('password_reset_expires_at').nullable();
    table.timestamps(true, true);
    
    table.unique(['tenant_id', 'email']);
    table.index(['tenant_id']);
    table.index(['email']);
    table.index(['role']);
    table.index(['status']);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('users');
};