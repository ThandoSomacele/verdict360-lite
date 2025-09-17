export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('leads').del();
  
  // Inserts seed entries with realistic South African legal scenarios
  await knex('leads').insert([
    // Smith & Associates leads
    {
      id: '11111111-1111-1111-1111-111111111111',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      first_name: 'Themba',
      last_name: 'Mthembu',
      email: 'themba.mthembu@gmail.com',
      phone: '+27 82 123 4567',
      legal_issue: 'I was arrested for a crime I did not commit. I need help with my criminal defense case.',
      status: 'new',
      priority: 'high',
      assigned_attorney_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      metadata: JSON.stringify({
        source: 'chatbot',
        urgency: 'high',
        caseType: 'criminal'
      }),
      created_at: knex.raw("NOW() - INTERVAL '2 hours'"),
      updated_at: knex.raw("NOW() - INTERVAL '2 hours'")
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      first_name: 'Maria',
      last_name: 'Gonzalez',
      email: 'maria.gonzalez@yahoo.com',
      phone: '+27 76 987 6543',
      legal_issue: 'I need help with a property transfer. My grandmother left me her house but there are issues with the deed.',
      status: 'contacted',
      priority: 'medium',
      assigned_attorney_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      consultation_scheduled_at: knex.raw("NOW() + INTERVAL '2 days'"),
      notes: 'Client contacted via phone. Scheduled consultation for property law matter.',
      metadata: JSON.stringify({
        source: 'chatbot',
        caseType: 'property',
        propertyValue: 'R1.2M estimated'
      }),
      created_at: knex.raw("NOW() - INTERVAL '1 day'"),
      updated_at: knex.raw("NOW() - INTERVAL '4 hours'")
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      first_name: 'James',
      last_name: 'Robertson',
      email: 'j.robertson@company.co.za',
      phone: '+27 11 234 5678',
      legal_issue: 'Workplace discrimination case. My employer is treating me unfairly because of my race.',
      status: 'converted',
      priority: 'high',
      assigned_attorney_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      notes: 'Strong case for CCMA referral. Client has documented evidence.',
      metadata: JSON.stringify({
        source: 'chatbot',
        caseType: 'labour',
        ccmaReferral: true
      }),
      created_at: knex.raw("NOW() - INTERVAL '3 days'"),
      updated_at: knex.raw("NOW() - INTERVAL '1 day'")
    },

    // Cape Town Legal leads
    {
      id: '44444444-4444-4444-4444-444444444444',
      tenant_id: '22222222-2222-2222-2222-222222222222',
      first_name: 'Ahmed',
      last_name: 'Hassan',
      email: 'ahmed.hassan@outlook.com',
      phone: '+27 21 345 6789',
      legal_issue: 'I need help setting up a company and understanding the legal requirements for importing goods.',
      status: 'scheduled',
      priority: 'medium',
      assigned_attorney_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      consultation_scheduled_at: knex.raw("NOW() + INTERVAL '1 day'"),
      consultation_details: JSON.stringify({
        type: 'video_call',
        duration: 60,
        agenda: 'Company registration and import/export law consultation'
      }),
      metadata: JSON.stringify({
        source: 'chatbot',
        caseType: 'commercial',
        businessType: 'import/export'
      }),
      created_at: knex.raw("NOW() - INTERVAL '5 hours'"),
      updated_at: knex.raw("NOW() - INTERVAL '1 hour'")
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      tenant_id: '22222222-2222-2222-2222-222222222222',
      first_name: 'Sandra',
      last_name: 'Pieters',
      email: 'sandra.pieters@gmail.com',
      phone: '+27 84 567 8901',
      legal_issue: 'Immigration visa application assistance. My work permit is expiring and I need help with permanent residence.',
      status: 'new',
      priority: 'high',
      metadata: JSON.stringify({
        source: 'chatbot',
        caseType: 'immigration',
        visaType: 'work_to_permanent',
        urgency: 'permit_expiring'
      }),
      created_at: knex.raw("NOW() - INTERVAL '30 minutes'"),
      updated_at: knex.raw("NOW() - INTERVAL '30 minutes'")
    },

    // Pretoria Family Law leads  
    {
      id: '66666666-6666-6666-6666-666666666666',
      tenant_id: '33333333-3333-3333-3333-333333333333',
      first_name: 'Patricia',
      last_name: 'Molefe',
      email: 'patricia.molefe@webmail.co.za',
      phone: '+27 73 456 7890',
      legal_issue: 'I want to file for divorce from my husband. We have two children and I need advice about custody and maintenance.',
      status: 'contacted',
      priority: 'medium',
      assigned_attorney_id: '10101010-1010-1010-1010-101010101010',
      notes: 'Initial consultation completed. Proceeding with divorce paperwork.',
      metadata: JSON.stringify({
        source: 'chatbot',
        caseType: 'divorce',
        children: 2,
        childrenAges: [8, 12]
      }),
      created_at: knex.raw("NOW() - INTERVAL '2 days'"),
      updated_at: knex.raw("NOW() - INTERVAL '6 hours'")
    },
    {
      id: '77777777-7777-7777-7777-777777777777',
      tenant_id: '33333333-3333-3333-3333-333333333333',
      first_name: 'Michael',
      last_name: 'Johnson',
      email: 'mike.johnson@live.com',
      phone: '+27 12 789 0123',
      legal_issue: 'My ex-wife is not allowing me to see my children according to our custody agreement. I need legal help.',
      status: 'new',
      priority: 'high',
      metadata: JSON.stringify({
        source: 'chatbot',
        caseType: 'child_custody',
        custodyViolation: true
      }),
      created_at: knex.raw("NOW() - INTERVAL '4 hours'"),
      updated_at: knex.raw("NOW() - INTERVAL '4 hours'")
    },

    // Demo tenant leads
    {
      id: '88888888-8888-8888-8888-888888888888',
      tenant_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo.user@example.com',
      phone: '+27 11 000 0001',
      legal_issue: 'This is a demo legal inquiry to test the chatbot functionality.',
      status: 'new',
      priority: 'low',
      assigned_attorney_id: '13131313-1313-1313-1313-131313131313',
      metadata: JSON.stringify({
        source: 'demo_chatbot',
        caseType: 'demo'
      }),
      created_at: knex.raw("NOW() - INTERVAL '10 minutes'"),
      updated_at: knex.raw("NOW() - INTERVAL '10 minutes'")
    }
  ]);
};