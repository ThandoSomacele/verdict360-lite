import bcrypt from 'bcrypt';

export async function seed(knex) {
  // Check if demo users already exist
  const adminExists = await knex('users')
    .where('email', 'admin@verdict360.com')
    .first();

  const userExists = await knex('users')
    .where('email', 'user@demo.com')
    .first();

  const demoTenant = await knex('tenants')
    .where('id', '11111111-1111-1111-1111-111111111111')
    .first();

  if (demoTenant && !adminExists) {
    // Create admin user
    await knex('users').insert({
      id: '22222222-2222-2222-2222-222222222222',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@verdict360.com',
      password_hash: await bcrypt.hash('admin123', 10),
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✓ Demo admin user created');
  }

  if (demoTenant && !userExists) {
    // Create regular user
    await knex('users').insert({
      id: '33333333-3333-3333-3333-333333333333',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      email: 'user@demo.com',
      password_hash: await bcrypt.hash('demo123', 10),
      first_name: 'Demo',
      last_name: 'User',
      role: 'staff',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✓ Demo regular user created');
  }

  console.log('Demo users seeding completed');
}