<script lang="ts">
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3B82F6&color=fff',
      bio: 'Former partner at a leading SA law firm with 15 years of experience'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=3B82F6&color=fff',
      bio: 'AI expert with a passion for transforming legal services'
    },
    {
      name: 'Thandi Nkosi',
      role: 'Head of Legal AI',
      image: 'https://ui-avatars.com/api/?name=Thandi+Nkosi&background=3B82F6&color=fff',
      bio: 'Specializes in South African legal frameworks and AI training'
    },
    {
      name: 'David Kruger',
      role: 'Head of Customer Success',
      image: 'https://ui-avatars.com/api/?name=David+Kruger&background=3B82F6&color=fff',
      bio: 'Dedicated to helping law firms maximize their AI potential'
    }
  ];
  
  const values = [
    {
      title: 'Innovation',
      description: 'Pushing the boundaries of legal technology to deliver cutting-edge solutions',
      icon: '💡'
    },
    {
      title: 'Integrity',
      description: 'Maintaining the highest ethical standards in all our operations',
      icon: '⚖️'
    },
    {
      title: 'Accessibility',
      description: 'Making legal services more accessible to all South Africans',
      icon: '🤝'
    },
    {
      title: 'Excellence',
      description: 'Committed to delivering exceptional quality in everything we do',
      icon: '⭐'
    }
  ];
</script>

<svelte:head>
  <title>About Us - Verdict 360</title>
  <meta name="description" content="Learn about Verdict 360's mission to transform legal services in South Africa through AI technology." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <!-- Hero Section -->
  <div class="bg-white shadow-sm">
    <div class="container mx-auto px-4 py-16 max-w-7xl">
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Transforming Legal Services in South Africa
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to make legal services more accessible, efficient, and client-focused 
          through innovative AI technology tailored for South African law.
        </p>
      </div>
    </div>
  </div>
  
  <div class="container mx-auto px-4 py-16 max-w-7xl">
    <!-- Our Story -->
    <div class="mb-16">
      <Card>
        <CardHeader>
          <CardTitle class="text-3xl text-center">Our Story</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="prose max-w-none text-gray-700 space-y-4">
            <p>
              Founded in 2023, Verdict 360 emerged from a simple observation: South African law firms 
              were struggling to balance providing quality legal services with managing increasing client demands 
              and administrative burden.
            </p>
            <p>
              Our founders, having experienced these challenges firsthand, envisioned a solution that would 
              leverage artificial intelligence to handle routine legal queries, allowing lawyers to focus on 
              complex cases that truly require their expertise.
            </p>
            <p>
              Today, we serve over 200 law firms across South Africa, from solo practitioners in townships 
              to major firms in city centers. Our AI assistants have handled over 100,000 legal consultations, 
              helping firms improve client satisfaction while reducing operational costs by up to 40%.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <!-- Our Values -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-center mb-8">Our Values</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each values as value}
          <Card class="text-center">
            <CardContent class="pt-6">
              <div class="text-4xl mb-4">{value.icon}</div>
              <h3 class="font-semibold text-lg mb-2">{value.title}</h3>
              <p class="text-gray-600 text-sm">{value.description}</p>
            </CardContent>
          </Card>
        {/each}
      </div>
    </div>
    
    <!-- Team Section -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each teamMembers as member}
          <Card>
            <CardContent class="text-center pt-6">
              <img 
                src={member.image} 
                alt={member.name}
                class="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 class="font-semibold text-lg">{member.name}</h3>
              <p class="text-blue-600 text-sm mb-2">{member.role}</p>
              <p class="text-gray-600 text-sm">{member.bio}</p>
            </CardContent>
          </Card>
        {/each}
      </div>
    </div>
    
    <!-- Stats Section -->
    <div class="mb-16">
      <Card class="bg-blue-600 text-white">
        <CardContent class="py-12">
          <div class="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div class="text-4xl font-bold mb-2">200+</div>
              <div class="text-blue-100">Law Firms</div>
            </div>
            <div>
              <div class="text-4xl font-bold mb-2">100K+</div>
              <div class="text-blue-100">Consultations</div>
            </div>
            <div>
              <div class="text-4xl font-bold mb-2">99.9%</div>
              <div class="text-blue-100">Uptime</div>
            </div>
            <div>
              <div class="text-4xl font-bold mb-2">4.8/5</div>
              <div class="text-blue-100">Client Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <!-- CTA Section -->
    <div class="text-center">
      <Card>
        <CardContent class="py-12">
          <h2 class="text-2xl font-bold mb-4">Ready to Join the Legal AI Revolution?</h2>
          <p class="text-gray-600 mb-6">
            See how Verdict 360 can transform your law practice
          </p>
          <div class="flex justify-center space-x-4">
            <a href="/demo" class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Try Demo
            </a>
            <a href="/contact" class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Contact Us
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>