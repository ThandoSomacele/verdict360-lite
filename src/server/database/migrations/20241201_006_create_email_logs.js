exports.up = function(knex) {
  return knex.schema.createTable('email_logs', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
    table.string('recipient_email').notNullable();
    table.string('subject').notNullable();
    table.enum('type', [
      'consultation_confirmation',
      'attorney_notification', 
      'welcome',
      'reminder',
      'marketing',
      'system'
    ]).notNullable();
    table.enum('status', ['sent', 'failed', 'pending', 'bounced']).defaultTo('pending');
    table.string('message_id').nullable();
    table.text('error_message').nullable();
    table.json('metadata').defaultTo('{}');
    table.timestamp('sent_at').nullable();
    table.timestamps(true, true);
    
    table.index(['tenant_id']);
    table.index(['recipient_email']);
    table.index(['type']);
    table.index(['status']);
    table.index(['sent_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('email_logs');
};