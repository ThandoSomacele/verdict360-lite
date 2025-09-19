import { D as push, T as head, K as push_element, M as pop_element, R as escape_html, F as prevent_snippet_stringification, G as pop, I as FILENAME, P as attr } from "../../../chunks/index.js";
import "../../../chunks/card-content.js";
import { B as Badge } from "../../../chunks/badge.js";
import { B as Button } from "../../../chunks/button.js";
_page[FILENAME] = "src/routes/dashboard/+page.svelte";
function _page($$payload, $$props) {
  push(_page);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Dashboard - Verdict 360</title>`;
    $$payload2.out.push(`<meta name="description" content="Manage your Verdict 360 AI legal assistant and view analytics."/>`);
    push_element($$payload2, "meta", 65, 2);
    pop_element();
  });
  $$payload.out.push(`<div class="min-h-screen bg-gray-50">`);
  push_element($$payload, "div", 68, 0);
  $$payload.out.push(`<header class="bg-white shadow-sm border-b">`);
  push_element($$payload, "header", 70, 2);
  $$payload.out.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
  push_element($$payload, "div", 71, 4);
  $$payload.out.push(`<div class="flex justify-between items-center py-4">`);
  push_element($$payload, "div", 72, 6);
  $$payload.out.push(`<div>`);
  push_element($$payload, "div", 73, 8);
  $$payload.out.push(`<h1 class="text-2xl font-bold text-gray-900">`);
  push_element($$payload, "h1", 74, 10);
  $$payload.out.push(`Dashboard</h1>`);
  pop_element();
  $$payload.out.push(` <p class="text-sm text-gray-600">`);
  push_element($$payload, "p", 75, 10);
  $$payload.out.push(`Welcome back, ${escape_html("User")}</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="flex items-center space-x-4">`);
  push_element($$payload, "div", 77, 8);
  Badge($$payload, {
    variant: "success",
    children: prevent_snippet_stringification(($$payload2) => {
      $$payload2.out.push(`<!---->${escape_html("Demo Firm")}`);
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "outline",
    onclick: () => window.location.href = "/settings",
    children: prevent_snippet_stringification(($$payload2) => {
      $$payload2.out.push(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
      push_element($$payload2, "svg", 80, 12);
      $$payload2.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">`);
      push_element($$payload2, "path", 81, 14);
      $$payload2.out.push(`</path>`);
      pop_element();
      $$payload2.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">`);
      push_element($$payload2, "path", 82, 14);
      $$payload2.out.push(`</path>`);
      pop_element();
      $$payload2.out.push(`</svg>`);
      pop_element();
      $$payload2.out.push(` Settings`);
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</header>`);
  pop_element();
  $$payload.out.push(` <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
  push_element($$payload, "main", 91, 2);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex justify-center items-center h-64">`);
    push_element($$payload, "div", 93, 6);
    $$payload.out.push(`<svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">`);
    push_element($$payload, "svg", 94, 8);
    $$payload.out.push(`<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">`);
    push_element($$payload, "circle", 95, 10);
    $$payload.out.push(`</circle>`);
    pop_element();
    $$payload.out.push(`<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">`);
    push_element($$payload, "path", 96, 10);
    $$payload.out.push(`</path>`);
    pop_element();
    $$payload.out.push(`</svg>`);
    pop_element();
    $$payload.out.push(`</div>`);
    pop_element();
  }
  $$payload.out.push(`<!--]--></main>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  pop();
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
