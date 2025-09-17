export const up = function(knex) {
  return knex.schema.createTable('appointments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
    table.string('calendar_event_id').nullable(); // Google Calendar event ID
    table.string('client_name').notNullable();
    table.string('client_email').notNullable();
    table.string('client_phone').nullable();
    table.text('legal_issue').notNullable();
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.enum('status', [
      'scheduled',
      'confirmed', 
      'completed',
      'cancelled',
      'no_show',
      'rescheduled'
    ]).defaultTo('scheduled');
    table.string('meeting_link').nullable(); // Google Meet or Zoom link
    table.text('notes').nullable();
    table.string('attorney_email').nullable();
    table.json('metadata').defaultTo('{}');
    table.timestamps(true, true);
    
    table.index(['tenant_id']);
    table.index(['client_email']);
    table.index(['start_time']);
    table.index(['status']);
    table.index(['calendar_event_id']);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('appointments');
};