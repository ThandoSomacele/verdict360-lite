#!/usr/bin/env node

/**
 * Tenant Onboarding Script for Verdict 360
 *
 * Usage: node onboard-tenant.js
 *
 * This script will interactively guide you through creating a new tenant.
 */

import readline from 'readline';
import axios from 'axios';
import chalk from 'chalk';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import knex from 'knex';
import knexConfig from './knexfile.js';

// Initialize database connection
const db = knex(knexConfig.development);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt for input
const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

// Main onboarding function
async function onboardTenant() {
  console.log(chalk.blue.bold('\n🏢 VERDICT 360 TENANT ONBOARDING\n'));
  console.log(chalk.gray('This wizard will help you create a new tenant account.\n'));

  try {
    // Step 1: Company Information
    console.log(chalk.yellow('Step 1: Company Information'));
    const companyName = await question('Company Name: ');
    const subdomain = await question('Subdomain (e.g., smithlaw): ');

    // Check if subdomain exists
    const existing = await db('tenants').where('subdomain', subdomain).first();
    if (existing) {
      console.log(chalk.red('❌ This subdomain is already taken!'));
      process.exit(1);
    }

    // Step 2: Admin User
    console.log(chalk.yellow('\nStep 2: Admin User Details'));
    const firstName = await question('First Name: ');
    const lastName = await question('Last Name: ');
    const email = await question('Email: ');
    const password = await question('Password (min 8 chars): ');

    // Step 3: Plan Selection
    console.log(chalk.yellow('\nStep 3: Select Plan'));
    console.log('1. Starter (R1,999/month) - 100 leads');
    console.log('2. Professional (R4,999/month) - 500 leads');
    console.log('3. Enterprise (R9,999/month) - Unlimited');
    const planChoice = await question('Choose plan (1-3): ');
    const plans = ['starter', 'professional', 'enterprise'];
    const plan = plans[parseInt(planChoice) - 1] || 'starter';

    // Confirmation
    console.log(chalk.cyan('\n📋 Review Your Information:'));
    console.log(`Company: ${companyName}`);
    console.log(`Subdomain: ${subdomain}.verdict360.com`);
    console.log(`Admin: ${firstName} ${lastName} (${email})`);
    console.log(`Plan: ${plan.charAt(0).toUpperCase() + plan.slice(1)}`);

    const confirm = await question('\nProceed? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log(chalk.yellow('Onboarding cancelled.'));
      process.exit(0);
    }

    // Create tenant and user
    console.log(chalk.blue('\n🚀 Creating tenant account...'));

    await db.transaction(async (trx) => {
      // Create tenant
      const tenantId = randomUUID();
      await trx('tenants').insert({
        id: tenantId,
        name: companyName,
        subdomain: subdomain,
        status: 'trial',
        plan: plan,
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        created_at: new Date(),
        updated_at: new Date()
      });

      console.log(chalk.green('✓ Tenant created'));

      // Create admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      await trx('users').insert({
        id: randomUUID(),
        tenant_id: tenantId,
        email: email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        role: 'admin',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      });

      console.log(chalk.green('✓ Admin user created'));

      // Add some sample data if requested
      const addSample = await question('\nAdd sample data? (yes/no): ');
      if (addSample.toLowerCase() === 'yes' || addSample.toLowerCase() === 'y') {
        // Add sample leads
        await trx('chat_leads').insert([
          {
            id: randomUUID(),
            tenant_id: tenantId,
            name: 'John Sample',
            email: 'john@example.com',
            phone: '082 111 2222',
            enquiry_details: 'Need help with a property dispute',
            status: 'new',
            source: 'chat_widget',
            created_at: new Date()
          },
          {
            id: randomUUID(),
            tenant_id: tenantId,
            name: 'Jane Test',
            email: 'jane@example.com',
            phone: '083 333 4444',
            enquiry_details: 'Divorce consultation required',
            status: 'new',
            source: 'chat_widget',
            created_at: new Date()
          }
        ]);

        console.log(chalk.green('✓ Sample leads added'));
      }
    });

    // Success!
    console.log(chalk.green.bold('\n✅ TENANT ONBOARDING COMPLETE!\n'));
    console.log(chalk.white('Access Details:'));
    console.log(chalk.cyan(`URL: http://${subdomain}.verdict360.com`));
    console.log(chalk.cyan(`Email: ${email}`));
    console.log(chalk.cyan(`Password: [hidden]`));
    console.log(chalk.cyan(`Trial Ends: ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}`));

    console.log(chalk.yellow('\n📌 Next Steps:'));
    console.log('1. Visit http://localhost:3000/login to sign in');
    console.log('2. Access the admin panel at /admin');
    console.log('3. Configure your AI assistant settings');
    console.log('4. Install the chat widget on your website');

    // Test the setup
    const testSetup = await question('\nTest the setup now? (yes/no): ');
    if (testSetup.toLowerCase() === 'yes' || testSetup.toLowerCase() === 'y') {
      console.log(chalk.blue('\n🧪 Testing tenant setup...'));

      // Test database connection
      const tenant = await db('tenants').where('id', tenantId).first();
      console.log(chalk.green('✓ Tenant found in database'));

      const user = await db('users').where('email', email).first();
      console.log(chalk.green('✓ Admin user found in database'));

      // Test API endpoint if server is running
      try {
        const response = await axios.get('http://localhost:3000/api/health');
        console.log(chalk.green('✓ API server is running'));
      } catch (err) {
        console.log(chalk.yellow('⚠ API server not running (start with: npm run dev)'));
      }
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error during onboarding:'), error.message);
    process.exit(1);
  } finally {
    rl.close();
    await db.destroy();
  }
}

// Run the onboarding
console.log(chalk.blue('═══════════════════════════════════════'));
onboardTenant().catch(console.error);