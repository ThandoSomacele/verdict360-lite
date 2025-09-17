export const up = function(knex) {
  return knex.schema.createTable('conversations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
    table.uuid('lead_id').references('id').inTable('leads').nullable();
    table.string('visitor_id').notNullable();
    table.enum('status', ['active', 'completed', 'abandoned']).defaultTo('active');
    table.json('visitor_info').defaultTo('{}');
    table.integer('message_count').defaultTo(0);
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('ended_at').nullable();
    table.timestamps(true, true);
    
    table.index(['tenant_id']);
    table.index(['lead_id']);
    table.index(['visitor_id']);
    table.index(['status']);
    table.index(['started_at']);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('conversations');
};