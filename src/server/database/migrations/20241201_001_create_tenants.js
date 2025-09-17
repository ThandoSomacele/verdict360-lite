export const up = function(knex) {
  return knex.schema.createTable('tenants', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('subdomain').unique().notNullable();
    table.string('custom_domain').nullable();
    table.string('email').notNullable();
    table.string('phone').nullable();
    table.text('address').nullable();
    table.json('branding').defaultTo('{}');
    table.json('settings').defaultTo('{}');
    table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    table.enum('subscription_status', ['trial', 'active', 'past_due', 'canceled']).defaultTo('trial');
    table.string('stripe_customer_id').nullable();
    table.string('stripe_subscription_id').nullable();
    table.timestamp('trial_ends_at').nullable();
    table.timestamps(true, true);
    
    table.index(['subdomain']);
    table.index(['custom_domain']);
    table.index(['status']);
    table.index(['subscription_status']);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('tenants');
};