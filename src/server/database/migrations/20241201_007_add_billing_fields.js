exports.up = function(knex) {
  return knex.schema.table('tenants', function(table) {
    table.string('stripe_customer_id').nullable();
    table.string('stripe_subscription_id').nullable();
    table.enum('subscription_status', [
      'inactive', 
      'trialing', 
      'active', 
      'past_due', 
      'canceled', 
      'unpaid'
    ]).defaultTo('inactive');
    table.enum('subscription_plan', ['basic', 'pro', 'enterprise']).nullable();
    table.timestamp('trial_ends_at').nullable();
    table.timestamp('subscription_ends_at').nullable();
    
    table.index(['stripe_customer_id']);
    table.index(['stripe_subscription_id']);
    table.index(['subscription_status']);
    table.index(['subscription_plan']);
  });
};

exports.down = function(knex) {
  return knex.schema.table('tenants', function(table) {
    table.dropColumn('stripe_customer_id');
    table.dropColumn('stripe_subscription_id');
    table.dropColumn('subscription_status');
    table.dropColumn('subscription_plan');
    table.dropColumn('trial_ends_at');
    table.dropColumn('subscription_ends_at');
  });
};