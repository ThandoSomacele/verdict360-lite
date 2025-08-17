exports.up = function(knex) {
  return knex.schema.createTable('messages', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('conversation_id').references('id').inTable('conversations').onDelete('CASCADE');
    table.enum('sender_type', ['visitor', 'bot', 'attorney']).notNullable();
    table.uuid('sender_id').nullable();
    table.text('content').notNullable();
    table.json('metadata').defaultTo('{}');
    table.timestamp('sent_at').defaultTo(knex.fn.now());
    table.timestamps(true, true);
    
    table.index(['conversation_id']);
    table.index(['sender_type']);
    table.index(['sent_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};