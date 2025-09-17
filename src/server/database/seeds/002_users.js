import bcrypt from 'bcryptjs';

export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Hash password for demo users (password: "password123")
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  // Inserts seed entries
  await knex('users').insert([
    // Smith & Associates users
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@smithlegal.co.za',
      password_hash: hashedPassword,
      first_name: 'John',
      last_name: 'Smith',
      role: 'admin',
      status: 'active',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      email: 'sarah.jones@smithlegal.co.za',
      password_hash: hashedPassword,
      first_name: 'Sarah',
      last_name: 'Jones',
      role: 'attorney',
      status: 'active',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      email: 'mike.wilson@smithlegal.co.za',
      password_hash: hashedPassword,
      first_name: 'Mike',
      last_name: 'Wilson',
      role: 'attorney',
      status: 'active',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    
    // Cape Town Legal users
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      tenant_id: '22222222-2222-2222-2222-222222222222',
      email: 'admin@capetownlegal.co.za',
      password_hash: hashedPassword,
      first_name: 'Lisa',
      last_name: 'van Der Merwe',
      role: 'admin',
      status: 'active',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      tenant_id: '22222222-2222-2222-2222-222222222222',
      email: 'david.adams@capetownlegal.co.za',
      password_hash: hashedPassword,
      first_name: 'David',
      last_name: 'Adams',
      role: 'attorney',
      status: 'active',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    
    // Pretoria Family Law users
    {
      id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      tenant_id: '33333333-3333-3333-3333-333333333333',
      email: 'admin@pretoriafamily.co.za',
      password_hash: hashedPassword,
      first_name: 'Amanda',
      last_name: 'Kruger',
      role: 'admin',
      status: 'active',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: '10101010-1010-1010-1010-101010101010',
      tenant_id: '33333333-3333-3333-3333-333333333333',
      email: 'peter.botha@pretoriafamily.co.za',
      password_hash: hashedPassword,
      first_name: 'Peter',
      last_name: 'Botha',
      role: 'attorney',
      status: 'active',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    
    // Demo tenant users
    {
      id: '12121212-1212-1212-1212-121212121212',
      tenant_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      email: 'demo@verdict360.com',
      password_hash: hashedPassword,
      first_name: 'Demo',
      last_name: 'Admin',
      role: 'admin',
      status: 'active',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: '13131313-1313-1313-1313-131313131313',
      tenant_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      email: 'attorney@verdict360.com',
      password_hash: hashedPassword,
      first_name: 'Demo',
      last_name: 'Attorney',
      role: 'attorney',
      status: 'active',
      email_verified_at: knex.fn.now(),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};