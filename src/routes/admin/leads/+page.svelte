<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let selectedLead = $state<any>(null);
  let showDetails = $state(false);
  let showAddNote = $state(false);
  let noteText = $state('');

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    converted: 'bg-purple-100 text-purple-800',
    lost: 'bg-red-100 text-red-800'
  };

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' }
  ];

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function viewLeadDetails(lead: any) {
    selectedLead = lead;
    showDetails = true;
  }

  function closeDetails() {
    showDetails = false;
    selectedLead = null;
  }

  function openAddNote(lead: any) {
    selectedLead = lead;
    showAddNote = true;
    noteText = '';
  }

  function closeAddNote() {
    showAddNote = false;
    noteText = '';
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Lead Management</h1>
      <p class="text-gray-600 mt-1">Manage and track your chat leads</p>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Total Leads</p>
        <p class="text-2xl font-bold text-gray-900">{data.stats.total}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">New</p>
        <p class="text-2xl font-bold text-blue-600">{data.stats.new}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Contacted</p>
        <p class="text-2xl font-bold text-yellow-600">{data.stats.contacted}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Qualified</p>
        <p class="text-2xl font-bold text-green-600">{data.stats.qualified}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Converted</p>
        <p class="text-2xl font-bold text-purple-600">{data.stats.converted}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <form method="GET" class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <input
            type="text"
            name="search"
            placeholder="Search leads..."
            value={data.filters.search}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <select
            name="status"
            value={data.filters.status}
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            {#each statusOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Filter
        </button>
      </form>
    </div>

    <!-- Leads Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enquiry
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each data.leads as lead}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{lead.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{lead.email}</div>
                  <div class="text-sm text-gray-500">{lead.phone}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">
                    {lead.enquiry_details}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full {statusColors[lead.status] || 'bg-gray-100 text-gray-800'}">
                    {lead.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(lead.created_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onclick={() => viewLeadDetails(lead)}
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    onclick={() => openAddNote(lead)}
                    class="text-green-600 hover:text-green-900"
                  >
                    Note
                  </button>
                </td>
              </tr>
            {/each}
            {#if data.leads.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      {#if data.pagination.totalPages > 1}
        <div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            {#if data.pagination.page > 1}
              <a
                href="?page={data.pagination.page - 1}&search={data.filters.search}&status={data.filters.status}"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </a>
            {/if}
            {#if data.pagination.page < data.pagination.totalPages}
              <a
                href="?page={data.pagination.page + 1}&search={data.filters.search}&status={data.filters.status}"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </a>
            {/if}
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{(data.pagination.page - 1) * data.pagination.limit + 1}</span>
                to
                <span class="font-medium">{Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}</span>
                of
                <span class="font-medium">{data.pagination.total}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {#if data.pagination.page > 1}
                  <a
                    href="?page={data.pagination.page - 1}&search={data.filters.search}&status={data.filters.status}"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </a>
                {/if}
                {#each Array(data.pagination.totalPages) as _, i}
                  {#if i + 1 === data.pagination.page}
                    <span class="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 text-sm font-medium text-blue-600">
                      {i + 1}
                    </span>
                  {:else if Math.abs((i + 1) - data.pagination.page) < 3 || i === 0 || i === data.pagination.totalPages - 1}
                    <a
                      href="?page={i + 1}&search={data.filters.search}&status={data.filters.status}"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {i + 1}
                    </a>
                  {:else if Math.abs((i + 1) - data.pagination.page) === 3}
                    <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  {/if}
                {/each}
                {#if data.pagination.page < data.pagination.totalPages}
                  <a
                    href="?page={data.pagination.page + 1}&search={data.filters.search}&status={data.filters.status}"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </a>
                {/if}
              </nav>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Lead Details Modal -->
  {#if showDetails && selectedLead}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold text-gray-900">Lead Details</h2>
            <button
              onclick={closeDetails}
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Contact Information</h3>
              <div class="mt-2 space-y-1">
                <p class="text-sm text-gray-900"><strong>Name:</strong> {selectedLead.name}</p>
                <p class="text-sm text-gray-900"><strong>Email:</strong> {selectedLead.email}</p>
                <p class="text-sm text-gray-900"><strong>Phone:</strong> {selectedLead.phone}</p>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">Enquiry Details</h3>
              <p class="mt-2 text-sm text-gray-900">{selectedLead.enquiry_details}</p>
            </div>

            {#if selectedLead.additional_message}
              <div>
                <h3 class="text-sm font-medium text-gray-500">Additional Message</h3>
                <p class="mt-2 text-sm text-gray-900">{selectedLead.additional_message}</p>
              </div>
            {/if}

            <div>
              <h3 class="text-sm font-medium text-gray-500">Status</h3>
              <form method="POST" action="?/updateStatus" use:enhance>
                <input type="hidden" name="leadId" value={selectedLead.id} />
                <select
                  name="status"
                  value={selectedLead.status}
                  onchange={(e) => e.currentTarget.form?.requestSubmit()}
                  class="mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {#each statusOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </form>
            </div>

            {#if selectedLead.internal_notes}
              <div>
                <h3 class="text-sm font-medium text-gray-500">Internal Notes</h3>
                <pre class="mt-2 text-sm text-gray-900 whitespace-pre-wrap">{selectedLead.internal_notes}</pre>
              </div>
            {/if}

            <div>
              <h3 class="text-sm font-medium text-gray-500">Timeline</h3>
              <div class="mt-2 space-y-1">
                <p class="text-sm text-gray-900"><strong>Created:</strong> {formatDate(selectedLead.created_at)}</p>
                {#if selectedLead.contacted_at}
                  <p class="text-sm text-gray-900"><strong>Contacted:</strong> {formatDate(selectedLead.contacted_at)}</p>
                {/if}
                <p class="text-sm text-gray-900"><strong>Last Updated:</strong> {formatDate(selectedLead.updated_at)}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <form method="POST" action="?/deleteLead" use:enhance>
              <input type="hidden" name="leadId" value={selectedLead.id} />
              <button
                type="submit"
                onclick={() => confirm('Are you sure you want to delete this lead?')}
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Lead
              </button>
            </form>
            <button
              onclick={closeDetails}
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Add Note Modal -->
  {#if showAddNote && selectedLead}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full">
        <form method="POST" action="?/addNote" use:enhance>
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Add Note</h2>

            <input type="hidden" name="leadId" value={selectedLead.id} />

            <div>
              <label for="note" class="block text-sm font-medium text-gray-700 mb-2">
                Note for {selectedLead.name}
              </label>
              <textarea
                id="note"
                name="note"
                bind:value={noteText}
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your note here..."
                required
              ></textarea>
            </div>

            <div class="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onclick={closeAddNote}
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>