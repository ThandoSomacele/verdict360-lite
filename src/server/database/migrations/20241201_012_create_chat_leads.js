export function up(knex) {
  return knex.schema.createTable('chat_leads', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('tenant_id').notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.text('enquiry_details').notNullable();
    table.text('additional_message');
    table.enum('preferred_contact', ['email', 'phone']).defaultTo('email');
    table.enum('status', ['new', 'contacted', 'qualified', 'converted', 'archived']).defaultTo('new');
    table.json('conversation_history'); // Store the chat conversation
    table.string('source').defaultTo('chat_widget');
    table.timestamp('contacted_at');
    table.uuid('assigned_to'); // Attorney/staff member assigned
    table.text('internal_notes');
    table.timestamps(true, true);

    // Indexes
    table.index('tenant_id');
    table.index('status');
    table.index('created_at');
    table.index('email');

    // Foreign keys
    table.foreign('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
    table.foreign('assigned_to').references('id').inTable('users');
  });
}

export function down(knex) {
  return knex.schema.dropTable('chat_leads');
}