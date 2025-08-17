exports.up = function(knex) {
  return knex.schema.createTable('tenant_integrations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
    table.enum('integration_type', [
      'google_calendar',
      'outlook_calendar', 
      'zoom',
      'teams',
      'slack',
      'webhooks'
    ]).notNullable();
    table.text('access_token').nullable();
    table.text('refresh_token').nullable();
    table.timestamp('token_expiry').nullable();
    table.boolean('is_active').defaultTo(true);
    table.json('metadata').defaultTo('{}');
    table.timestamps(true, true);
    
    table.unique(['tenant_id', 'integration_type']);
    table.index(['tenant_id']);
    table.index(['integration_type']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tenant_integrations');
};