export const up = function(knex) {
  return knex.schema.createTable('leads', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable();
    table.string('phone').nullable();
    table.text('legal_issue').nullable();
    table.enum('status', ['new', 'contacted', 'scheduled', 'converted', 'closed']).defaultTo('new');
    table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium');
    table.uuid('assigned_attorney_id').references('id').inTable('users').nullable();
    table.json('consultation_details').nullable();
    table.timestamp('consultation_scheduled_at').nullable();
    table.text('notes').nullable();
    table.json('metadata').defaultTo('{}');
    table.timestamps(true, true);
    
    table.index(['tenant_id']);
    table.index(['status']);
    table.index(['assigned_attorney_id']);
    table.index(['consultation_scheduled_at']);
    table.index(['created_at']);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('leads');
};