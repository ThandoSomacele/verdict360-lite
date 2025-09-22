<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';

  // Get tenant info from session/database
  let tenantId = '11111111-1111-1111-1111-111111111111'; // This would come from session
  let subdomain = 'demo'; // This would come from tenant data

  let copied = false;

  // Generate the embed script
  $: embedScript = `<!-- Verdict 360 Chat Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['Verdict360']=o;w[o]=w[o]||function(){
    (w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','v360','https://${subdomain}.verdict360.com/widget.js'));

  v360('init', {
    tenantId: '${tenantId}',
    position: 'bottom-right',
    primaryColor: '#3b82f6',
    greeting: 'Hi! How can I help you today?'
  });
<\/script>
<!-- End Verdict 360 Chat Widget -->`;

  // Alternative: Simple iframe version
  $: iframeCode = `<!-- Verdict 360 Chat Widget (iframe) -->
<iframe
  src="https://${subdomain}.verdict360.com/chat-widget?tenant=${tenantId}"
  style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; z-index: 9999;"
  frameborder="0">
</iframe>`;

  // WordPress plugin code (using backtick escape)
  $: wordpressCode = [
    '<?php',
    '/**',
    ' * Plugin Name: Verdict 360 Legal Assistant',
    ' * Description: AI-powered legal assistant for your law firm website',
    ' * Version: 1.0',
    ' */',
    '',
    'function verdict360_chat_widget() {',
    '    ?>',
    '    <script>',
    '      (function(w,d,s,o,f,js,fjs){',
    "        w['Verdict360']=o;w[o]=w[o]||function(){",
    '        (w[o].q=w[o].q||[]).push(arguments)};',
    "        js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];",
    "        js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);",
    "      }(window,document,'script','v360','https://<?php echo \\$subdomain; ?>.verdict360.com/widget.js'));",
    '',
    "      v360('init', {",
    "        tenantId: '<?php echo \\$tenantId; ?>',",
    "        position: 'bottom-right'",
    '      });',
    '    </' + 'script>',
    '    <?php',
    '}',
    "add_action('wp_footer', 'verdict360_chat_widget');"
  ].join('\n');

  async function copyToClipboard(text: string, type: string) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  let activeTab = 'standard';
</script>

