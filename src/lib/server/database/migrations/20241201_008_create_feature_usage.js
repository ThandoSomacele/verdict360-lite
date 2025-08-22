exports.up = function(knex) {
  return knex.schema.createTable('feature_usage', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
    table.string('feature_name').notNullable();
    table.timestamp('used_at').notNullable().defaultTo(knex.fn.now());
    table.json('metadata').defaultTo('{}');
    
    table.index(['tenant_id']);
    table.index(['feature_name']);
    table.index(['used_at']);
    table.index(['tenant_id', 'feature_name']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('feature_usage');
};