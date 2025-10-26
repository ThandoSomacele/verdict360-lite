#!/usr/bin/env node

/**
 * Script to create a platform admin user
 * Usage: node create-admin-script.js
 */

require('dotenv').config();
const { connectDatabase, getDatabase } = require('./src/server/config/db');
const { hashPassword } = require('./src/server/utils/auth');

async function createPlatformAdmin() {
  try {
    // Initialize database connection first
    await connectDatabase();
    console.log('👤 Creating platform admin user...');

    const adminData = {
      email: 'admin@verdict360.com',
      password: 'AdminPass123!',
      firstName: 'Platform',
      lastName: 'Admin',
      role: 'admin'
    };

    const hashedPassword = await hashPassword(adminData.password);
    const db = getDatabase();

    // Check if admin already exists
    const existingAdmin = await db('users').where('email', adminData.email).first();
    if (existingAdmin) {
      console.log('✅ Platform admin already exists:', adminData.email);
      console.log('🔐 Login credentials:');
      console.log('   Email:', adminData.email);
      console.log('   Password:', adminData.password);
      console.log('   Dashboard: http://localhost:3001/admin.html');
      process.exit(0);
    }
    
    const [adminUser] = await db('users').insert({
      tenant_id: null, // Platform admin has no tenant
      email: adminData.email,
      password_hash: hashedPassword,
      first_name: adminData.firstName,
      last_name: adminData.lastName,
      role: adminData.role,
      status: 'active'
    }).returning(['id', 'email', 'first_name', 'last_name', 'role']);

    console.log('✅ Platform admin created:', adminUser.email);
    console.log('🔐 Login credentials:');
    console.log('   Email:', adminData.email);
    console.log('   Password:', adminData.password);
    console.log('   Dashboard: http://localhost:3001/admin.html');

    console.log('\n🎉 Platform admin setup complete!');
    console.log('Now you can:');
    console.log('1. Visit: http://localhost:3001/admin.html');
    console.log('2. Login with the credentials above');
    console.log('3. Manage tenants and view analytics');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating platform admin:', error.message);
    process.exit(1);
  }
}

createPlatformAdmin();