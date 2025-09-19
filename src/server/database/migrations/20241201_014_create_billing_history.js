export function up(knex) {
  return knex.schema.createTable('billing_history', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    table.string('invoice_id').notNullable();
    table.integer('amount').notNullable(); // Amount in cents
    table.string('currency', 3).notNullable().defaultTo('zar');
    table.enum('status', ['pending', 'paid', 'failed', 'refunded']).notNullable();
    table.timestamp('paid_at');
    table.string('invoice_url');
    table.string('payment_method');
    table.jsonb('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('tenant_id');
    table.index('invoice_id');
    table.index('status');
    table.index('created_at');
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('billing_history');
}