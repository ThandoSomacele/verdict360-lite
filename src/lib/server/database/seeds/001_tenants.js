exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tenants').del();
  
  // Inserts seed entries
  await knex('tenants').insert([
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Smith & Associates Legal',
      subdomain: 'smith-associates',
      email: 'contact@smithlegal.co.za',
      phone: '+27 11 123 4567',
      address: '123 Legal Street, Johannesburg, 2001',
      branding: JSON.stringify({
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        logo: 'https://example.com/smith-logo.png',
        companyName: 'Smith & Associates',
        welcomeMessage: 'Welcome to Smith & Associates. How can we help you with your legal needs today?'
      }),
      settings: JSON.stringify({
        businessHours: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' },
          saturday: { start: '09:00', end: '13:00' },
          sunday: { closed: true }
        },
        practiceAreas: ['Criminal Law', 'Family Law', 'Property Law', 'Labour Law'],
        autoResponse: true,
        leadNotifications: true
      }),
      status: 'active',
      subscription_status: 'active',
      stripe_customer_id: 'cus_test_smith',
      trial_ends_at: null,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Cape Town Legal Solutions',
      subdomain: 'capetown-legal',
      email: 'info@capetownlegal.co.za',
      phone: '+27 21 987 6543',
      address: '456 Waterfront Ave, Cape Town, 8001',
      branding: JSON.stringify({
        primaryColor: '#059669',
        secondaryColor: '#10b981',
        logo: 'https://example.com/capetown-logo.png',
        companyName: 'Cape Town Legal Solutions',
        welcomeMessage: 'Hello! Cape Town Legal is here to assist with your legal questions.'
      }),
      settings: JSON.stringify({
        businessHours: {
          monday: { start: '08:30', end: '17:30' },
          tuesday: { start: '08:30', end: '17:30' },
          wednesday: { start: '08:30', end: '17:30' },
          thursday: { start: '08:30', end: '17:30' },
          friday: { start: '08:30', end: '16:00' },
          saturday: { closed: true },
          sunday: { closed: true }
        },
        practiceAreas: ['Corporate Law', 'Commercial Law', 'Maritime Law', 'Immigration Law'],
        autoResponse: true,
        leadNotifications: true
      }),
      status: 'active',
      subscription_status: 'trial',
      trial_ends_at: knex.raw("NOW() + INTERVAL '7 days'"),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Pretoria Family Law Center',
      subdomain: 'pretoria-family',
      email: 'help@pretoriafamily.co.za',
      phone: '+27 12 345 6789',
      address: '789 Union Buildings Rd, Pretoria, 0001',
      branding: JSON.stringify({
        primaryColor: '#7c3aed',
        secondaryColor: '#8b5cf6',
        logo: 'https://example.com/pretoria-logo.png',
        companyName: 'Pretoria Family Law Center',
        welcomeMessage: 'Welcome to Pretoria Family Law Center. We specialise in family matters and are here to help.'
      }),
      settings: JSON.stringify({
        businessHours: {
          monday: { start: '09:00', end: '16:30' },
          tuesday: { start: '09:00', end: '16:30' },
          wednesday: { start: '09:00', end: '16:30' },
          thursday: { start: '09:00', end: '16:30' },
          friday: { start: '09:00', end: '16:00' },
          saturday: { closed: true },
          sunday: { closed: true }
        },
        practiceAreas: ['Divorce Law', 'Child Custody', 'Maintenance', 'Adoption'],
        autoResponse: true,
        leadNotifications: true
      }),
      status: 'active',
      subscription_status: 'trial',
      trial_ends_at: knex.raw("NOW() + INTERVAL '10 days'"),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      name: 'Demo Law Firm',
      subdomain: 'demo',
      email: 'demo@verdict360.com',
      phone: '+27 11 000 0000',
      address: 'Demo Address, Demo City',
      branding: JSON.stringify({
        primaryColor: '#f59e0b',
        secondaryColor: '#fbbf24',
        logo: 'https://example.com/demo-logo.png',
        companyName: 'Demo Law Firm',
        welcomeMessage: 'This is a demo chatbot. Try asking legal questions to see how it works!'
      }),
      settings: JSON.stringify({
        businessHours: {
          monday: { start: '00:00', end: '23:59' },
          tuesday: { start: '00:00', end: '23:59' },
          wednesday: { start: '00:00', end: '23:59' },
          thursday: { start: '00:00', end: '23:59' },
          friday: { start: '00:00', end: '23:59' },
          saturday: { start: '00:00', end: '23:59' },
          sunday: { start: '00:00', end: '23:59' }
        },
        practiceAreas: ['All Practice Areas'],
        autoResponse: true,
        leadNotifications: false
      }),
      status: 'active',
      subscription_status: 'trial',
      trial_ends_at: knex.raw("NOW() + INTERVAL '365 days'"),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};
