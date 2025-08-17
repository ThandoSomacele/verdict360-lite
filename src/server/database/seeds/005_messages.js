exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('messages').del();
  
  // Sample conversation for Themba's criminal law case
  const thembaCriminalMessages = [
    {
      id: 'msg-themba-001',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'bot',
      sender_id: null,
      content: 'Hello! Welcome to Smith & Associates Legal. How can we help you with your legal needs today?',
      metadata: JSON.stringify({ type: 'greeting' }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 30 minutes'")
    },
    {
      id: 'msg-themba-002',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'visitor',
      sender_id: null,
      content: 'Hi, I was arrested yesterday and I think I need a lawyer',
      metadata: JSON.stringify({ urgency: 'high' }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 29 minutes'")
    },
    {
      id: 'msg-themba-003',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'bot',
      sender_id: null,
      content: 'I understand this must be a stressful situation. In South Africa, you have the right to legal representation. Can you tell me more about what happened and what charges you are facing?',
      metadata: JSON.stringify({ intent: 'gather_info' }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 28 minutes'")
    },
    {
      id: 'msg-themba-004',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'visitor',
      sender_id: null,
      content: 'They say I stole something from a shop but I didnt do it. I was charged with theft',
      metadata: JSON.stringify({ case_type: 'theft' }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 27 minutes'")
    },
    {
      id: 'msg-themba-005',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'bot',
      sender_id: null,
      content: 'Theft charges are serious in South Africa and can result in imprisonment or a fine. However, you are presumed innocent until proven guilty. Our criminal law attorneys have experience defending theft cases and can help examine the evidence, witness statements, and ensure your rights are protected. Would you like me to connect you with one of our criminal law specialists for a consultation?',
      metadata: JSON.stringify({ legal_advice: true, consultation_offer: true }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 26 minutes'")
    },
    {
      id: 'msg-themba-006',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'visitor',
      sender_id: null,
      content: 'Yes please, I really need help with this',
      metadata: JSON.stringify({ consultation_accepted: true }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 25 minutes'")
    },
    {
      id: 'msg-themba-007',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'bot',
      sender_id: null,
      content: 'Excellent. I will connect you with Attorney Sarah Jones who specializes in criminal defense. To proceed, I need to collect some contact information. Can you please provide your full name, email address, and phone number?',
      metadata: JSON.stringify({ data_collection: true }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 24 minutes'")
    },
    {
      id: 'msg-themba-008',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'visitor',
      sender_id: null,
      content: 'My name is Themba Mthembu, email is themba.mthembu@gmail.com and my number is 082 123 4567',
      metadata: JSON.stringify({ contact_info_provided: true }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 23 minutes'")
    },
    {
      id: 'msg-themba-009',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'bot',
      sender_id: null,
      content: 'Thank you, Themba. I have recorded your information and marked this as a high-priority case. Attorney Sarah Jones will contact you within 2 hours to discuss your case. In the meantime, remember: do not discuss your case with anyone except your attorney, and do not sign any documents without legal advice.',
      metadata: JSON.stringify({ lead_created: true, priority: 'high' }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 22 minutes'")
    },
    {
      id: 'msg-themba-010',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'visitor',
      sender_id: null,
      content: 'Thank you so much, I really appreciate the help',
      metadata: JSON.stringify({ gratitude: true }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 21 minutes'")
    },
    {
      id: 'msg-themba-011',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'bot',
      sender_id: null,
      content: 'You\'re welcome, Themba. We understand how stressful this situation must be, and we\'re here to help. You should hear from Attorney Jones very soon. Is there anything else I can help you with today?',
      metadata: JSON.stringify({ support: true }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 20 minutes'")
    },
    {
      id: 'msg-themba-012',
      conversation_id: 'conv-1111-1111-1111-111111111111',
      sender_type: 'visitor',
      sender_id: null,
      content: 'No that\'s everything, thank you',
      metadata: JSON.stringify({ conversation_ending: true }),
      sent_at: knex.raw("NOW() - INTERVAL '2 hours 19 minutes'")
    }
  ];

  // Sample conversation for Ahmed's company setup
  const ahmedCommercialMessages = [
    {
      id: 'msg-ahmed-001',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'bot',
      sender_id: null,
      content: 'Hello! Cape Town Legal is here to assist with your legal questions. How can we help you today?',
      metadata: JSON.stringify({ type: 'greeting' }),
      sent_at: knex.raw("NOW() - INTERVAL '6 hours'")
    },
    {
      id: 'msg-ahmed-002',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'visitor',
      sender_id: null,
      content: 'Hi, I want to start a business importing goods from overseas. What do I need to know legally?',
      metadata: JSON.stringify({ business_inquiry: true }),
      sent_at: knex.raw("NOW() - INTERVAL '5 hours 58 minutes'")
    },
    {
      id: 'msg-ahmed-003',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'bot',
      sender_id: null,
      content: 'Starting an import business in South Africa involves several legal requirements: company registration with CIPC, tax registration with SARS, import/export permits, customs compliance, and potentially industry-specific licenses. The process typically takes 4-6 weeks and involves various government departments.',
      metadata: JSON.stringify({ legal_info: 'import_business' }),
      sent_at: knex.raw("NOW() - INTERVAL '5 hours 57 minutes'")
    },
    {
      id: 'msg-ahmed-004',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'visitor',
      sender_id: null,
      content: 'That sounds complicated. Can you help me with all of that?',
      metadata: JSON.stringify({ help_request: true }),
      sent_at: knex.raw("NOW() - INTERVAL '5 hours 56 minutes'")
    },
    {
      id: 'msg-ahmed-005',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'bot',
      sender_id: null,
      content: 'Absolutely! Our commercial law team specializes in business formation and import/export compliance. We can handle the entire process from company registration to obtaining the necessary permits. Would you like to schedule a consultation with our commercial law attorney to discuss your specific business plans?',
      metadata: JSON.stringify({ consultation_offer: true }),
      sent_at: knex.raw("NOW() - INTERVAL '5 hours 55 minutes'")
    },
    {
      id: 'msg-ahmed-006',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'visitor',
      sender_id: null,
      content: 'Yes, that would be great. When can I meet with someone?',
      metadata: JSON.stringify({ consultation_accepted: true }),
      sent_at: knex.raw("NOW() - INTERVAL '5 hours 54 minutes'")
    },
    {
      id: 'msg-ahmed-007',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'bot',
      sender_id: null,
      content: 'Perfect! I can schedule you with Attorney David Adams tomorrow at 2 PM for a video consultation. To proceed, I\'ll need your contact details. Could you please provide your full name, email, and phone number?',
      metadata: JSON.stringify({ scheduling: true }),
      sent_at: knex.raw("NOW() - INTERVAL '5 hours 53 minutes'")
    },
    {
      id: 'msg-ahmed-008',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'visitor',
      sender_id: null,
      content: 'Ahmed Hassan, ahmed.hassan@outlook.com, 021 345 6789',
      metadata: JSON.stringify({ contact_provided: true }),
      sent_at: knex.raw("NOW() - INTERVAL '5 hours 52 minutes'")
    },
    {
      id: 'msg-ahmed-009',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'bot',
      sender_id: null,
      content: 'Excellent, Ahmed! I\'ve scheduled your consultation with Attorney David Adams for tomorrow at 2 PM via video call. You\'ll receive a calendar invitation shortly with the meeting link. Please prepare any business plans or documents you\'d like to discuss.',
      metadata: JSON.stringify({ consultation_scheduled: true }),
      sent_at: knex.raw("NOW() - INTERVAL '5 hours 51 minutes'")
    },
    {
      id: 'msg-ahmed-010',
      conversation_id: 'conv-4444-4444-4444-444444444444',
      sender_type: 'visitor',
      sender_id: null,
      content: 'Perfect, thank you for the help!',
      metadata: JSON.stringify({ satisfaction: true }),
      sent_at: knex.raw("NOW() - INTERVAL '5 hours 50 minutes'")
    }
  ];

  // Sample demo conversation
  const demoMessages = [
    {
      id: 'msg-demo-001',
      conversation_id: 'conv-8888-8888-8888-888888888888',
      sender_type: 'bot',
      sender_id: null,
      content: 'This is a demo chatbot. Try asking legal questions to see how it works!',
      metadata: JSON.stringify({ type: 'demo_greeting' }),
      sent_at: knex.raw("NOW() - INTERVAL '15 minutes'")
    },
    {
      id: 'msg-demo-002',
      conversation_id: 'conv-8888-8888-8888-888888888888',
      sender_type: 'visitor',
      sender_id: null,
      content: 'What should I do if I want to get divorced?',
      metadata: JSON.stringify({ demo_question: 'divorce' }),
      sent_at: knex.raw("NOW() - INTERVAL '14 minutes'")
    },
    {
      id: 'msg-demo-003',
      conversation_id: 'conv-8888-8888-8888-888888888888',
      sender_type: 'bot',
      sender_id: null,
      content: 'In South Africa, divorce can be granted on several grounds including irretrievable breakdown of marriage. You can file for either a contested or uncontested divorce. An uncontested divorce is faster and less expensive. Would you like me to connect you with an attorney who can better assist you?',
      metadata: JSON.stringify({ demo_response: 'divorce_info' }),
      sent_at: knex.raw("NOW() - INTERVAL '13 minutes'")
    },
    {
      id: 'msg-demo-004',
      conversation_id: 'conv-8888-8888-8888-888888888888',
      sender_type: 'visitor',
      sender_id: null,
      content: 'Yes please',
      metadata: JSON.stringify({ demo_consultation: true }),
      sent_at: knex.raw("NOW() - INTERVAL '12 minutes'")
    },
    {
      id: 'msg-demo-005',
      conversation_id: 'conv-8888-8888-8888-888888888888',
      sender_type: 'bot',
      sender_id: null,
      content: 'Great! In a real scenario, I would now collect your contact information and schedule you with one of our family law attorneys. This completes the demo flow.',
      metadata: JSON.stringify({ demo_completion: true }),
      sent_at: knex.raw("NOW() - INTERVAL '11 minutes'")
    }
  ];

  // Insert all messages
  await knex('messages').insert([
    ...thembaCriminalMessages,
    ...ahmedCommercialMessages,
    ...demoMessages
  ]);
};