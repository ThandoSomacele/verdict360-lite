import { D as push, U as ensure_array_like, K as push_element, M as pop_element, R as escape_html, P as attr, a4 as maybe_selected, N as attr_class, a5 as stringify, G as pop, I as FILENAME } from "../../../../chunks/index.js";
import "../../../../chunks/client.js";
_page[FILENAME] = "src/routes/admin/leads/+page.svelte";
function _page($$payload, $$props) {
  push(_page);
  let { data } = $$props;
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    qualified: "bg-green-100 text-green-800",
    converted: "bg-purple-100 text-purple-800",
    lost: "bg-red-100 text-red-800"
  };
  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "converted", label: "Converted" },
    { value: "lost", label: "Lost" }
  ];
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  const each_array = ensure_array_like(statusOptions);
  const each_array_1 = ensure_array_like(data.leads);
  $$payload.out.push(`<div class="min-h-screen bg-gray-50">`);
  push_element($$payload, "div", 61, 0);
  $$payload.out.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
  push_element($$payload, "div", 62, 2);
  $$payload.out.push(`<div class="bg-white shadow-sm rounded-lg p-6 mb-6">`);
  push_element($$payload, "div", 64, 4);
  $$payload.out.push(`<h1 class="text-2xl font-bold text-gray-900">`);
  push_element($$payload, "h1", 65, 6);
  $$payload.out.push(`Lead Management</h1>`);
  pop_element();
  $$payload.out.push(` <p class="text-gray-600 mt-1">`);
  push_element($$payload, "p", 66, 6);
  $$payload.out.push(`Manage and track your chat leads</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">`);
  push_element($$payload, "div", 70, 4);
  $$payload.out.push(`<div class="bg-white rounded-lg shadow-sm p-4">`);
  push_element($$payload, "div", 71, 6);
  $$payload.out.push(`<p class="text-sm text-gray-600">`);
  push_element($$payload, "p", 72, 8);
  $$payload.out.push(`Total Leads</p>`);
  pop_element();
  $$payload.out.push(` <p class="text-2xl font-bold text-gray-900">`);
  push_element($$payload, "p", 73, 8);
  $$payload.out.push(`${escape_html(data.stats.total)}</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="bg-white rounded-lg shadow-sm p-4">`);
  push_element($$payload, "div", 75, 6);
  $$payload.out.push(`<p class="text-sm text-gray-600">`);
  push_element($$payload, "p", 76, 8);
  $$payload.out.push(`New</p>`);
  pop_element();
  $$payload.out.push(` <p class="text-2xl font-bold text-blue-600">`);
  push_element($$payload, "p", 77, 8);
  $$payload.out.push(`${escape_html(data.stats.new)}</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="bg-white rounded-lg shadow-sm p-4">`);
  push_element($$payload, "div", 79, 6);
  $$payload.out.push(`<p class="text-sm text-gray-600">`);
  push_element($$payload, "p", 80, 8);
  $$payload.out.push(`Contacted</p>`);
  pop_element();
  $$payload.out.push(` <p class="text-2xl font-bold text-yellow-600">`);
  push_element($$payload, "p", 81, 8);
  $$payload.out.push(`${escape_html(data.stats.contacted)}</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="bg-white rounded-lg shadow-sm p-4">`);
  push_element($$payload, "div", 83, 6);
  $$payload.out.push(`<p class="text-sm text-gray-600">`);
  push_element($$payload, "p", 84, 8);
  $$payload.out.push(`Qualified</p>`);
  pop_element();
  $$payload.out.push(` <p class="text-2xl font-bold text-green-600">`);
  push_element($$payload, "p", 85, 8);
  $$payload.out.push(`${escape_html(data.stats.qualified)}</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="bg-white rounded-lg shadow-sm p-4">`);
  push_element($$payload, "div", 87, 6);
  $$payload.out.push(`<p class="text-sm text-gray-600">`);
  push_element($$payload, "p", 88, 8);
  $$payload.out.push(`Converted</p>`);
  pop_element();
  $$payload.out.push(` <p class="text-2xl font-bold text-purple-600">`);
  push_element($$payload, "p", 89, 8);
  $$payload.out.push(`${escape_html(data.stats.converted)}</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="bg-white rounded-lg shadow-sm p-4 mb-6">`);
  push_element($$payload, "div", 94, 4);
  $$payload.out.push(`<form method="GET" class="flex flex-wrap gap-4">`);
  push_element($$payload, "form", 95, 6);
  $$payload.out.push(`<div class="flex-1 min-w-[200px]">`);
  push_element($$payload, "div", 96, 8);
  $$payload.out.push(`<input type="text" name="search" placeholder="Search leads..."${attr("value", data.filters.search)} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>`);
  push_element($$payload, "input", 97, 10);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div>`);
  push_element($$payload, "div", 105, 8);
  $$payload.out.push(`<select name="status" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">`);
  push_element($$payload, "select", 106, 10);
  $$payload.select_value = data.filters.status;
  $$payload.out.push(`<option value="all"${maybe_selected($$payload, "all")}>`);
  push_element($$payload, "option", 111, 12);
  $$payload.out.push(`All Status</option>`);
  pop_element();
  $$payload.out.push(`<!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let option = each_array[$$index];
    $$payload.out.push(`<option${attr("value", option.value)}${maybe_selected($$payload, option.value)}>`);
    push_element($$payload, "option", 113, 14);
    $$payload.out.push(`${escape_html(option.label)}</option>`);
    pop_element();
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">`);
  push_element($$payload, "button", 117, 8);
  $$payload.out.push(`Filter</button>`);
  pop_element();
  $$payload.out.push(`</form>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="bg-white rounded-lg shadow-sm overflow-hidden">`);
  push_element($$payload, "div", 127, 4);
  $$payload.out.push(`<div class="overflow-x-auto">`);
  push_element($$payload, "div", 128, 6);
  $$payload.out.push(`<table class="w-full">`);
  push_element($$payload, "table", 129, 8);
  $$payload.out.push(`<thead class="bg-gray-50 border-b border-gray-200">`);
  push_element($$payload, "thead", 130, 10);
  $$payload.out.push(`<tr>`);
  push_element($$payload, "tr", 131, 12);
  $$payload.out.push(`<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">`);
  push_element($$payload, "th", 132, 14);
  $$payload.out.push(`Name</th>`);
  pop_element();
  $$payload.out.push(`<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">`);
  push_element($$payload, "th", 135, 14);
  $$payload.out.push(`Contact</th>`);
  pop_element();
  $$payload.out.push(`<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">`);
  push_element($$payload, "th", 138, 14);
  $$payload.out.push(`Enquiry</th>`);
  pop_element();
  $$payload.out.push(`<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">`);
  push_element($$payload, "th", 141, 14);
  $$payload.out.push(`Status</th>`);
  pop_element();
  $$payload.out.push(`<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">`);
  push_element($$payload, "th", 144, 14);
  $$payload.out.push(`Date</th>`);
  pop_element();
  $$payload.out.push(`<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">`);
  push_element($$payload, "th", 147, 14);
  $$payload.out.push(`Actions</th>`);
  pop_element();
  $$payload.out.push(`</tr>`);
  pop_element();
  $$payload.out.push(`</thead>`);
  pop_element();
  $$payload.out.push(`<tbody class="bg-white divide-y divide-gray-200">`);
  push_element($$payload, "tbody", 152, 10);
  $$payload.out.push(`<!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let lead = each_array_1[$$index_1];
    $$payload.out.push(`<tr class="hover:bg-gray-50">`);
    push_element($$payload, "tr", 154, 14);
    $$payload.out.push(`<td class="px-6 py-4 whitespace-nowrap">`);
    push_element($$payload, "td", 155, 16);
    $$payload.out.push(`<div class="text-sm font-medium text-gray-900">`);
    push_element($$payload, "div", 156, 18);
    $$payload.out.push(`${escape_html(lead.name)}</div>`);
    pop_element();
    $$payload.out.push(`</td>`);
    pop_element();
    $$payload.out.push(`<td class="px-6 py-4 whitespace-nowrap">`);
    push_element($$payload, "td", 158, 16);
    $$payload.out.push(`<div class="text-sm text-gray-900">`);
    push_element($$payload, "div", 159, 18);
    $$payload.out.push(`${escape_html(lead.email)}</div>`);
    pop_element();
    $$payload.out.push(` <div class="text-sm text-gray-500">`);
    push_element($$payload, "div", 160, 18);
    $$payload.out.push(`${escape_html(lead.phone)}</div>`);
    pop_element();
    $$payload.out.push(`</td>`);
    pop_element();
    $$payload.out.push(`<td class="px-6 py-4">`);
    push_element($$payload, "td", 162, 16);
    $$payload.out.push(`<div class="text-sm text-gray-900 max-w-xs truncate">`);
    push_element($$payload, "div", 163, 18);
    $$payload.out.push(`${escape_html(lead.enquiry_details)}</div>`);
    pop_element();
    $$payload.out.push(`</td>`);
    pop_element();
    $$payload.out.push(`<td class="px-6 py-4 whitespace-nowrap">`);
    push_element($$payload, "td", 167, 16);
    $$payload.out.push(`<span${attr_class(`px-2 py-1 text-xs font-semibold rounded-full ${stringify(statusColors[lead.status] || "bg-gray-100 text-gray-800")}`)}>`);
    push_element($$payload, "span", 168, 18);
    $$payload.out.push(`${escape_html(lead.status)}</span>`);
    pop_element();
    $$payload.out.push(`</td>`);
    pop_element();
    $$payload.out.push(`<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">`);
    push_element($$payload, "td", 172, 16);
    $$payload.out.push(`${escape_html(formatDate(lead.created_at))}</td>`);
    pop_element();
    $$payload.out.push(`<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">`);
    push_element($$payload, "td", 175, 16);
    $$payload.out.push(`<button class="text-blue-600 hover:text-blue-900 mr-3">`);
    push_element($$payload, "button", 176, 18);
    $$payload.out.push(`View</button>`);
    pop_element();
    $$payload.out.push(` <button class="text-green-600 hover:text-green-900">`);
    push_element($$payload, "button", 182, 18);
    $$payload.out.push(`Note</button>`);
    pop_element();
    $$payload.out.push(`</td>`);
    pop_element();
    $$payload.out.push(`</tr>`);
    pop_element();
  }
  $$payload.out.push(`<!--]-->`);
  if (data.leads.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<tr>`);
    push_element($$payload, "tr", 192, 14);
    $$payload.out.push(`<td colspan="6" class="px-6 py-12 text-center text-gray-500">`);
    push_element($$payload, "td", 193, 16);
    $$payload.out.push(`No leads found</td>`);
    pop_element();
    $$payload.out.push(`</tr>`);
    pop_element();
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></tbody>`);
  pop_element();
  $$payload.out.push(`</table>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` `);
  if (data.pagination.totalPages > 1) {
    $$payload.out.push("<!--[-->");
    const each_array_2 = ensure_array_like(Array(data.pagination.totalPages));
    $$payload.out.push(`<div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">`);
    push_element($$payload, "div", 204, 8);
    $$payload.out.push(`<div class="flex-1 flex justify-between sm:hidden">`);
    push_element($$payload, "div", 205, 10);
    if (data.pagination.page > 1) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<a${attr("href", `?page=${stringify(data.pagination.page - 1)}&search=${stringify(data.filters.search)}&status=${stringify(data.filters.status)}`)} class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">`);
      push_element($$payload, "a", 207, 14);
      $$payload.out.push(`Previous</a>`);
      pop_element();
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (data.pagination.page < data.pagination.totalPages) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<a${attr("href", `?page=${stringify(data.pagination.page + 1)}&search=${stringify(data.filters.search)}&status=${stringify(data.filters.status)}`)} class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">`);
      push_element($$payload, "a", 215, 14);
      $$payload.out.push(`Next</a>`);
      pop_element();
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
    pop_element();
    $$payload.out.push(` <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">`);
    push_element($$payload, "div", 223, 10);
    $$payload.out.push(`<div>`);
    push_element($$payload, "div", 224, 12);
    $$payload.out.push(`<p class="text-sm text-gray-700">`);
    push_element($$payload, "p", 225, 14);
    $$payload.out.push(`Showing <span class="font-medium">`);
    push_element($$payload, "span", 227, 16);
    $$payload.out.push(`${escape_html((data.pagination.page - 1) * data.pagination.limit + 1)}</span>`);
    pop_element();
    $$payload.out.push(` to <span class="font-medium">`);
    push_element($$payload, "span", 229, 16);
    $$payload.out.push(`${escape_html(Math.min(data.pagination.page * data.pagination.limit, data.pagination.total))}</span>`);
    pop_element();
    $$payload.out.push(` of <span class="font-medium">`);
    push_element($$payload, "span", 231, 16);
    $$payload.out.push(`${escape_html(data.pagination.total)}</span>`);
    pop_element();
    $$payload.out.push(` results</p>`);
    pop_element();
    $$payload.out.push(`</div>`);
    pop_element();
    $$payload.out.push(` <div>`);
    push_element($$payload, "div", 235, 12);
    $$payload.out.push(`<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">`);
    push_element($$payload, "nav", 236, 14);
    if (data.pagination.page > 1) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<a${attr("href", `?page=${stringify(data.pagination.page - 1)}&search=${stringify(data.filters.search)}&status=${stringify(data.filters.status)}`)} class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">`);
      push_element($$payload, "a", 238, 18);
      $$payload.out.push(`Previous</a>`);
      pop_element();
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <!--[-->`);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      each_array_2[i];
      if (i + 1 === data.pagination.page) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<span class="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 text-sm font-medium text-blue-600">`);
        push_element($$payload, "span", 247, 20);
        $$payload.out.push(`${escape_html(i + 1)}</span>`);
        pop_element();
      } else {
        $$payload.out.push("<!--[!-->");
        if (Math.abs(i + 1 - data.pagination.page) < 3 || i === 0 || i === data.pagination.totalPages - 1) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<a${attr("href", `?page=${stringify(i + 1)}&search=${stringify(data.filters.search)}&status=${stringify(data.filters.status)}`)} class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">`);
          push_element($$payload, "a", 251, 20);
          $$payload.out.push(`${escape_html(i + 1)}</a>`);
          pop_element();
        } else {
          $$payload.out.push("<!--[!-->");
          if (Math.abs(i + 1 - data.pagination.page) === 3) {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`<span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">`);
            push_element($$payload, "span", 258, 20);
            $$payload.out.push(`...</span>`);
            pop_element();
          } else {
            $$payload.out.push("<!--[!-->");
          }
          $$payload.out.push(`<!--]-->`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--> `);
    if (data.pagination.page < data.pagination.totalPages) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<a${attr("href", `?page=${stringify(data.pagination.page + 1)}&search=${stringify(data.filters.search)}&status=${stringify(data.filters.status)}`)} class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">`);
      push_element($$payload, "a", 264, 18);
      $$payload.out.push(`Next</a>`);
      pop_element();
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></nav>`);
    pop_element();
    $$payload.out.push(`</div>`);
    pop_element();
    $$payload.out.push(`</div>`);
    pop_element();
    $$payload.out.push(`</div>`);
    pop_element();
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  pop_element();
  pop();
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
