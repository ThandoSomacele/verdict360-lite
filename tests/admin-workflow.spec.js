import { test, expect } from '@playwright/test';

test.describe('Admin Daily Workflow', () => {
  test('Complete admin daily tasks', async ({ page }) => {
    // Set a longer timeout for this comprehensive test
    test.setTimeout(120000);

    // 1. Navigate to the application
    await page.goto('http://localhost:3000');
    console.log('✓ Navigated to application');

    // 2. Admin Login
    await page.click('text=Login');
    await page.waitForURL('**/login');

    // Fill login form
    await page.fill('input[type="email"]', 'admin@verdict360.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Sign In")');
    console.log('✓ Admin logged in');

    // Wait for redirect to admin dashboard
    await page.waitForTimeout(2000);

    // Navigate to admin dashboard
    await page.goto('http://localhost:3000/admin');
    await page.waitForSelector('h1:has-text("Admin Dashboard")');
    console.log('✓ Admin dashboard loaded');

    // 3. Check Platform Stats
    await page.waitForSelector('text=Total Tenants');
    const totalTenants = await page.textContent('.text-2xl.font-bold');
    console.log(`✓ Platform has ${totalTenants} tenants`);

    // Check system health
    const healthStatus = await page.locator('.badge').first().textContent();
    console.log(`✓ System health status: ${healthStatus}`);

    // 4. Review Recent Tenants
    await page.waitForSelector('table');
    const tenantRows = await page.locator('table tbody tr').count();
    console.log(`✓ Found ${tenantRows} recent tenants in the table`);

    // Take screenshot of dashboard
    await page.screenshot({
      path: 'tests/screenshots/admin-dashboard.png',
      fullPage: true
    });

    // 5. Navigate to Tenants Management
    await page.click('text=Manage Tenants');
    await page.waitForURL('**/admin/tenants');
    console.log('✓ Navigated to tenants management');

    // Search for a tenant
    await page.fill('input[placeholder*="Search"]', 'Demo');
    await page.waitForTimeout(1000);
    console.log('✓ Searched for Demo tenant');

    // 6. View Tenant Details (click first tenant)
    const firstTenantView = await page.locator('text=View').first();
    if (await firstTenantView.isVisible()) {
      await firstTenantView.click();
      await page.waitForSelector('text=Tenant Details');
      console.log('✓ Viewing tenant details');

      // Check tenant stats
      await page.waitForSelector('text=Total Users');

      // Navigate through tabs
      await page.click('text=Settings');
      await page.waitForTimeout(1000);
      console.log('✓ Checked tenant settings');

      await page.click('text=Billing');
      await page.waitForTimeout(1000);
      console.log('✓ Reviewed tenant billing');

      await page.click('text=Users');
      await page.waitForTimeout(1000);
      console.log('✓ Checked tenant users');

      await page.click('text=Activity');
      await page.waitForTimeout(1000);
      console.log('✓ Reviewed tenant activity');

      // Take screenshot of tenant details
      await page.screenshot({
        path: 'tests/screenshots/tenant-details.png',
        fullPage: true
      });

      // Go back to tenants list
      await page.click('a[href="/admin/tenants"]');
    }

    // 7. Navigate to Leads Management
    await page.goto('http://localhost:3000/admin/leads');
    await page.waitForSelector('h1:has-text("Lead Management")');
    console.log('✓ Navigated to leads management');

    // Check lead pipeline stats
    const totalLeads = await page.locator('text=Total Leads').locator('..').locator('.text-2xl').textContent();
    console.log(`✓ Total leads in pipeline: ${totalLeads}`);

    // Filter leads by status
    await page.selectOption('select:near(text=All Status)', 'qualified');
    await page.waitForTimeout(1000);
    console.log('✓ Filtered qualified leads');

    // Take screenshot of leads
    await page.screenshot({
      path: 'tests/screenshots/admin-leads.png',
      fullPage: true
    });

    // 8. Navigate to Platform Settings
    await page.goto('http://localhost:3000/admin/settings');
    await page.waitForSelector('h1:has-text("Platform Settings")');
    console.log('✓ Navigated to platform settings');

    // Review key settings sections
    await page.waitForSelector('text=Platform Configuration');
    await page.waitForSelector('text=Email Configuration');
    await page.waitForSelector('text=AI Configuration');
    await page.waitForSelector('text=Billing Configuration');
    console.log('✓ Reviewed platform settings sections');

    // Update a setting (example: max tenants)
    const maxTenantsInput = await page.locator('input#max-tenants');
    if (await maxTenantsInput.isVisible()) {
      await maxTenantsInput.fill('150');
      console.log('✓ Updated max tenants setting');
    }

    // Take screenshot of settings
    await page.screenshot({
      path: 'tests/screenshots/admin-settings.png',
      fullPage: true
    });

    // 9. Check Installation Guide
    await page.goto('http://localhost:3000/admin/installation');
    await page.waitForSelector('h1:has-text("Installation Guide")');
    console.log('✓ Reviewed installation guide');

    // 10. Return to main dashboard for final overview
    await page.goto('http://localhost:3000/admin');
    await page.waitForSelector('h1:has-text("Admin Dashboard")');

    // Check monthly revenue
    const monthlyRevenue = await page.locator('text=Monthly Revenue').locator('..').locator('.text-2xl').textContent();
    console.log(`✓ Monthly revenue: ${monthlyRevenue}`);

    // Check active subscriptions
    const activeSubscriptions = await page.locator('text=Active Subscriptions').locator('..').locator('.text-2xl').textContent();
    console.log(`✓ Active subscriptions: ${activeSubscriptions}`);

    // Final dashboard screenshot
    await page.screenshot({
      path: 'tests/screenshots/admin-final-overview.png',
      fullPage: true
    });

    console.log('\n✅ Admin daily workflow completed successfully!');
    console.log('Screenshots saved in tests/screenshots/');
  });

  test('Admin monitors real-time activity', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('http://localhost:3000/admin');

    // Login if needed
    const loginButton = await page.locator('text=Login');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.fill('input[type="email"]', 'admin@verdict360.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("Sign In")');
      await page.waitForTimeout(2000);
      await page.goto('http://localhost:3000/admin');
    }

    await page.waitForSelector('h1:has-text("Admin Dashboard")');
    console.log('✓ Monitoring dashboard activity');

    // Check system health indicators
    const systemHealth = await page.locator('text=System Health').isVisible();
    if (systemHealth) {
      const healthBadge = await page.locator('text=System Health').locator('..').locator('.badge').textContent();
      console.log(`✓ System Health: ${healthBadge}`);

      // Check 24-hour metrics
      const conversations24h = await page.locator('text=Conversations (24h)').locator('..').locator('.font-semibold').textContent();
      console.log(`✓ Conversations in last 24h: ${conversations24h}`);

      const leads24h = await page.locator('text=Leads (24h)').locator('..').locator('.font-semibold').textContent();
      console.log(`✓ Leads in last 24h: ${leads24h}`);
    }

    // Simulate refreshing data
    const refreshButton = await page.locator('button:has-text("Refresh")').first();
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      await page.waitForTimeout(1000);
      console.log('✓ Refreshed dashboard data');
    }

    // Search for specific tenant
    await page.fill('input[placeholder*="Search tenants"]', 'Smith');
    await page.waitForTimeout(1000);
    console.log('✓ Searched for Smith law firm');

    // Check tenant status and take action
    const suspendButton = await page.locator('button:has-text("Suspend")').first();
    if (await suspendButton.isVisible()) {
      console.log('✓ Found active tenant - ready to suspend if needed');
    }

    const activateButton = await page.locator('button:has-text("Activate")').first();
    if (await activateButton.isVisible()) {
      console.log('✓ Found suspended tenant - ready to activate if needed');
    }

    console.log('\n✅ Real-time monitoring workflow completed!');
  });

  test('Admin handles support escalation', async ({ page }) => {
    // This test simulates handling a support escalation
    await page.goto('http://localhost:3000/admin');

    // Login if needed
    const loginButton = await page.locator('text=Login');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.fill('input[type="email"]', 'admin@verdict360.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("Sign In")');
      await page.waitForTimeout(2000);
      await page.goto('http://localhost:3000/admin');
    }

    console.log('✓ Starting support escalation workflow');

    // Navigate to a specific tenant that needs attention
    await page.click('text=Manage Tenants');
    await page.waitForURL('**/admin/tenants');

    // Find tenant with issues (e.g., past_due status)
    const pastDueTenant = await page.locator('text=past_due').first();
    if (await pastDueTenant.isVisible()) {
      const tenantRow = await pastDueTenant.locator('..').locator('..');
      await tenantRow.locator('text=View').click();

      console.log('✓ Found tenant with billing issues');

      // Review billing details
      await page.click('text=Billing');
      await page.waitForTimeout(1000);
      console.log('✓ Reviewing billing information');

      // Would typically update payment method or contact customer
      const updatePaymentButton = await page.locator('button:has-text("Update Payment Method")');
      if (await updatePaymentButton.isVisible()) {
        console.log('✓ Payment method update option available');
      }
    }

    // Check for tenants approaching limits
    await page.goto('http://localhost:3000/admin/tenants');
    console.log('✓ Checking for tenants approaching usage limits');

    // Review email failure alerts
    await page.goto('http://localhost:3000/admin');
    const emailFailures = await page.locator('text=Email Failures (24h)').locator('..').locator('.text-red-600');
    if (await emailFailures.isVisible()) {
      const failureCount = await emailFailures.textContent();
      console.log(`⚠️ Email failures detected: ${failureCount}`);

      // Would navigate to email settings to troubleshoot
      if (parseInt(failureCount) > 0) {
        await page.goto('http://localhost:3000/admin/settings');
        await page.waitForSelector('text=Email Configuration');
        console.log('✓ Navigated to email settings for troubleshooting');

        // Test email connection
        const testEmailButton = await page.locator('button:has-text("Test Connection")');
        if (await testEmailButton.isVisible()) {
          console.log('✓ Ready to test email connection');
        }
      }
    }

    console.log('\n✅ Support escalation workflow completed!');
  });
});

console.log('Admin workflow test file created. Run with: npx playwright test tests/admin-workflow.spec.js');