import { D as push, a2 as copy_payload, a3 as assign_payload, G as pop, T as head, K as push_element, M as pop_element, F as prevent_snippet_stringification, I as FILENAME } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { B as Button } from "../../../chunks/button.js";
import { I as Input } from "../../../chunks/input.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../chunks/card-content.js";
_page[FILENAME] = "src/routes/signup/+page.svelte";
function _page($$payload, $$props) {
  push(_page);
  let firmName = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let phone = "";
  let loading = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Sign Up - Verdict 360</title>`;
      $$payload3.out.push(`<meta name="description" content="Create your Verdict 360 account and start transforming your law firm with AI-powered legal assistance."/>`);
      push_element($$payload3, "meta", 52, 2);
      pop_element();
    });
    $$payload2.out.push(`<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-16">`);
    push_element($$payload2, "div", 55, 0);
    $$payload2.out.push(`<div class="w-full max-w-md">`);
    push_element($$payload2, "div", 56, 2);
    Card($$payload2, {
      children: prevent_snippet_stringification(($$payload3) => {
        Card_header($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            Card_title($$payload4, {
              class: "text-2xl text-center",
              children: prevent_snippet_stringification(($$payload5) => {
                $$payload5.out.push(`<!---->Create Your Account`);
              }),
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> <p class="text-center text-gray-600 mt-2">`);
            push_element($$payload4, "p", 60, 8);
            $$payload4.out.push(`Start your 14-day free trial</p>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        Card_content($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            $$payload4.out.push(`<form class="space-y-4">`);
            push_element($$payload4, "form", 63, 8);
            {
              $$payload4.out.push("<!--[!-->");
            }
            $$payload4.out.push(`<!--]--> <div>`);
            push_element($$payload4, "div", 70, 10);
            $$payload4.out.push(`<label for="firmName" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 71, 12);
            $$payload4.out.push(`Law Firm Name</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "text",
              id: "firmName",
              placeholder: "Smith & Associates",
              required: true,
              class: "w-full",
              get value() {
                return firmName;
              },
              set value($$value) {
                firmName = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 84, 10);
            $$payload4.out.push(`<label for="email" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 85, 12);
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
            push_element($$payload4, "div", 98, 10);
            $$payload4.out.push(`<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 99, 12);
            $$payload4.out.push(`Phone Number</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "tel",
              id: "phone",
              placeholder: "+27 11 234 5678",
              required: true,
              class: "w-full",
              get value() {
                return phone;
              },
              set value($$value) {
                phone = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 112, 10);
            $$payload4.out.push(`<label for="password" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 113, 12);
            $$payload4.out.push(`Password</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "password",
              id: "password",
              placeholder: "Create a strong password",
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
            $$payload4.out.push(`<!----> <p class="text-xs text-gray-500 mt-1">`);
            push_element($$payload4, "p", 124, 12);
            $$payload4.out.push(`At least 8 characters with numbers and symbols</p>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 127, 10);
            $$payload4.out.push(`<label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 128, 12);
            $$payload4.out.push(`Confirm Password</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "password",
              id: "confirmPassword",
              placeholder: "Confirm your password",
              required: true,
              class: "w-full",
              get value() {
                return confirmPassword;
              },
              set value($$value) {
                confirmPassword = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(` <div class="flex items-start">`);
            push_element($$payload4, "div", 141, 10);
            $$payload4.out.push(`<input type="checkbox" required class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"/>`);
            push_element($$payload4, "input", 142, 12);
            pop_element();
            $$payload4.out.push(` <label class="ml-2 text-sm text-gray-600">`);
            push_element($$payload4, "label", 147, 12);
            $$payload4.out.push(`I agree to the <a href="/terms" class="text-blue-600 hover:text-blue-700">`);
            push_element($$payload4, "a", 148, 29);
            $$payload4.out.push(`Terms of Service</a>`);
            pop_element();
            $$payload4.out.push(` and <a href="/privacy" class="text-blue-600 hover:text-blue-700">`);
            push_element($$payload4, "a", 149, 14);
            $$payload4.out.push(`Privacy Policy</a>`);
            pop_element();
            $$payload4.out.push(`</label>`);
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
                  $$payload5.out.push(`Start Free Trial`);
                }
                $$payload5.out.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----></form>`);
            pop_element();
            $$payload4.out.push(` <div class="mt-6 text-center">`);
            push_element($$payload4, "div", 171, 8);
            $$payload4.out.push(`<p class="text-sm text-gray-600">`);
            push_element($$payload4, "p", 172, 10);
            $$payload4.out.push(`Already have an account?  <a href="/login" class="font-medium text-blue-600 hover:text-blue-700">`);
            push_element($$payload4, "a", 174, 12);
            $$payload4.out.push(`Sign in</a>`);
            pop_element();
            $$payload4.out.push(`</p>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div class="mt-6 pt-6 border-t">`);
            push_element($$payload4, "div", 181, 8);
            $$payload4.out.push(`<h3 class="text-sm font-semibold text-gray-700 mb-3">`);
            push_element($$payload4, "h3", 182, 10);
            $$payload4.out.push(`What's included:</h3>`);
            pop_element();
            $$payload4.out.push(` <ul class="space-y-2 text-sm text-gray-600">`);
            push_element($$payload4, "ul", 183, 10);
            $$payload4.out.push(`<li class="flex items-start">`);
            push_element($$payload4, "li", 184, 12);
            $$payload4.out.push(`<svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">`);
            push_element($$payload4, "svg", 185, 14);
            $$payload4.out.push(`<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd">`);
            push_element($$payload4, "path", 186, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` 14-day free trial, no credit card required</li>`);
            pop_element();
            $$payload4.out.push(` <li class="flex items-start">`);
            push_element($$payload4, "li", 190, 12);
            $$payload4.out.push(`<svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">`);
            push_element($$payload4, "svg", 191, 14);
            $$payload4.out.push(`<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd">`);
            push_element($$payload4, "path", 192, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` Full access to AI legal assistant</li>`);
            pop_element();
            $$payload4.out.push(` <li class="flex items-start">`);
            push_element($$payload4, "li", 196, 12);
            $$payload4.out.push(`<svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">`);
            push_element($$payload4, "svg", 197, 14);
            $$payload4.out.push(`<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd">`);
            push_element($$payload4, "path", 198, 16);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` Dedicated support &amp; onboarding</li>`);
            pop_element();
            $$payload4.out.push(`</ul>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!---->`);
      }),
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----></div>`);
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
