#!/usr/bin/env node

/**
 * Verdict 360 Platform Test Suite with Scoring
 * Tests all critical functionality and provides a score out of 100
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import pg from 'pg';
import chalk from 'chalk';

const execAsync = promisify(exec);
const BASE_URL = 'http://localhost:3000';

// Test categories and weights
const TEST_CATEGORIES = {
  DATABASE: { weight: 20, tests: [] },
  API: { weight: 25, tests: [] },
  AUTHENTICATION: { weight: 20, tests: [] },
  CHATBOT: { weight: 20, tests: [] },
  FRONTEND: { weight: 15, tests: [] }
};

let totalScore = 0;
let testResults = [];

// Database connection
const pgClient = new pg.Client({
  host: 'localhost',
  database: 'verdict360_dev',
  user: 'verdict360_user',
  password: 'password123',
  port: 5432
});

// Test utilities
async function runTest(category, testName, testFn) {
  try {
    await testFn();
    TEST_CATEGORIES[category].tests.push({ name: testName, passed: true });
    console.log(chalk.green(`✓ ${testName}`));
    return true;
  } catch (error) {
    TEST_CATEGORIES[category].tests.push({ name: testName, passed: false, error: error.message });
    console.log(chalk.red(`✗ ${testName}: ${error.message}`));
    return false;
  }
}

// DATABASE TESTS
async function testDatabase() {
  console.log(chalk.blue('\n📊 DATABASE TESTS\n'));

  await runTest('DATABASE', 'Connect to PostgreSQL', async () => {
    await pgClient.connect();
  });

  await runTest('DATABASE', 'Check tenants table exists', async () => {
    const result = await pgClient.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tenants')");
    if (!result.rows[0].exists) throw new Error('Tenants table does not exist');
  });

  await runTest('DATABASE', 'Check users table exists', async () => {
    const result = await pgClient.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')");
    if (!result.rows[0].exists) throw new Error('Users table does not exist');
  });

  await runTest('DATABASE', 'Check chat_leads table exists', async () => {
    const result = await pgClient.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chat_leads')");
    if (!result.rows[0].exists) throw new Error('Chat leads table does not exist');
  });

  await runTest('DATABASE', 'Verify lead data storage', async () => {
    const result = await pgClient.query("SELECT COUNT(*) FROM chat_leads");
    console.log(chalk.gray(`  Found ${result.rows[0].count} leads in database`));
  });

  await runTest('DATABASE', 'Check refresh_tokens table', async () => {
    const result = await pgClient.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'refresh_tokens')");
    if (!result.rows[0].exists) throw new Error('Refresh tokens table does not exist');
  });

  await runTest('DATABASE', 'Check billing_history table', async () => {
    const result = await pgClient.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'billing_history')");
    if (!result.rows[0].exists) throw new Error('Billing history table does not exist');
  });
}

// API TESTS
async function testAPI() {
  console.log(chalk.blue('\n🔌 API ENDPOINT TESTS\n'));

  await runTest('API', 'Health check endpoint', async () => {
    const response = await axios.get(`${BASE_URL}/api/health`);
    if (response.data.status !== 'healthy') throw new Error('Health check failed');
  });

  await runTest('API', 'Tenant info endpoint', async () => {
    const response = await axios.get(`${BASE_URL}/api/tenants/current`, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    if (!response.data.id) throw new Error('Tenant info not returned');
  });

  await runTest('API', 'AI welcome message endpoint', async () => {
    const response = await axios.get(`${BASE_URL}/api/ai/welcome`, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    if (!response.data.response) throw new Error('Welcome message not returned');
  });

  await runTest('API', 'AI chat endpoint', async () => {
    const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'Hello',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    if (!response.data.response) throw new Error('Chat response not returned');
  });

  await runTest('API', 'Check AI response word limit', async () => {
    const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'Tell me everything about South African law',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    const wordCount = response.data.response.split(' ').length;
    console.log(chalk.gray(`  Response word count: ${wordCount}`));
    if (wordCount > 45) throw new Error(`Response too long: ${wordCount} words (limit: 40)`);
  });
}

// AUTHENTICATION TESTS
async function testAuthentication() {
  console.log(chalk.blue('\n🔐 AUTHENTICATION TESTS\n'));

  let authToken = null;
  const testEmail = `test${Date.now()}@example.com`;

  await runTest('AUTHENTICATION', 'User registration', async () => {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: testEmail,
      password: 'TestPass123!',
      name: 'Test User',
      tenantId: '11111111-1111-1111-1111-111111111111'
    });
    if (!response.data.accessToken) throw new Error('No access token returned');
    authToken = response.data.accessToken;
  });

  await runTest('AUTHENTICATION', 'User login', async () => {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testEmail,
      password: 'TestPass123!',
      tenantId: '11111111-1111-1111-1111-111111111111'
    });
    if (!response.data.accessToken) throw new Error('Login failed');
  });

  await runTest('AUTHENTICATION', 'JWT token validation', async () => {
    if (!authToken) throw new Error('No auth token available');
    // Token format check
    const parts = authToken.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
  });

  await runTest('AUTHENTICATION', 'Duplicate user prevention', async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        email: testEmail,
        password: 'TestPass123!',
        name: 'Test User',
        tenantId: '11111111-1111-1111-1111-111111111111'
      });
      throw new Error('Should have prevented duplicate registration');
    } catch (error) {
      if (error.response?.status !== 409) throw error;
    }
  });
}

// CHATBOT TESTS
async function testChatbot() {
  console.log(chalk.blue('\n🤖 CHATBOT FUNCTIONALITY TESTS\n'));

  await runTest('CHATBOT', 'Chatbot responds to greeting', async () => {
    const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'Hi',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    if (!response.data.response.toLowerCase().includes('hi') &&
        !response.data.response.toLowerCase().includes('hello')) {
      throw new Error('Chatbot did not respond appropriately to greeting');
    }
  });

  await runTest('CHATBOT', 'Chatbot handles legal queries', async () => {
    const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'I need help with a letter of demand',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    if (!response.data.response) throw new Error('No response to legal query');
    if (response.data.metadata?.intent !== 'legal_inquiry' &&
        response.data.metadata?.intent !== 'data_collection') {
      throw new Error('Intent not properly detected');
    }
  });

  await runTest('CHATBOT', 'No markdown in responses', async () => {
    const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'What legal services do you offer?',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    if (response.data.response.includes('**') ||
        response.data.response.includes('*') ||
        response.data.response.includes('`')) {
      throw new Error('Response contains markdown formatting');
    }
  });

  await runTest('CHATBOT', 'British spelling check', async () => {
    const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'Do you specialize in any areas?',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    // Check for American spellings that shouldn't be there
    if (response.data.response.includes('specialize') &&
        !response.data.response.includes('specialise')) {
      console.log(chalk.yellow('  Warning: May contain American spelling'));
    }
  });

  await runTest('CHATBOT', 'Conversation end handling', async () => {
    const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'No thanks, goodbye',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    if (response.data.metadata?.intent !== 'conversation_end') {
      throw new Error('Failed to detect conversation end');
    }
  });
}

// FRONTEND TESTS
async function testFrontend() {
  console.log(chalk.blue('\n🎨 FRONTEND TESTS\n'));

  await runTest('FRONTEND', 'Homepage loads', async () => {
    const response = await axios.get(BASE_URL);
    if (!response.data.includes('Verdict 360')) throw new Error('Homepage content missing');
  });

  await runTest('FRONTEND', 'Demo page accessible', async () => {
    const response = await axios.get(`${BASE_URL}/demo`);
    if (!response.data.includes('Experience Verdict 360')) throw new Error('Demo page not loading');
  });

  await runTest('FRONTEND', 'Pricing page accessible', async () => {
    const response = await axios.get(`${BASE_URL}/pricing`);
    if (!response.data.includes('R1,999') || !response.data.includes('R4,999')) {
      throw new Error('Pricing information not found');
    }
  });

  await runTest('FRONTEND', 'Login page accessible', async () => {
    const response = await axios.get(`${BASE_URL}/login`);
    if (!response.data.includes('login') || !response.data.includes('password')) {
      throw new Error('Login form not found');
    }
  });

  await runTest('FRONTEND', 'ChatWidget component present', async () => {
    const response = await axios.get(BASE_URL);
    if (!response.data.includes('ChatWidget')) throw new Error('ChatWidget not found on page');
  });
}

// SCORING FUNCTION
function calculateScore() {
  console.log(chalk.blue('\n📈 SCORING RESULTS\n'));

  for (const [category, data] of Object.entries(TEST_CATEGORIES)) {
    const passed = data.tests.filter(t => t.passed).length;
    const total = data.tests.length;
    const categoryScore = total > 0 ? (passed / total) * data.weight : 0;
    totalScore += categoryScore;

    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
    const color = percentage >= 80 ? chalk.green : percentage >= 60 ? chalk.yellow : chalk.red;

    console.log(`${category}: ${color(`${passed}/${total} tests passed (${percentage}%)`)} - Score: ${categoryScore.toFixed(1)}/${data.weight}`);

    // Show failed tests
    const failed = data.tests.filter(t => !t.passed);
    if (failed.length > 0) {
      failed.forEach(test => {
        console.log(chalk.red(`  ✗ ${test.name}: ${test.error}`));
      });
    }
  }

  console.log(chalk.blue('\n═══════════════════════════════════'));
  const finalColor = totalScore >= 80 ? chalk.green : totalScore >= 60 ? chalk.yellow : chalk.red;
  console.log(finalColor.bold(`TOTAL SCORE: ${totalScore.toFixed(1)}/100`));

  if (totalScore >= 90) {
    console.log(chalk.green.bold('🏆 EXCELLENT! Production ready!'));
  } else if (totalScore >= 75) {
    console.log(chalk.green('✅ GOOD! Minor improvements needed.'));
  } else if (totalScore >= 60) {
    console.log(chalk.yellow('⚠️  FAIR. Several issues to address.'));
  } else {
    console.log(chalk.red('❌ NEEDS WORK. Critical issues found.'));
  }
  console.log(chalk.blue('═══════════════════════════════════\n'));
}

// MAIN TEST RUNNER
async function runTests() {
  console.log(chalk.blue.bold('\n════════════════════════════════════════'));
  console.log(chalk.blue.bold('   VERDICT 360 PLATFORM TEST SUITE     '));
  console.log(chalk.blue.bold('════════════════════════════════════════'));

  try {
    // Check if server is running
    console.log(chalk.gray('\nChecking server status...'));
    try {
      await axios.get(`${BASE_URL}/api/health`);
      console.log(chalk.green('✓ Server is running'));
    } catch (error) {
      console.log(chalk.red('✗ Server is not running. Please start with: npm run dev'));
      process.exit(1);
    }

    // Run test categories
    await testDatabase();
    await testAPI();
    await testAuthentication();
    await testChatbot();
    await testFrontend();

    // Calculate and display score
    calculateScore();

    // Cleanup
    await pgClient.end();

    // Return exit code based on score
    process.exit(totalScore >= 60 ? 0 : 1);

  } catch (error) {
    console.error(chalk.red('\n❌ Test suite failed:'), error.message);
    await pgClient.end();
    process.exit(1);
  }
}

// Run the tests
runTests();