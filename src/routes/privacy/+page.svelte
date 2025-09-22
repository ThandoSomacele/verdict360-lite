<script lang="ts">
  import { onMount } from 'svelte';
</script>

<svelte:head>
  <title>Privacy Policy - Verdict 360 | POPIA Compliant</title>
  <meta name="description" content="Verdict 360 Privacy Policy - POPIA compliant data protection for South African law firms" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
  <h1 class="text-3xl font-bold mb-8">Privacy Policy & POPIA Compliance</h1>

  <div class="prose prose-lg">
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">1. Information We Collect</h2>
      <p class="mb-4">In compliance with the Protection of Personal Information Act (POPIA), we collect and process:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Law Firm Information:</strong> Firm name, address, contact details, registration numbers</li>
        <li><strong>User Information:</strong> Name, email, phone number, professional credentials</li>
        <li><strong>Client Interaction Data:</strong> Chat conversations with AI (anonymized)</li>
        <li><strong>Technical Data:</strong> IP addresses, browser information, access logs</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">2. Lawful Basis for Processing</h2>
      <p class="mb-4">We process personal information based on:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Consent:</strong> Explicit opt-in during registration</li>
        <li><strong>Contract:</strong> Necessary for service provision</li>
        <li><strong>Legal Obligation:</strong> Compliance with South African laws</li>
        <li><strong>Legitimate Interest:</strong> Improving services and security</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">3. Data Protection Measures</h2>
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="font-semibold">Our Security Commitments:</p>
        <ul class="list-disc pl-6 mt-2">
          <li>End-to-end encryption for all client conversations</li>
          <li>Multi-tenant data isolation - each law firm's data is completely separated</li>
          <li>Regular security audits and penetration testing</li>
          <li>Automatic data backup with encryption at rest</li>
          <li>Role-based access control (RBAC)</li>
          <li>Two-factor authentication available</li>
        </ul>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">4. Attorney-Client Privilege</h2>
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-semibold">Special Protections for Legal Data:</p>
        <ul class="list-disc pl-6 mt-2">
          <li>We do NOT access or review client conversation content</li>
          <li>AI models process data locally without storing sensitive information</li>
          <li>Automatic deletion of conversation logs after 30 days (configurable)</li>
          <li>Zero-knowledge architecture for sensitive case data</li>
        </ul>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">5. Data Subject Rights (POPIA Section 5)</h2>
      <p class="mb-4">You have the right to:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Access:</strong> Request copies of your personal data</li>
        <li><strong>Rectification:</strong> Correct inaccurate information</li>
        <li><strong>Deletion:</strong> Request removal of your data</li>
        <li><strong>Restriction:</strong> Limit processing of your data</li>
        <li><strong>Portability:</strong> Export your data in machine-readable format</li>
        <li><strong>Object:</strong> Oppose certain types of processing</li>
        <li><strong>Withdraw Consent:</strong> At any time via settings</li>
      </ul>
      <p>Contact our Data Protection Officer: <a href="mailto:privacy@verdict360.com" class="text-blue-600 hover:underline">privacy@verdict360.com</a></p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">6. Data Retention</h2>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 p-2 text-left">Data Type</th>
            <th class="border border-gray-300 p-2 text-left">Retention Period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-300 p-2">Account Information</td>
            <td class="border border-gray-300 p-2">Duration of service + 5 years</td>
          </tr>
          <tr>
            <td class="border border-gray-300 p-2">Chat Conversations</td>
            <td class="border border-gray-300 p-2">30 days (configurable)</td>
          </tr>
          <tr>
            <td class="border border-gray-300 p-2">Financial Records</td>
            <td class="border border-gray-300 p-2">7 years (legal requirement)</td>
          </tr>
          <tr>
            <td class="border border-gray-300 p-2">Access Logs</td>
            <td class="border border-gray-300 p-2">90 days</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">7. Cross-Border Data Transfers</h2>
      <p class="mb-4">Your data is stored in South African data centers. Any international transfers comply with POPIA requirements:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Adequate protection assessments</li>
        <li>Standard contractual clauses</li>
        <li>Your explicit consent where required</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">8. Information Regulator Contact</h2>
      <div class="bg-gray-100 p-4 rounded">
        <p class="font-semibold mb-2">South African Information Regulator:</p>
        <p>Email: complaints.IR@justice.gov.za</p>
        <p>Phone: +27 (0) 10 023 5200</p>
        <p>Website: <a href="https://inforegulator.org.za" target="_blank" class="text-blue-600 hover:underline">inforegulator.org.za</a></p>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">9. Updates to This Policy</h2>
      <p>Last Updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p class="mt-2">We will notify you of material changes via email and platform notification.</p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">10. Consent Declaration</h2>
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <p class="font-semibold mb-2">By using Verdict 360, you acknowledge that:</p>
        <ul class="list-disc pl-6">
          <li>You have read and understood this privacy policy</li>
          <li>You consent to the processing of personal information as described</li>
          <li>You will ensure your clients are aware of data processing when using our chat services</li>
          <li>You understand your rights under POPIA</li>
        </ul>
      </div>
    </section>
  </div>
</div>