import { D as push, a2 as copy_payload, a3 as assign_payload, G as pop, T as head, K as push_element, M as pop_element, F as prevent_snippet_stringification, P as attr, a4 as maybe_selected, I as FILENAME, U as ensure_array_like, R as escape_html } from "../../../../chunks/index.js";
import { C as Card, c as Card_content, a as Card_header, b as Card_title } from "../../../../chunks/card-content.js";
import { B as Badge } from "../../../../chunks/badge.js";
import { B as Button } from "../../../../chunks/button.js";
import { I as Input } from "../../../../chunks/input.js";
_page[FILENAME] = "src/routes/admin/tenants/+page.svelte";
function _page($$payload, $$props) {
  push(_page);
  let tenants = [];
  let loading = true;
  let searchTerm = "";
  let statusFilter = "all";
  let planFilter = "all";
  let currentPage = 1;
  let totalPages = 1;
  async function fetchTenants() {
    loading = true;
    try {
      const token = localStorage.getItem("accessToken");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        status: statusFilter,
        plan: planFilter
      });
      const response = await fetch(`/api/admin/tenants?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        tenants = data.tenants || [];
        totalPages = data.totalPages || 1;
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      loading = false;
    }
  }
  async function toggleTenantStatus(tenantId, currentStatus) {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        await fetchTenants();
      }
    } catch (error) {
      console.error("Error updating tenant status:", error);
    }
  }
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });
  }
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Manage Tenants - Verdict 360 Admin</title>`;
      $$payload3.out.push(`<meta name="description" content="Manage all tenant accounts on the Verdict 360 platform."/>`);
      push_element($$payload3, "meta", 90, 2);
      pop_element();
    });
    $$payload2.out.push(`<div class="min-h-screen bg-gray-50">`);
    push_element($$payload2, "div", 93, 0);
    $$payload2.out.push(`<header class="bg-white shadow-sm border-b">`);
    push_element($$payload2, "header", 95, 2);
    $$payload2.out.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
    push_element($$payload2, "div", 96, 4);
    $$payload2.out.push(`<div class="flex justify-between items-center py-4">`);
    push_element($$payload2, "div", 97, 6);
    $$payload2.out.push(`<div>`);
    push_element($$payload2, "div", 98, 8);
    $$payload2.out.push(`<h1 class="text-2xl font-bold text-gray-900">`);
    push_element($$payload2, "h1", 99, 10);
    $$payload2.out.push(`Tenant Management</h1>`);
    pop_element();
    $$payload2.out.push(` <p class="text-sm text-gray-600">`);
    push_element($$payload2, "p", 100, 10);
    $$payload2.out.push(`Manage all law firms on the platform</p>`);
    pop_element();
    $$payload2.out.push(`</div>`);
    pop_element();
    $$payload2.out.push(` <div class="flex items-center space-x-4">`);
    push_element($$payload2, "div", 102, 8);
    Button($$payload2, {
      variant: "outline",
      onclick: () => window.location.href = "/admin",
      children: prevent_snippet_stringification(($$payload3) => {
        $$payload3.out.push(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
        push_element($$payload3, "svg", 104, 12);
        $$payload3.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M10 19l-7-7m0 0l7-7m-7 7h18">`);
        push_element($$payload3, "path", 105, 14);
        $$payload3.out.push(`</path>`);
        pop_element();
        $$payload3.out.push(`</svg>`);
        pop_element();
        $$payload3.out.push(` Back to Dashboard`);
      }),
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----> `);
    Button($$payload2, {
      variant: "default",
      onclick: () => window.location.href = "/admin/tenants/new",
      children: prevent_snippet_stringification(($$payload3) => {
        $$payload3.out.push(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
        push_element($$payload3, "svg", 110, 12);
        $$payload3.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M12 4v16m8-8H4">`);
        push_element($$payload3, "path", 111, 14);
        $$payload3.out.push(`</path>`);
        pop_element();
        $$payload3.out.push(`</svg>`);
        pop_element();
        $$payload3.out.push(` Add Tenant`);
      }),
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----></div>`);
    pop_element();
    $$payload2.out.push(`</div>`);
    pop_element();
    $$payload2.out.push(`</div>`);
    pop_element();
    $$payload2.out.push(`</header>`);
    pop_element();
    $$payload2.out.push(` <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
    push_element($$payload2, "main", 120, 2);
    Card($$payload2, {
      class: "mb-6",
      children: prevent_snippet_stringification(($$payload3) => {
        Card_content($$payload3, {
          class: "py-4",
          children: prevent_snippet_stringification(($$payload4) => {
            $$payload4.out.push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-4">`);
            push_element($$payload4, "div", 124, 8);
            $$payload4.out.push(`<div>`);
            push_element($$payload4, "div", 125, 10);
            $$payload4.out.push(`<label for="search" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 126, 12);
            $$payload4.out.push(`Search</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "text",
              id: "search",
              placeholder: "Search by name or email...",
              onchange: fetchTenants,
              class: "w-full",
              get value() {
                return searchTerm;
              },
              set value($$value) {
                searchTerm = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 139, 10);
            $$payload4.out.push(`<label for="status" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 140, 12);
            $$payload4.out.push(`Status</label>`);
            pop_element();
            $$payload4.out.push(` <select id="status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">`);
            push_element($$payload4, "select", 143, 12);
            $$payload4.select_value = statusFilter;
            $$payload4.out.push(`<option value="all"${maybe_selected($$payload4, "all")}>`);
            push_element($$payload4, "option", 149, 14);
            $$payload4.out.push(`All Status</option>`);
            pop_element();
            $$payload4.out.push(`<option value="active"${maybe_selected($$payload4, "active")}>`);
            push_element($$payload4, "option", 150, 14);
            $$payload4.out.push(`Active</option>`);
            pop_element();
            $$payload4.out.push(`<option value="inactive"${maybe_selected($$payload4, "inactive")}>`);
            push_element($$payload4, "option", 151, 14);
            $$payload4.out.push(`Inactive</option>`);
            pop_element();
            $$payload4.out.push(`<option value="suspended"${maybe_selected($$payload4, "suspended")}>`);
            push_element($$payload4, "option", 152, 14);
            $$payload4.out.push(`Suspended</option>`);
            pop_element();
            $$payload4.out.push(`<option value="trial"${maybe_selected($$payload4, "trial")}>`);
            push_element($$payload4, "option", 153, 14);
            $$payload4.out.push(`Trial</option>`);
            pop_element();
            $$payload4.select_value = void 0;
            $$payload4.out.push(`</select>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 157, 10);
            $$payload4.out.push(`<label for="plan" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 158, 12);
            $$payload4.out.push(`Plan</label>`);
            pop_element();
            $$payload4.out.push(` <select id="plan" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">`);
            push_element($$payload4, "select", 161, 12);
            $$payload4.select_value = planFilter;
            $$payload4.out.push(`<option value="all"${maybe_selected($$payload4, "all")}>`);
            push_element($$payload4, "option", 167, 14);
            $$payload4.out.push(`All Plans</option>`);
            pop_element();
            $$payload4.out.push(`<option value="starter"${maybe_selected($$payload4, "starter")}>`);
            push_element($$payload4, "option", 168, 14);
            $$payload4.out.push(`Starter</option>`);
            pop_element();
            $$payload4.out.push(`<option value="professional"${maybe_selected($$payload4, "professional")}>`);
            push_element($$payload4, "option", 169, 14);
            $$payload4.out.push(`Professional</option>`);
            pop_element();
            $$payload4.out.push(`<option value="enterprise"${maybe_selected($$payload4, "enterprise")}>`);
            push_element($$payload4, "option", 170, 14);
            $$payload4.out.push(`Enterprise</option>`);
            pop_element();
            $$payload4.select_value = void 0;
            $$payload4.out.push(`</select>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div class="flex items-end">`);
            push_element($$payload4, "div", 174, 10);
            Button($$payload4, {
              variant: "outline",
              onclick: fetchTenants,
              class: "w-full",
              children: prevent_snippet_stringification(($$payload5) => {
                $$payload5.out.push(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
                push_element($$payload5, "svg", 176, 14);
                $$payload5.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">`);
                push_element($$payload5, "path", 177, 16);
                $$payload5.out.push(`</path>`);
                pop_element();
                $$payload5.out.push(`</svg>`);
                pop_element();
                $$payload5.out.push(` Refresh`);
              }),
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
      }),
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----> `);
    Card($$payload2, {
      children: prevent_snippet_stringification(($$payload3) => {
        Card_header($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            Card_title($$payload4, {
              children: prevent_snippet_stringification(($$payload5) => {
                $$payload5.out.push(`<!---->All Tenants`);
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        Card_content($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            if (loading) {
              $$payload4.out.push("<!--[-->");
              $$payload4.out.push(`<div class="flex justify-center items-center py-12">`);
              push_element($$payload4, "div", 193, 10);
              $$payload4.out.push(`<svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">`);
              push_element($$payload4, "svg", 194, 12);
              $$payload4.out.push(`<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">`);
              push_element($$payload4, "circle", 195, 14);
              $$payload4.out.push(`</circle>`);
              pop_element();
              $$payload4.out.push(`<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">`);
              push_element($$payload4, "path", 196, 14);
              $$payload4.out.push(`</path>`);
              pop_element();
              $$payload4.out.push(`</svg>`);
              pop_element();
              $$payload4.out.push(`</div>`);
              pop_element();
            } else {
              $$payload4.out.push("<!--[!-->");
              const each_array = ensure_array_like(tenants);
              $$payload4.out.push(`<div class="overflow-x-auto">`);
              push_element($$payload4, "div", 200, 10);
              $$payload4.out.push(`<table class="w-full">`);
              push_element($$payload4, "table", 201, 12);
              $$payload4.out.push(`<thead>`);
              push_element($$payload4, "thead", 202, 14);
              $$payload4.out.push(`<tr class="border-b">`);
              push_element($$payload4, "tr", 203, 16);
              $$payload4.out.push(`<th class="text-left py-3 px-4 text-sm font-medium text-gray-700">`);
              push_element($$payload4, "th", 204, 18);
              $$payload4.out.push(`Firm Name</th>`);
              pop_element();
              $$payload4.out.push(`<th class="text-left py-3 px-4 text-sm font-medium text-gray-700">`);
              push_element($$payload4, "th", 205, 18);
              $$payload4.out.push(`Contact</th>`);
              pop_element();
              $$payload4.out.push(`<th class="text-left py-3 px-4 text-sm font-medium text-gray-700">`);
              push_element($$payload4, "th", 206, 18);
              $$payload4.out.push(`Plan</th>`);
              pop_element();
              $$payload4.out.push(`<th class="text-left py-3 px-4 text-sm font-medium text-gray-700">`);
              push_element($$payload4, "th", 207, 18);
              $$payload4.out.push(`Status</th>`);
              pop_element();
              $$payload4.out.push(`<th class="text-left py-3 px-4 text-sm font-medium text-gray-700">`);
              push_element($$payload4, "th", 208, 18);
              $$payload4.out.push(`Users</th>`);
              pop_element();
              $$payload4.out.push(`<th class="text-left py-3 px-4 text-sm font-medium text-gray-700">`);
              push_element($$payload4, "th", 209, 18);
              $$payload4.out.push(`MRR</th>`);
              pop_element();
              $$payload4.out.push(`<th class="text-left py-3 px-4 text-sm font-medium text-gray-700">`);
              push_element($$payload4, "th", 210, 18);
              $$payload4.out.push(`Created</th>`);
              pop_element();
              $$payload4.out.push(`<th class="text-left py-3 px-4 text-sm font-medium text-gray-700">`);
              push_element($$payload4, "th", 211, 18);
              $$payload4.out.push(`Actions</th>`);
              pop_element();
              $$payload4.out.push(`</tr>`);
              pop_element();
              $$payload4.out.push(`</thead>`);
              pop_element();
              $$payload4.out.push(`<tbody>`);
              push_element($$payload4, "tbody", 214, 14);
              if (tenants.length === 0) {
                $$payload4.out.push("<!--[-->");
                $$payload4.out.push(`<tr>`);
                push_element($$payload4, "tr", 216, 18);
                $$payload4.out.push(`<td colspan="8" class="text-center py-12 text-gray-500">`);
                push_element($$payload4, "td", 217, 20);
                $$payload4.out.push(`No tenants found</td>`);
                pop_element();
                $$payload4.out.push(`</tr>`);
                pop_element();
              } else {
                $$payload4.out.push("<!--[!-->");
              }
              $$payload4.out.push(`<!--]--><tr class="border-b hover:bg-gray-50">`);
              push_element($$payload4, "tr", 224, 16);
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 225, 18);
              $$payload4.out.push(`<div>`);
              push_element($$payload4, "div", 226, 20);
              $$payload4.out.push(`<div class="font-medium">`);
              push_element($$payload4, "div", 227, 22);
              $$payload4.out.push(`Smith &amp; Associates</div>`);
              pop_element();
              $$payload4.out.push(` <div class="text-sm text-gray-500">`);
              push_element($$payload4, "div", 228, 22);
              $$payload4.out.push(`smith.verdict360.com</div>`);
              pop_element();
              $$payload4.out.push(`</div>`);
              pop_element();
              $$payload4.out.push(`</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 231, 18);
              $$payload4.out.push(`<div class="text-sm">`);
              push_element($$payload4, "div", 232, 20);
              $$payload4.out.push(`<div>`);
              push_element($$payload4, "div", 233, 22);
              $$payload4.out.push(`john@smithlaw.co.za</div>`);
              pop_element();
              $$payload4.out.push(` <div class="text-gray-500">`);
              push_element($$payload4, "div", 234, 22);
              $$payload4.out.push(`+27 11 234 5678</div>`);
              pop_element();
              $$payload4.out.push(`</div>`);
              pop_element();
              $$payload4.out.push(`</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 237, 18);
              Badge($$payload4, {
                variant: "default",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Professional`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 240, 18);
              Badge($$payload4, {
                variant: "success",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Active`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 243, 18);
              $$payload4.out.push(`8</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4 font-medium">`);
              push_element($$payload4, "td", 244, 18);
              $$payload4.out.push(`R7,999</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4 text-sm text-gray-600">`);
              push_element($$payload4, "td", 245, 18);
              $$payload4.out.push(`Dec 01, 2024</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 246, 18);
              $$payload4.out.push(`<div class="flex space-x-2">`);
              push_element($$payload4, "div", 247, 20);
              Button($$payload4, {
                size: "sm",
                variant: "outline",
                onclick: () => window.location.href = "/admin/tenants/smith",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->View`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----> `);
              Button($$payload4, {
                size: "sm",
                variant: "outline",
                onclick: () => toggleTenantStatus("smith", "active"),
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Suspend`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></div>`);
              pop_element();
              $$payload4.out.push(`</td>`);
              pop_element();
              $$payload4.out.push(`</tr>`);
              pop_element();
              $$payload4.out.push(`<tr class="border-b hover:bg-gray-50">`);
              push_element($$payload4, "tr", 258, 16);
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 259, 18);
              $$payload4.out.push(`<div>`);
              push_element($$payload4, "div", 260, 20);
              $$payload4.out.push(`<div class="font-medium">`);
              push_element($$payload4, "div", 261, 22);
              $$payload4.out.push(`Cape Town Legal</div>`);
              pop_element();
              $$payload4.out.push(` <div class="text-sm text-gray-500">`);
              push_element($$payload4, "div", 262, 22);
              $$payload4.out.push(`capetown.verdict360.com</div>`);
              pop_element();
              $$payload4.out.push(`</div>`);
              pop_element();
              $$payload4.out.push(`</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 265, 18);
              $$payload4.out.push(`<div class="text-sm">`);
              push_element($$payload4, "div", 266, 20);
              $$payload4.out.push(`<div>`);
              push_element($$payload4, "div", 267, 22);
              $$payload4.out.push(`info@ctlegal.co.za</div>`);
              pop_element();
              $$payload4.out.push(` <div class="text-gray-500">`);
              push_element($$payload4, "div", 268, 22);
              $$payload4.out.push(`+27 21 456 7890</div>`);
              pop_element();
              $$payload4.out.push(`</div>`);
              pop_element();
              $$payload4.out.push(`</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 271, 18);
              Badge($$payload4, {
                variant: "default",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Starter`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 274, 18);
              Badge($$payload4, {
                variant: "warning",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Trial`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 277, 18);
              $$payload4.out.push(`3</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4 font-medium">`);
              push_element($$payload4, "td", 278, 18);
              $$payload4.out.push(`R0</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4 text-sm text-gray-600">`);
              push_element($$payload4, "td", 279, 18);
              $$payload4.out.push(`Dec 10, 2024</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 280, 18);
              $$payload4.out.push(`<div class="flex space-x-2">`);
              push_element($$payload4, "div", 281, 20);
              Button($$payload4, {
                size: "sm",
                variant: "outline",
                onclick: () => window.location.href = "/admin/tenants/capetown",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->View`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----> `);
              Button($$payload4, {
                size: "sm",
                variant: "default",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Convert`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></div>`);
              pop_element();
              $$payload4.out.push(`</td>`);
              pop_element();
              $$payload4.out.push(`</tr>`);
              pop_element();
              $$payload4.out.push(`<tr class="border-b hover:bg-gray-50">`);
              push_element($$payload4, "tr", 292, 16);
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 293, 18);
              $$payload4.out.push(`<div>`);
              push_element($$payload4, "div", 294, 20);
              $$payload4.out.push(`<div class="font-medium">`);
              push_element($$payload4, "div", 295, 22);
              $$payload4.out.push(`Johannesburg Associates</div>`);
              pop_element();
              $$payload4.out.push(` <div class="text-sm text-gray-500">`);
              push_element($$payload4, "div", 296, 22);
              $$payload4.out.push(`jhb.verdict360.com</div>`);
              pop_element();
              $$payload4.out.push(`</div>`);
              pop_element();
              $$payload4.out.push(`</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 299, 18);
              $$payload4.out.push(`<div class="text-sm">`);
              push_element($$payload4, "div", 300, 20);
              $$payload4.out.push(`<div>`);
              push_element($$payload4, "div", 301, 22);
              $$payload4.out.push(`admin@jhblaw.co.za</div>`);
              pop_element();
              $$payload4.out.push(` <div class="text-gray-500">`);
              push_element($$payload4, "div", 302, 22);
              $$payload4.out.push(`+27 11 987 6543</div>`);
              pop_element();
              $$payload4.out.push(`</div>`);
              pop_element();
              $$payload4.out.push(`</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 305, 18);
              Badge($$payload4, {
                variant: "default",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Enterprise`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 308, 18);
              Badge($$payload4, {
                variant: "success",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Active`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 311, 18);
              $$payload4.out.push(`25</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4 font-medium">`);
              push_element($$payload4, "td", 312, 18);
              $$payload4.out.push(`R24,999</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4 text-sm text-gray-600">`);
              push_element($$payload4, "td", 313, 18);
              $$payload4.out.push(`Nov 15, 2024</td>`);
              pop_element();
              $$payload4.out.push(`<td class="py-3 px-4">`);
              push_element($$payload4, "td", 314, 18);
              $$payload4.out.push(`<div class="flex space-x-2">`);
              push_element($$payload4, "div", 315, 20);
              Button($$payload4, {
                size: "sm",
                variant: "outline",
                onclick: () => window.location.href = "/admin/tenants/jhb",
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->View`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----> `);
              Button($$payload4, {
                size: "sm",
                variant: "outline",
                onclick: () => toggleTenantStatus("jhb", "active"),
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Suspend`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></div>`);
              pop_element();
              $$payload4.out.push(`</td>`);
              pop_element();
              $$payload4.out.push(`</tr>`);
              pop_element();
              $$payload4.out.push(`<!--[-->`);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let tenant = each_array[$$index];
                $$payload4.out.push(`<tr class="border-b hover:bg-gray-50">`);
                push_element($$payload4, "tr", 327, 18);
                $$payload4.out.push(`<td class="py-3 px-4">`);
                push_element($$payload4, "td", 328, 20);
                $$payload4.out.push(`<div>`);
                push_element($$payload4, "div", 329, 22);
                $$payload4.out.push(`<div class="font-medium">`);
                push_element($$payload4, "div", 330, 24);
                $$payload4.out.push(`${escape_html(tenant.name)}</div>`);
                pop_element();
                $$payload4.out.push(` <div class="text-sm text-gray-500">`);
                push_element($$payload4, "div", 331, 24);
                $$payload4.out.push(`${escape_html(tenant.subdomain)}.verdict360.com</div>`);
                pop_element();
                $$payload4.out.push(`</div>`);
                pop_element();
                $$payload4.out.push(`</td>`);
                pop_element();
                $$payload4.out.push(`<td class="py-3 px-4">`);
                push_element($$payload4, "td", 334, 20);
                $$payload4.out.push(`<div class="text-sm">`);
                push_element($$payload4, "div", 335, 22);
                $$payload4.out.push(`<div>`);
                push_element($$payload4, "div", 336, 24);
                $$payload4.out.push(`${escape_html(tenant.email)}</div>`);
                pop_element();
                $$payload4.out.push(` <div class="text-gray-500">`);
                push_element($$payload4, "div", 337, 24);
                $$payload4.out.push(`${escape_html(tenant.phone)}</div>`);
                pop_element();
                $$payload4.out.push(`</div>`);
                pop_element();
                $$payload4.out.push(`</td>`);
                pop_element();
                $$payload4.out.push(`<td class="py-3 px-4">`);
                push_element($$payload4, "td", 340, 20);
                Badge($$payload4, {
                  variant: "default",
                  children: prevent_snippet_stringification(($$payload5) => {
                    $$payload5.out.push(`<!---->${escape_html(tenant.plan)}`);
                  }),
                  $$slots: { default: true }
                });
                $$payload4.out.push(`<!----></td>`);
                pop_element();
                $$payload4.out.push(`<td class="py-3 px-4">`);
                push_element($$payload4, "td", 343, 20);
                Badge($$payload4, {
                  variant: tenant.status === "active" ? "success" : tenant.status === "trial" ? "warning" : "secondary",
                  children: prevent_snippet_stringification(($$payload5) => {
                    $$payload5.out.push(`<!---->${escape_html(tenant.status)}`);
                  }),
                  $$slots: { default: true }
                });
                $$payload4.out.push(`<!----></td>`);
                pop_element();
                $$payload4.out.push(`<td class="py-3 px-4">`);
                push_element($$payload4, "td", 348, 20);
                $$payload4.out.push(`${escape_html(tenant.userCount)}</td>`);
                pop_element();
                $$payload4.out.push(`<td class="py-3 px-4 font-medium">`);
                push_element($$payload4, "td", 349, 20);
                $$payload4.out.push(`${escape_html(formatCurrency(tenant.mrr))}</td>`);
                pop_element();
                $$payload4.out.push(`<td class="py-3 px-4 text-sm text-gray-600">`);
                push_element($$payload4, "td", 350, 20);
                $$payload4.out.push(`${escape_html(formatDate(tenant.createdAt))}</td>`);
                pop_element();
                $$payload4.out.push(`<td class="py-3 px-4">`);
                push_element($$payload4, "td", 351, 20);
                $$payload4.out.push(`<div class="flex space-x-2">`);
                push_element($$payload4, "div", 352, 22);
                Button($$payload4, {
                  size: "sm",
                  variant: "outline",
                  onclick: () => window.location.href = `/admin/tenants/${tenant.id}`,
                  children: prevent_snippet_stringification(($$payload5) => {
                    $$payload5.out.push(`<!---->View`);
                  }),
                  $$slots: { default: true }
                });
                $$payload4.out.push(`<!----> `);
                Button($$payload4, {
                  size: "sm",
                  variant: "outline",
                  onclick: () => toggleTenantStatus(tenant.id, tenant.status),
                  children: prevent_snippet_stringification(($$payload5) => {
                    $$payload5.out.push(`<!---->${escape_html(tenant.status === "active" ? "Suspend" : "Activate")}`);
                  }),
                  $$slots: { default: true }
                });
                $$payload4.out.push(`<!----></div>`);
                pop_element();
                $$payload4.out.push(`</td>`);
                pop_element();
                $$payload4.out.push(`</tr>`);
                pop_element();
              }
              $$payload4.out.push(`<!--]--></tbody>`);
              pop_element();
              $$payload4.out.push(`</table>`);
              pop_element();
              $$payload4.out.push(`</div>`);
              pop_element();
              $$payload4.out.push(` <div class="flex justify-between items-center mt-6">`);
              push_element($$payload4, "div", 368, 10);
              $$payload4.out.push(`<div class="text-sm text-gray-600">`);
              push_element($$payload4, "div", 369, 12);
              $$payload4.out.push(`Page ${escape_html(currentPage)} of ${escape_html(totalPages)}</div>`);
              pop_element();
              $$payload4.out.push(` <div class="flex space-x-2">`);
              push_element($$payload4, "div", 372, 12);
              Button($$payload4, {
                variant: "outline",
                size: "sm",
                disabled: currentPage === 1,
                onclick: () => {
                  currentPage--;
                  fetchTenants();
                },
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Previous`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----> `);
              Button($$payload4, {
                variant: "outline",
                size: "sm",
                disabled: currentPage === totalPages,
                onclick: () => {
                  currentPage++;
                  fetchTenants();
                },
                children: prevent_snippet_stringification(($$payload5) => {
                  $$payload5.out.push(`<!---->Next`);
                }),
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></div>`);
              pop_element();
              $$payload4.out.push(`</div>`);
              pop_element();
            }
            $$payload4.out.push(`<!--]-->`);
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!---->`);
      }),
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----></main>`);
    pop_element();
    $$payload2.out.push(`</div>`);
    pop_element();
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
