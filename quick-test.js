import axios from 'axios';
import chalk from 'chalk';

const BASE_URL = 'http://localhost:3000';
let score = 0;
let total = 0;

async function test(name, fn) {
  total++;
  try {
    await fn();
    score++;
    console.log(chalk.green(`✓ ${name}`));
    return true;
  } catch (e) {
    console.log(chalk.red(`✗ ${name}: ${e.message}`));
    return false;
  }
}

async function runTests() {
  console.log(chalk.blue.bold('\n🚀 VERDICT 360 QUICK TEST\n'));

  // Core functionality tests
  await test('Server running', async () => {
    await axios.get(`${BASE_URL}/api/health`);
  });

  await test('Homepage loads', async () => {
    const res = await axios.get(BASE_URL);
    if (!res.data.includes('Verdict 360')) throw new Error('Missing content');
  });

  await test('AI responds', async () => {
    const res = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'Hi',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    if (!res.data.response) throw new Error('No response');
  });

  await test('Word limit enforced', async () => {
    const res = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'Tell me about law',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    const words = res.data.response.split(' ').length;
    console.log(chalk.gray(`  Words: ${words}`));
    if (words > 45) throw new Error(`Too many words: ${words}`);
  });

  await test('No markdown', async () => {
    const res = await axios.post(`${BASE_URL}/api/ai/chat`, {
      message: 'What services do you offer?',
      conversationHistory: []
    }, {
      headers: { 'X-Tenant-Id': '11111111-1111-1111-1111-111111111111' }
    });
    if (res.data.response.includes('**') || res.data.response.includes('`')) {
      throw new Error('Contains markdown');
    }
  });

  await test('Database connected', async () => {
    // Test via health endpoint that checks DB
    const res = await axios.get(`${BASE_URL}/api/health`);
    if (res.data.status !== 'healthy') throw new Error('Unhealthy');
  });

  // Final score
  const percentage = Math.round((score / total) * 100);
  console.log(chalk.blue(`\n════════════════════`));
  
  const color = percentage >= 80 ? chalk.green : percentage >= 60 ? chalk.yellow : chalk.red;
  console.log(color.bold(`SCORE: ${score}/${total} (${percentage}%)`));
  
  if (percentage >= 80) {
    console.log(chalk.green.bold('✅ PASSED'));
  } else if (percentage >= 60) {
    console.log(chalk.yellow.bold('⚠️ NEEDS WORK'));
  } else {
    console.log(chalk.red.bold('❌ FAILED'));
  }
  console.log(chalk.blue(`════════════════════\n`));
}

runTests().catch(console.error);
