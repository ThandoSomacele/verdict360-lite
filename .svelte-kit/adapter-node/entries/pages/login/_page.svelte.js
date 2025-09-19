import { D as push, a2 as copy_payload, a3 as assign_payload, G as pop, T as head, K as push_element, M as pop_element, F as prevent_snippet_stringification, I as FILENAME } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { B as Button } from "../../../chunks/button.js";
import { I as Input } from "../../../chunks/input.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../chunks/card-content.js";
_page[FILENAME] = "src/routes/login/+page.svelte";
function _page($$payload, $$props) {
  push(_page);
  let email = "";
  let password = "";
  let loading = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Login - Verdict 360</title>`;
      $$payload3.out.push(`<meta name="description" content="Login to your Verdict 360 account to access your legal AI assistant dashboard."/>`);
      push_element($$payload3, "meta", 53, 2);
      pop_element();
    });
    $$payload2.out.push(`<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-16">`);
    push_element($$payload2, "div", 56, 0);
    $$payload2.out.push(`<div class="w-full max-w-md">`);
    push_element($$payload2, "div", 57, 2);
    Card($$payload2, {
      children: prevent_snippet_stringification(($$payload3) => {
        Card_header($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            Card_title($$payload4, {
              class: "text-2xl text-center",
              children: prevent_snippet_stringification(($$payload5) => {
                $$payload5.out.push(`<!---->Welcome Back`);
              }),
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> <p class="text-center text-gray-600 mt-2">`);
            push_element($$payload4, "p", 61, 8);
            $$payload4.out.push(`Sign in to your Verdict 360 account</p>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        Card_content($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            $$payload4.out.push(`<form class="space-y-4">`);
            push_element($$payload4, "form", 64, 8);
            {
              $$payload4.out.push("<!--[!-->");
            }
            $$payload4.out.push(`<!--]--> <div>`);
            push_element($$payload4, "div", 71, 10);
            $$payload4.out.push(`<label for="email" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 72, 12);
            $$payload4.out.push(`Email Address</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "email",
              id: "email",
              placeholder: "you@lawfirm.com",
              required: true,
              class: "w-full",
              get value() {
                return email;
              },
              set value($$value) {
                email = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 85, 10);
            $$payload4.out.push(`<label for="password" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 86, 12);
            $$payload4.out.push(`Password</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "password",
              id: "password",
              placeholder: "Enter your password",
              required: true,
              class: "w-full",
              get value() {
                return password;
              },
              set value($$value) {
                password = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(` <div class="flex items-center justify-between">`);
            push_element($$payload4, "div", 99, 10);
            $$payload4.out.push(`<label class="flex items-center">`);
            push_element($$payload4, "label", 100, 12);
            $$payload4.out.push(`<input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>`);
            push_element($$payload4, "input", 101, 14);
            pop_element();
            $$payload4.out.push(` <span class="ml-2 text-sm text-gray-600">`);
            push_element($$payload4, "span", 102, 14);
            $$payload4.out.push(`Remember me</span>`);
            pop_element();
            $$payload4.out.push(`</label>`);
            pop_element();
            $$payload4.out.push(` <a href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-700">`);
            push_element($$payload4, "a", 104, 12);
            $$payload4.out.push(`Forgot password?</a>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` `);
            Button($$payload4, {
              type: "submit",
              variant: "default",
              class: "w-full",
              disabled: loading,
              children: prevent_snippet_stringification(($$payload5) => {
                {
                  $$payload5.out.push("<!--[!-->");
                  $$payload5.out.push(`Sign In`);
                }
                $$payload5.out.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----></form>`);
            pop_element();
            $$payload4.out.push(` <div class="mt-6">`);
            push_element($$payload4, "div", 127, 8);
            $$payload4.out.push(`<div class="relative">`);
            push_element($$payload4, "div", 128, 10);
            $$payload4.out.push(`<div class="absolute inset-0 flex items-center">`);
            push_element($$payload4, "div", 129, 12);
            $$payload4.out.push(`<div class="w-full border-t border-gray-300">`);
            push_element($$payload4, "div", 130, 14);
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div class="relative flex justify-center text-sm">`);
            push_element($$payload4, "div", 132, 12);
            $$payload4.out.push(`<span class="px-2 bg-white text-gray-500">`);
            push_element($$payload4, "span", 133, 14);
            $$payload4.out.push(`Or continue with</span>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div class="mt-6 grid grid-cols-2 gap-3">`);
            push_element($$payload4, "div", 137, 10);
            $$payload4.out.push(`<button class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">`);
            push_element($$payload4, "button", 138, 12);
            $$payload4.out.push(`<svg class="w-5 h-5" viewBox="0 0 24 24">`);
            push_element($$payload4, "svg", 139, 14);
            $$payload4.out.push(`<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z">`);
            push_element($$payload4, "path", 140, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z">`);
            push_element($$payload4, "path", 141, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z">`);
            push_element($$payload4, "path", 142, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z">`);
            push_element($$payload4, "path", 143, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` <span class="ml-2">`);
            push_element($$payload4, "span", 145, 14);
            $$payload4.out.push(`Google</span>`);
            pop_element();
            $$payload4.out.push(`</button>`);
            pop_element();
            $$payload4.out.push(` <button class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">`);
            push_element($$payload4, "button", 148, 12);
            $$payload4.out.push(`<svg class="w-5 h-5" viewBox="0 0 23 23">`);
            push_element($$payload4, "svg", 149, 14);
            $$payload4.out.push(`<path fill="#f25022" d="M1 1h10v10H1z">`);
            push_element($$payload4, "path", 150, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`<path fill="#00a4ef" d="M12 1h10v10H12z">`);
            push_element($$payload4, "path", 151, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`<path fill="#7fba00" d="M1 12h10v10H1z">`);
            push_element($$payload4, "path", 152, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`<path fill="#ffb900" d="M12 12h10v10H12z">`);
            push_element($$payload4, "path", 153, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` <span class="ml-2">`);
            push_element($$payload4, "span", 155, 14);
            $$payload4.out.push(`Microsoft</span>`);
            pop_element();
            $$payload4.out.push(`</button>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <p class="mt-6 text-center text-sm text-gray-600">`);
            push_element($$payload4, "p", 160, 8);
            $$payload4.out.push(`Don't have an account?  <a href="/signup" class="font-medium text-blue-600 hover:text-blue-700">`);
            push_element($$payload4, "a", 162, 10);
            $$payload4.out.push(`Sign up for free</a>`);
            pop_element();
            $$payload4.out.push(`</p>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!---->`);
      }),
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----> <div class="mt-4 p-4 bg-white bg-opacity-90 rounded-lg">`);
    push_element($$payload2, "div", 170, 4);
    $$payload2.out.push(`<p class="text-sm text-gray-600 text-center">`);
    push_element($$payload2, "p", 171, 6);
    $$payload2.out.push(`<strong>`);
    push_element($$payload2, "strong", 172, 8);
    $$payload2.out.push(`Demo Credentials:</strong>`);
    pop_element();
    $$payload2.out.push(`<br/>`);
    push_element($$payload2, "br", 172, 42);
    pop_element();
    $$payload2.out.push(` Admin: admin@verdict360.com / admin123<br/>`);
    push_element($$payload2, "br", 173, 46);
    pop_element();
    $$payload2.out.push(` User: user@demo.com / demo123</p>`);
    pop_element();
    $$payload2.out.push(`</div>`);
    pop_element();
    $$payload2.out.push(`</div>`);
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
