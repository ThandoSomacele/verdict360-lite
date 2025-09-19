import { J as getContext, D as push, K as push_element, M as pop_element, N as attr_class, O as store_get, P as attr, Q as unsubscribe_stores, G as pop, I as FILENAME, R as escape_html, S as slot } from "../../chunks/index.js";
import "../../chunks/client.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
Header[FILENAME] = "src/lib/components/Header.svelte";
function Header($$payload, $$props) {
  push(Header);
  var $$store_subs;
  $$payload.out.push(`<header class="bg-white shadow-sm border-b sticky top-0 z-40">`);
  push_element($$payload, "header", 11, 0);
  $$payload.out.push(`<nav class="container mx-auto px-4 max-w-7xl">`);
  push_element($$payload, "nav", 12, 2);
  $$payload.out.push(`<div class="flex justify-between items-center h-16">`);
  push_element($$payload, "div", 13, 4);
  $$payload.out.push(`<a href="/" class="flex items-center space-x-2">`);
  push_element($$payload, "a", 15, 6);
  $$payload.out.push(`<span class="text-2xl font-bold text-blue-600">`);
  push_element($$payload, "span", 16, 8);
  $$payload.out.push(`Verdict 360</span>`);
  pop_element();
  $$payload.out.push(`</a>`);
  pop_element();
  $$payload.out.push(` <div class="hidden md:flex items-center space-x-8">`);
  push_element($$payload, "div", 20, 6);
  $$payload.out.push(`<a href="/"${attr_class("text-gray-700 hover:text-blue-600 transition-colors", void 0, {
    "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/"
  })}>`);
  push_element($$payload, "a", 21, 8);
  $$payload.out.push(`Home</a>`);
  pop_element();
  $$payload.out.push(` <a href="/demo"${attr_class("text-gray-700 hover:text-blue-600 transition-colors", void 0, {
    "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/demo"
  })}>`);
  push_element($$payload, "a", 24, 8);
  $$payload.out.push(`Demo</a>`);
  pop_element();
  $$payload.out.push(` <a href="/pricing"${attr_class("text-gray-700 hover:text-blue-600 transition-colors", void 0, {
    "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/pricing"
  })}>`);
  push_element($$payload, "a", 27, 8);
  $$payload.out.push(`Pricing</a>`);
  pop_element();
  $$payload.out.push(` <a href="/about"${attr_class("text-gray-700 hover:text-blue-600 transition-colors", void 0, {
    "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/about"
  })}>`);
  push_element($$payload, "a", 30, 8);
  $$payload.out.push(`About</a>`);
  pop_element();
  $$payload.out.push(` <a href="/contact"${attr_class("text-gray-700 hover:text-blue-600 transition-colors", void 0, {
    "text-blue-600": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/contact"
  })}>`);
  push_element($$payload, "a", 33, 8);
  $$payload.out.push(`Contact</a>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="hidden md:flex items-center space-x-4">`);
  push_element($$payload, "div", 39, 6);
  $$payload.out.push(`<a href="/login" class="text-gray-700 hover:text-blue-600 transition-colors">`);
  push_element($$payload, "a", 40, 8);
  $$payload.out.push(`Login</a>`);
  pop_element();
  $$payload.out.push(` <a href="/signup" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">`);
  push_element($$payload, "a", 43, 8);
  $$payload.out.push(`Get Started</a>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <button class="md:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle mobile menu">`);
  push_element($$payload, "button", 49, 6);
  $$payload.out.push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
  push_element($$payload, "svg", 54, 8);
  {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M4 6h16M4 12h16M4 18h16">`);
    push_element($$payload, "path", 58, 12);
    $$payload.out.push(`</path>`);
    pop_element();
  }
  $$payload.out.push(`<!--]--></svg>`);
  pop_element();
  $$payload.out.push(`</button>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></nav>`);
  pop_element();
  $$payload.out.push(`</header>`);
  pop_element();
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
Header.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Footer[FILENAME] = "src/lib/components/Footer.svelte";
function Footer($$payload, $$props) {
  push(Footer);
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  $$payload.out.push(`<footer class="bg-gray-900 text-gray-300">`);
  push_element($$payload, "footer", 5, 0);
  $$payload.out.push(`<div class="container mx-auto px-4 max-w-7xl py-12">`);
  push_element($$payload, "div", 6, 2);
  $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-8">`);
  push_element($$payload, "div", 7, 4);
  $$payload.out.push(`<div class="space-y-4">`);
  push_element($$payload, "div", 9, 6);
  $$payload.out.push(`<h3 class="text-xl font-bold text-white">`);
  push_element($$payload, "h3", 10, 8);
  $$payload.out.push(`Verdict 360</h3>`);
  pop_element();
  $$payload.out.push(` <p class="text-sm">`);
  push_element($$payload, "p", 11, 8);
  $$payload.out.push(`AI-powered legal assistance for South African law firms. Streamline consultations and enhance client service.</p>`);
  pop_element();
  $$payload.out.push(` <div class="flex space-x-4">`);
  push_element($$payload, "div", 14, 8);
  $$payload.out.push(`<a href="#" aria-label="LinkedIn" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 16, 10);
  $$payload.out.push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">`);
  push_element($$payload, "svg", 17, 12);
  $$payload.out.push(`<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z">`);
  push_element($$payload, "path", 18, 14);
  $$payload.out.push(`</path>`);
  pop_element();
  $$payload.out.push(`</svg>`);
  pop_element();
  $$payload.out.push(`</a>`);
  pop_element();
  $$payload.out.push(` <a href="#" aria-label="Twitter" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 21, 10);
  $$payload.out.push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">`);
  push_element($$payload, "svg", 22, 12);
  $$payload.out.push(`<path d="M22.46 6c-.85.38-1.75.64-2.7.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.54-2.11-9.91-5.02-.41.71-.65 1.53-.65 2.41 0 1.67.85 3.14 2.14 4.01-.79-.03-1.54-.24-2.19-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.63 1.91 2.39 3.3 4.49 3.34-1.65 1.29-3.72 2.06-5.97 2.06-.39 0-.77-.02-1.15-.07 2.13 1.36 4.65 2.16 7.37 2.16 8.84 0 13.68-7.33 13.68-13.68 0-.21 0-.42-.01-.62.94-.68 1.76-1.53 2.4-2.5l.02-.02z">`);
  push_element($$payload, "path", 23, 14);
  $$payload.out.push(`</path>`);
  pop_element();
  $$payload.out.push(`</svg>`);
  pop_element();
  $$payload.out.push(`</a>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div>`);
  push_element($$payload, "div", 30, 6);
  $$payload.out.push(`<h4 class="text-white font-semibold mb-4">`);
  push_element($$payload, "h4", 31, 8);
  $$payload.out.push(`Quick Links</h4>`);
  pop_element();
  $$payload.out.push(` <ul class="space-y-2 text-sm">`);
  push_element($$payload, "ul", 32, 8);
  $$payload.out.push(`<li>`);
  push_element($$payload, "li", 33, 10);
  $$payload.out.push(`<a href="/" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 33, 14);
  $$payload.out.push(`Home</a>`);
  pop_element();
  $$payload.out.push(`</li>`);
  pop_element();
  $$payload.out.push(` <li>`);
  push_element($$payload, "li", 34, 10);
  $$payload.out.push(`<a href="/demo" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 34, 14);
  $$payload.out.push(`Demo</a>`);
  pop_element();
  $$payload.out.push(`</li>`);
  pop_element();
  $$payload.out.push(` <li>`);
  push_element($$payload, "li", 35, 10);
  $$payload.out.push(`<a href="/pricing" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 35, 14);
  $$payload.out.push(`Pricing</a>`);
  pop_element();
  $$payload.out.push(`</li>`);
  pop_element();
  $$payload.out.push(` <li>`);
  push_element($$payload, "li", 36, 10);
  $$payload.out.push(`<a href="/about" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 36, 14);
  $$payload.out.push(`About Us</a>`);
  pop_element();
  $$payload.out.push(`</li>`);
  pop_element();
  $$payload.out.push(`</ul>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div>`);
  push_element($$payload, "div", 41, 6);
  $$payload.out.push(`<h4 class="text-white font-semibold mb-4">`);
  push_element($$payload, "h4", 42, 8);
  $$payload.out.push(`Legal</h4>`);
  pop_element();
  $$payload.out.push(` <ul class="space-y-2 text-sm">`);
  push_element($$payload, "ul", 43, 8);
  $$payload.out.push(`<li>`);
  push_element($$payload, "li", 44, 10);
  $$payload.out.push(`<a href="/privacy" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 44, 14);
  $$payload.out.push(`Privacy Policy</a>`);
  pop_element();
  $$payload.out.push(`</li>`);
  pop_element();
  $$payload.out.push(` <li>`);
  push_element($$payload, "li", 45, 10);
  $$payload.out.push(`<a href="/terms" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 45, 14);
  $$payload.out.push(`Terms of Service</a>`);
  pop_element();
  $$payload.out.push(`</li>`);
  pop_element();
  $$payload.out.push(` <li>`);
  push_element($$payload, "li", 46, 10);
  $$payload.out.push(`<a href="/cookies" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 46, 14);
  $$payload.out.push(`Cookie Policy</a>`);
  pop_element();
  $$payload.out.push(`</li>`);
  pop_element();
  $$payload.out.push(` <li>`);
  push_element($$payload, "li", 47, 10);
  $$payload.out.push(`<a href="/compliance" class="hover:text-white transition-colors">`);
  push_element($$payload, "a", 47, 14);
  $$payload.out.push(`POPIA Compliance</a>`);
  pop_element();
  $$payload.out.push(`</li>`);
  pop_element();
  $$payload.out.push(`</ul>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div>`);
  push_element($$payload, "div", 52, 6);
  $$payload.out.push(`<h4 class="text-white font-semibold mb-4">`);
  push_element($$payload, "h4", 53, 8);
  $$payload.out.push(`Contact</h4>`);
  pop_element();
  $$payload.out.push(` <ul class="space-y-2 text-sm">`);
  push_element($$payload, "ul", 54, 8);
  $$payload.out.push(`<li class="flex items-start">`);
  push_element($$payload, "li", 55, 10);
  $$payload.out.push(`<svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
  push_element($$payload, "svg", 56, 12);
  $$payload.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">`);
  push_element($$payload, "path", 57, 14);
  $$payload.out.push(`</path>`);
  pop_element();
  $$payload.out.push(`</svg>`);
  pop_element();
  $$payload.out.push(` info@verdict360.com</li>`);
  pop_element();
  $$payload.out.push(` <li class="flex items-start">`);
  push_element($$payload, "li", 61, 10);
  $$payload.out.push(`<svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
  push_element($$payload, "svg", 62, 12);
  $$payload.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">`);
  push_element($$payload, "path", 63, 14);
  $$payload.out.push(`</path>`);
  pop_element();
  $$payload.out.push(`</svg>`);
  pop_element();
  $$payload.out.push(` +27 11 234 5678</li>`);
  pop_element();
  $$payload.out.push(` <li class="flex items-start">`);
  push_element($$payload, "li", 67, 10);
  $$payload.out.push(`<svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
  push_element($$payload, "svg", 68, 12);
  $$payload.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">`);
  push_element($$payload, "path", 69, 14);
  $$payload.out.push(`</path>`);
  pop_element();
  $$payload.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z">`);
  push_element($$payload, "path", 70, 14);
  $$payload.out.push(`</path>`);
  pop_element();
  $$payload.out.push(`</svg>`);
  pop_element();
  $$payload.out.push(` Johannesburg, South Africa</li>`);
  pop_element();
  $$payload.out.push(`</ul>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">`);
  push_element($$payload, "div", 79, 4);
  $$payload.out.push(`<p>`);
  push_element($$payload, "p", 80, 6);
  $$payload.out.push(`© ${escape_html(currentYear)} Verdict 360. All rights reserved.</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</footer>`);
  pop_element();
  pop();
}
Footer.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_layout[FILENAME] = "src/routes/+layout.svelte";
function _layout($$payload, $$props) {
  push(_layout);
  var $$store_subs;
  let showLayout = !store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/admin");
  if (showLayout) {
    $$payload.out.push("<!--[-->");
    Header($$payload);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <main class="flex-1">`);
  push_element($$payload, "main", 15, 0);
  $$payload.out.push(`<!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!----></main>`);
  pop_element();
  $$payload.out.push(` `);
  if (showLayout) {
    $$payload.out.push("<!--[-->");
    Footer($$payload);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _layout as default
};