<svelte:head>
  <title>Installation - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Install Chat Widget</h1>
      <p class="text-gray-600 mt-2">Add Verdict 360 to your website in minutes</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent class="p-4">
          <div class="text-2xl font-bold text-blue-600">1 min</div>
          <div class="text-sm text-gray-600">Setup time</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <div class="text-2xl font-bold text-green-600">✓</div>
          <div class="text-sm text-gray-600">No coding required</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <div class="text-2xl font-bold text-purple-600">24/7</div>
          <div class="text-sm text-gray-600">AI availability</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <div class="text-2xl font-bold text-orange-600">100%</div>
          <div class="text-sm text-gray-600">Mobile responsive</div>
        </CardContent>
      </Card>
    </div>

    <!-- Installation Methods -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Choose Your Installation Method</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Tab Navigation -->
        <div class="flex space-x-4 border-b mb-6">
          <button
            on:click={() => activeTab = 'standard'}
            class="pb-2 px-1 border-b-2 transition-colors {activeTab === 'standard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}"
          >
            Standard Website
          </button>
          <button
            on:click={() => activeTab = 'wordpress'}
            class="pb-2 px-1 border-b-2 transition-colors {activeTab === 'wordpress' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}"
          >
            WordPress
          </button>
          <button
            on:click={() => activeTab = 'iframe'}
            class="pb-2 px-1 border-b-2 transition-colors {activeTab === 'iframe' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}"
          >
            Simple iframe
          </button>
          <button
            on:click={() => activeTab = 'react'}
            class="pb-2 px-1 border-b-2 transition-colors {activeTab === 'react' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}"
          >
            React/Next.js
          </button>
        </div>

        <!-- Standard Website -->
        {#if activeTab === 'standard'}
          <div class="space-y-4">
            <h3 class="font-semibold">Add to any HTML website</h3>
            <p class="text-sm text-gray-600">
              Copy and paste this code just before the closing &lt;/body&gt; tag on your website:
            </p>
            <div class="relative">
              <pre class="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{embedScript}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                on:click={() => copyToClipboard(embedScript, 'standard')}
                class="absolute top-2 right-2"
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>
        {/if}

        <!-- WordPress -->
        {#if activeTab === 'wordpress'}
          <div class="space-y-4">
            <h3 class="font-semibold">WordPress Plugin</h3>
            <div class="bg-blue-50 p-4 rounded-lg mb-4">
              <p class="text-sm text-blue-800">
                <strong>Easier method:</strong> Install our WordPress plugin from the
                <a href="#" class="underline">WordPress Plugin Directory</a>
              </p>
            </div>
            <p class="text-sm text-gray-600">Or manually add this PHP code to your theme's functions.php:</p>
            <div class="relative">
              <pre class="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{wordpressCode}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                on:click={() => copyToClipboard(wordpressCode, 'wordpress')}
                class="absolute top-2 right-2"
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>
        {/if}

        <!-- iframe -->
        {#if activeTab === 'iframe'}
          <div class="space-y-4">
            <h3 class="font-semibold">Simple iframe Embed</h3>
            <p class="text-sm text-gray-600">
              The simplest method - just add this iframe to your page:
            </p>
            <div class="relative">
              <pre class="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{iframeCode}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                on:click={() => copyToClipboard(iframeCode, 'iframe')}
                class="absolute top-2 right-2"
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>
        {/if}

        <!-- React -->
        {#if activeTab === 'react'}
          <div class="space-y-4">
            <h3 class="font-semibold">React/Next.js Component</h3>
            <p class="text-sm text-gray-600 mb-4">Install our npm package:</p>
            <div class="bg-gray-900 text-gray-300 p-3 rounded-lg mb-4">
              <code>npm install @verdict360/chat-widget</code>
            </div>
            <p class="text-sm text-gray-600 mb-4">Then import and use the component:</p>
            <div class="relative">
              <pre class="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`import { ChatWidget } from '@verdict360/chat-widget';

function App() {
  return (
    <>
      {/* Your app content */}
      <ChatWidget
        tenantId="${tenantId}"
        position="bottom-right"
        primaryColor="#3b82f6"
      />
    </>
  );
}`}</code>
              </pre>
            </div>
          </div>
        {/if}
      </CardContent>
    </Card>

    <!-- Configuration Options -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Widget Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-3">Appearance</h4>
            <div class="space-y-3">
              <label class="flex items-center justify-between">
                <span class="text-sm">Position</span>
                <select class="px-3 py-1 border rounded">
                  <option>Bottom Right</option>
                  <option>Bottom Left</option>
                  <option>Top Right</option>
                  <option>Top Left</option>
                </select>
              </label>
              <label class="flex items-center justify-between">
                <span class="text-sm">Primary Color</span>
                <input type="color" value="#3b82f6" class="w-20 h-8 border rounded" />
              </label>
              <label class="flex items-center justify-between">
                <span class="text-sm">Chat Icon</span>
                <select class="px-3 py-1 border rounded">
                  <option>Default</option>
                  <option>Custom Logo</option>
                </select>
              </label>
            </div>
          </div>

          <div>
            <h4 class="font-semibold mb-3">Behavior</h4>
            <div class="space-y-3">
              <label class="flex items-center justify-between">
                <span class="text-sm">Auto-open after (seconds)</span>
                <input type="number" value="0" class="w-20 px-2 py-1 border rounded" />
              </label>
              <label class="flex items-center justify-between">
                <span class="text-sm">Show on mobile</span>
                <input type="checkbox" checked class="w-5 h-5" />
              </label>
              <label class="flex items-center justify-between">
                <span class="text-sm">Play notification sound</span>
                <input type="checkbox" checked class="w-5 h-5" />
              </label>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <Button variant="default">Save Configuration</Button>
        </div>
      </CardContent>
    </Card>

    <!-- Testing -->
    <Card>
      <CardHeader>
        <CardTitle>Test Your Installation</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-gray-600 mb-4">
          After adding the code to your website, test it here:
        </p>
        <div class="flex items-center space-x-4">
          <input
            type="url"
            placeholder="https://yourlawfirm.com"
            class="flex-1 px-4 py-2 border rounded-lg"
          />
          <Button variant="default">
            Test Widget
          </Button>
        </div>

        <div class="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 class="font-semibold text-green-800 mb-2">✓ Installation Checklist</h4>
          <ul class="space-y-2 text-sm text-green-700">
            <li>◉ Widget code added to website</li>
            <li>◉ Widget appears on page load</li>
            <li>◉ Chat opens when clicked</li>
            <li>◉ Messages are being received</li>
            <li>◉ Leads are captured in dashboard</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <!-- Help Section -->
    <div class="mt-8 text-center">
      <p class="text-gray-600">
        Need help with installation?
        <a href="/docs/installation" class="text-blue-600 underline">View detailed guide</a>
        or <a href="mailto:support@verdict360.com" class="text-blue-600 underline">contact support</a>
      </p>
    </div>
  </div>
</div>