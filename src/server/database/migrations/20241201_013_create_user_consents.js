/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('user_consents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('consent_type', 50).notNullable(); // 'marketing', 'data_processing', 'cookies', etc.
    table.enum('status', ['granted', 'withdrawn']).notNullable();
    table.jsonb('metadata'); // Store additional consent details
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index(['tenant_id', 'user_id', 'consent_type']);
    table.index(['status']);
    table.index(['created_at']);

    // Ensure only one active consent per type per user
    table.unique(['tenant_id', 'user_id', 'consent_type']);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('user_consents');
}