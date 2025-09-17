export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('conversations').del();
  
  // Inserts seed entries
  await knex('conversations').insert([
    // Smith & Associates conversations
    {
      id: 'conv-1111-1111-1111-111111111111',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      lead_id: '11111111-1111-1111-1111-111111111111',
      visitor_id: 'visitor_themba_001',
      status: 'completed',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip: '196.25.1.100',
        location: 'Johannesburg, ZA',
        referrer: 'https://google.com'
      }),
      message_count: 12,
      started_at: knex.raw("NOW() - INTERVAL '2 hours 30 minutes'"),
      ended_at: knex.raw("NOW() - INTERVAL '2 hours'"),
      created_at: knex.raw("NOW() - INTERVAL '2 hours 30 minutes'"),
      updated_at: knex.raw("NOW() - INTERVAL '2 hours'")
    },
    {
      id: 'conv-2222-2222-2222-222222222222',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      lead_id: '22222222-2222-2222-2222-222222222222',
      visitor_id: 'visitor_maria_002',
      status: 'completed',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
        ip: '196.25.1.105',
        location: 'Johannesburg, ZA',
        referrer: 'https://facebook.com'
      }),
      message_count: 8,
      started_at: knex.raw("NOW() - INTERVAL '1 day 2 hours'"),
      ended_at: knex.raw("NOW() - INTERVAL '1 day 1 hour'"),
      created_at: knex.raw("NOW() - INTERVAL '1 day 2 hours'"),
      updated_at: knex.raw("NOW() - INTERVAL '1 day 1 hour'")
    },
    {
      id: 'conv-3333-3333-3333-333333333333',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      lead_id: '33333333-3333-3333-3333-333333333333',
      visitor_id: 'visitor_james_003',
      status: 'completed',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        ip: '196.25.1.110',
        location: 'Johannesburg, ZA',
        referrer: 'direct'
      }),
      message_count: 15,
      started_at: knex.raw("NOW() - INTERVAL '3 days 1 hour'"),
      ended_at: knex.raw("NOW() - INTERVAL '3 days'"),
      created_at: knex.raw("NOW() - INTERVAL '3 days 1 hour'"),
      updated_at: knex.raw("NOW() - INTERVAL '3 days'")
    },

    // Cape Town Legal conversations
    {
      id: 'conv-4444-4444-4444-444444444444',
      tenant_id: '22222222-2222-2222-2222-222222222222',
      lead_id: '44444444-4444-4444-4444-444444444444',
      visitor_id: 'visitor_ahmed_004',
      status: 'completed',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip: '41.74.128.50',
        location: 'Cape Town, ZA',
        referrer: 'https://google.com'
      }),
      message_count: 10,
      started_at: knex.raw("NOW() - INTERVAL '6 hours'"),
      ended_at: knex.raw("NOW() - INTERVAL '5 hours'"),
      created_at: knex.raw("NOW() - INTERVAL '6 hours'"),
      updated_at: knex.raw("NOW() - INTERVAL '5 hours'")
    },
    {
      id: 'conv-5555-5555-5555-555555555555',
      tenant_id: '22222222-2222-2222-2222-222222222222',
      lead_id: '55555555-5555-5555-5555-555555555555',
      visitor_id: 'visitor_sandra_005',
      status: 'active',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (Android 11; Mobile; rv:68.0)',
        ip: '41.74.128.55',
        location: 'Cape Town, ZA',
        referrer: 'https://google.com'
      }),
      message_count: 6,
      started_at: knex.raw("NOW() - INTERVAL '35 minutes'"),
      ended_at: null,
      created_at: knex.raw("NOW() - INTERVAL '35 minutes'"),
      updated_at: knex.raw("NOW() - INTERVAL '5 minutes'")
    },

    // Pretoria Family Law conversations
    {
      id: 'conv-6666-6666-6666-666666666666',
      tenant_id: '33333333-3333-3333-3333-333333333333',
      lead_id: '66666666-6666-6666-6666-666666666666',
      visitor_id: 'visitor_patricia_006',
      status: 'completed',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip: '146.141.1.25',
        location: 'Pretoria, ZA',
        referrer: 'https://bing.com'
      }),
      message_count: 14,
      started_at: knex.raw("NOW() - INTERVAL '2 days 3 hours'"),
      ended_at: knex.raw("NOW() - INTERVAL '2 days 2 hours'"),
      created_at: knex.raw("NOW() - INTERVAL '2 days 3 hours'"),
      updated_at: knex.raw("NOW() - INTERVAL '2 days 2 hours'")
    },
    {
      id: 'conv-7777-7777-7777-777777777777',
      tenant_id: '33333333-3333-3333-3333-333333333333',
      lead_id: '77777777-7777-7777-7777-777777777777',
      visitor_id: 'visitor_michael_007',
      status: 'completed',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        ip: '146.141.1.30',
        location: 'Pretoria, ZA',
        referrer: 'direct'
      }),
      message_count: 9,
      started_at: knex.raw("NOW() - INTERVAL '4 hours 15 minutes'"),
      ended_at: knex.raw("NOW() - INTERVAL '4 hours'"),
      created_at: knex.raw("NOW() - INTERVAL '4 hours 15 minutes'"),
      updated_at: knex.raw("NOW() - INTERVAL '4 hours'")
    },

    // Demo conversation
    {
      id: 'conv-8888-8888-8888-888888888888',
      tenant_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      lead_id: '88888888-8888-8888-8888-888888888888',
      visitor_id: 'demo_visitor_001',
      status: 'completed',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip: '127.0.0.1',
        location: 'Demo Location',
        referrer: 'demo'
      }),
      message_count: 5,
      started_at: knex.raw("NOW() - INTERVAL '15 minutes'"),
      ended_at: knex.raw("NOW() - INTERVAL '10 minutes'"),
      created_at: knex.raw("NOW() - INTERVAL '15 minutes'"),
      updated_at: knex.raw("NOW() - INTERVAL '10 minutes'")
    },

    // Some abandoned conversations (no leads created)
    {
      id: 'conv-9999-9999-9999-999999999999',
      tenant_id: '11111111-1111-1111-1111-111111111111',
      lead_id: null,
      visitor_id: 'visitor_abandoned_001',
      status: 'abandoned',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ip: '196.25.1.200',
        location: 'Johannesburg, ZA',
        referrer: 'https://google.com'
      }),
      message_count: 3,
      started_at: knex.raw("NOW() - INTERVAL '8 hours'"),
      ended_at: knex.raw("NOW() - INTERVAL '7 hours 45 minutes'"),
      created_at: knex.raw("NOW() - INTERVAL '8 hours'"),
      updated_at: knex.raw("NOW() - INTERVAL '7 hours 45 minutes'")
    },
    {
      id: 'conv-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      tenant_id: '22222222-2222-2222-2222-222222222222',
      lead_id: null,
      visitor_id: 'visitor_abandoned_002',
      status: 'abandoned',
      visitor_info: JSON.stringify({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
        ip: '41.74.128.100',
        location: 'Cape Town, ZA',
        referrer: 'https://facebook.com'
      }),
      message_count: 2,
      started_at: knex.raw("NOW() - INTERVAL '12 hours'"),
      ended_at: knex.raw("NOW() - INTERVAL '11 hours 55 minutes'"),
      created_at: knex.raw("NOW() - INTERVAL '12 hours'"),
      updated_at: knex.raw("NOW() - INTERVAL '11 hours 55 minutes'")
    }
  ]);
};