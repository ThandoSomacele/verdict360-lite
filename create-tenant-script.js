#!/usr/bin/env node

/**
 * Script to create a new tenant for testing
 * Usage: node create-tenant-script.js
 */

require('dotenv').config();
const { connectDatabase, getDatabase } = require('./src/server/config/db');
const Tenant = require('./src/server/models/Tenant');
const User = require('./src/server/models/User');
const { hashPassword } = require('./src/server/utils/auth');

async function createTestTenant() {
  try {
    // Initialize database connection first
    await connectDatabase();
    console.log('🏢 Creating new tenant...');

    // Create tenant
    const tenantData = {
      name: 'Johannesburg Legal Solutions',
      subdomain: 'jls', // Will be accessible at jls.verdict360.com  
      email: 'admin@jls.co.za',
      phone: '+27 11 123 4567',
      address: 'Sandton City, Johannesburg, South Africa',
      branding: {
        companyName: 'Johannesburg Legal Solutions',
        primaryColor: '#1e40af', // Blue
        secondaryColor: '#f3f4f6',
        logoUrl: '',
        welcomeMessage: 'Welcome to Johannesburg Legal Solutions AI Assistant'
      },
      settings: {
        businessHours: {
          timezone: 'Africa/Johannesburg',
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          startTime: '09:00',
          endTime: '17:00'
        },
        features: {
          calendarIntegration: true,
          emailNotifications: true,
          smsNotifications: false
        }
      }
    };

    const tenant = await Tenant.create(tenantData);
    console.log('✅ Tenant created:', tenant.id);
    console.log('📍 Subdomain:', tenant.subdomain);
    console.log('🌐 URL: http://' + tenant.subdomain + '.localhost:3001');

    // Create admin user for this tenant
    console.log('\n👤 Creating admin user...');
    const adminData = {
      tenantId: tenant.id,
      email: 'admin@jls.co.za',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Attorney',
      role: 'admin'
    };

    const hashedPassword = await hashPassword(adminData.password);
    const db = getDatabase();
    
    const [adminUser] = await db('users').insert({
      tenant_id: tenant.id,
      email: adminData.email,
      password_hash: hashedPassword,
      first_name: adminData.firstName,
      last_name: adminData.lastName,
      role: adminData.role,
      status: 'active'
    }).returning(['id', 'email', 'first_name', 'last_name', 'role']);

    console.log('✅ Admin user created:', adminUser.email);
    console.log('🔐 Login credentials:');
    console.log('   Email:', adminData.email);
    console.log('   Password:', adminData.password);

    console.log('\n🎉 New tenant setup complete!');
    console.log('Next steps:');
    console.log('1. Visit: http://' + tenant.subdomain + '.localhost:3001');
    console.log('2. Set up Google Calendar integration');
    console.log('3. Test the chat widget');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tenant:', error.message);
    process.exit(1);
  }
}

createTestTenant();