export function up(knex) {
  return knex.schema.createTable('refresh_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('token').notNullable().unique();
    table.timestamp('expires_at').notNullable();
    table.boolean('is_revoked').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('user_id');
    table.index('token');
    table.index(['expires_at', 'is_revoked']);
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
}