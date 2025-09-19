import { D as push, a2 as copy_payload, a3 as assign_payload, G as pop, T as head, K as push_element, M as pop_element, F as prevent_snippet_stringification, P as attr, a4 as maybe_selected, R as escape_html, I as FILENAME } from "../../../chunks/index.js";
import { B as Button } from "../../../chunks/button.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../chunks/card-content.js";
import { I as Input } from "../../../chunks/input.js";
_page[FILENAME] = "src/routes/contact/+page.svelte";
function _page($$payload, $$props) {
  push(_page);
  let formData = {
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: ""
  };
  let loading = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Contact Us - Verdict 360</title>`;
      $$payload3.out.push(`<meta name="description" content="Get in touch with Verdict 360. We're here to help transform your law practice with AI technology."/>`);
      push_element($$payload3, "meta", 57, 2);
      pop_element();
    });
    $$payload2.out.push(`<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">`);
    push_element($$payload2, "div", 63, 0);
    $$payload2.out.push(`<div class="container mx-auto px-4 py-16 max-w-7xl">`);
    push_element($$payload2, "div", 64, 2);
    $$payload2.out.push(`<div class="text-center mb-12">`);
    push_element($$payload2, "div", 66, 4);
    $$payload2.out.push(`<h1 class="text-4xl font-bold text-gray-900 mb-4">`);
    push_element($$payload2, "h1", 67, 6);
    $$payload2.out.push(`Get in Touch</h1>`);
    pop_element();
    $$payload2.out.push(` <p class="text-xl text-gray-600 max-w-3xl mx-auto">`);
    push_element($$payload2, "p", 68, 6);
    $$payload2.out.push(`Have questions about Verdict 360? We're here to help you transform your law practice with AI.</p>`);
    pop_element();
    $$payload2.out.push(`</div>`);
    pop_element();
    $$payload2.out.push(` <div class="grid lg:grid-cols-3 gap-8">`);
    push_element($$payload2, "div", 73, 4);
    $$payload2.out.push(`<div class="lg:col-span-1 space-y-6">`);
    push_element($$payload2, "div", 75, 6);
    Card($$payload2, {
      children: prevent_snippet_stringification(($$payload3) => {
        Card_header($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            Card_title($$payload4, {
              children: prevent_snippet_stringification(($$payload5) => {
                $$payload5.out.push(`<!---->Head Office`);
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        Card_content($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            $$payload4.out.push(`<div class="space-y-4">`);
            push_element($$payload4, "div", 82, 12);
            $$payload4.out.push(`<div class="flex items-start">`);
            push_element($$payload4, "div", 83, 14);
            $$payload4.out.push(`<svg class="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
            push_element($$payload4, "svg", 84, 16);
            $$payload4.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">`);
            push_element($$payload4, "path", 90, 18);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z">`);
            push_element($$payload4, "path", 96, 18);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 103, 16);
            $$payload4.out.push(`<p class="font-semibold">`);
            push_element($$payload4, "p", 104, 18);
            $$payload4.out.push(`Address</p>`);
            pop_element();
            $$payload4.out.push(` <p class="text-gray-600">`);
            push_element($$payload4, "p", 105, 18);
            $$payload4.out.push(`123 Legal Street<br/>`);
            push_element($$payload4, "br", 105, 59);
            pop_element();
            $$payload4.out.push(`Sandton, Johannesburg<br/>`);
            push_element($$payload4, "br", 105, 86);
            pop_element();
            $$payload4.out.push(`South Africa, 2196</p>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div class="flex items-start">`);
            push_element($$payload4, "div", 109, 14);
            $$payload4.out.push(`<svg class="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
            push_element($$payload4, "svg", 110, 16);
            $$payload4.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">`);
            push_element($$payload4, "path", 116, 18);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 123, 16);
            $$payload4.out.push(`<p class="font-semibold">`);
            push_element($$payload4, "p", 124, 18);
            $$payload4.out.push(`Phone</p>`);
            pop_element();
            $$payload4.out.push(` <p class="text-gray-600">`);
            push_element($$payload4, "p", 125, 18);
            $$payload4.out.push(`+27 11 234 5678</p>`);
            pop_element();
            $$payload4.out.push(` <p class="text-gray-600">`);
            push_element($$payload4, "p", 126, 18);
            $$payload4.out.push(`+27 87 550 1234</p>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div class="flex items-start">`);
            push_element($$payload4, "div", 130, 14);
            $$payload4.out.push(`<svg class="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
            push_element($$payload4, "svg", 131, 16);
            $$payload4.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">`);
            push_element($$payload4, "path", 137, 18);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 144, 16);
            $$payload4.out.push(`<p class="font-semibold">`);
            push_element($$payload4, "p", 145, 18);
            $$payload4.out.push(`Email</p>`);
            pop_element();
            $$payload4.out.push(` <p class="text-gray-600">`);
            push_element($$payload4, "p", 146, 18);
            $$payload4.out.push(`info@verdict360.com</p>`);
            pop_element();
            $$payload4.out.push(` <p class="text-gray-600">`);
            push_element($$payload4, "p", 147, 18);
            $$payload4.out.push(`support@verdict360.com</p>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
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
    $$payload2.out.push(`<!----> `);
    Card($$payload2, {
      children: prevent_snippet_stringification(($$payload3) => {
        Card_header($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            Card_title($$payload4, {
              children: prevent_snippet_stringification(($$payload5) => {
                $$payload5.out.push(`<!---->Business Hours`);
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        Card_content($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            $$payload4.out.push(`<div class="space-y-2">`);
            push_element($$payload4, "div", 160, 12);
            $$payload4.out.push(`<div class="flex justify-between">`);
            push_element($$payload4, "div", 161, 14);
            $$payload4.out.push(`<span class="text-gray-600">`);
            push_element($$payload4, "span", 162, 16);
            $$payload4.out.push(`Monday - Friday</span>`);
            pop_element();
            $$payload4.out.push(` <span class="font-semibold">`);
            push_element($$payload4, "span", 163, 16);
            $$payload4.out.push(`8:00 AM - 6:00 PM</span>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div class="flex justify-between">`);
            push_element($$payload4, "div", 165, 14);
            $$payload4.out.push(`<span class="text-gray-600">`);
            push_element($$payload4, "span", 166, 16);
            $$payload4.out.push(`Saturday</span>`);
            pop_element();
            $$payload4.out.push(` <span class="font-semibold">`);
            push_element($$payload4, "span", 167, 16);
            $$payload4.out.push(`9:00 AM - 1:00 PM</span>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div class="flex justify-between">`);
            push_element($$payload4, "div", 169, 14);
            $$payload4.out.push(`<span class="text-gray-600">`);
            push_element($$payload4, "span", 170, 16);
            $$payload4.out.push(`Sunday</span>`);
            pop_element();
            $$payload4.out.push(` <span class="font-semibold">`);
            push_element($$payload4, "span", 171, 16);
            $$payload4.out.push(`Closed</span>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <p class="text-sm text-gray-500 mt-4">`);
            push_element($$payload4, "p", 174, 12);
            $$payload4.out.push(`* AI Assistant available 24/7 for existing clients</p>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!---->`);
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
                $$payload5.out.push(`<!---->Quick Links`);
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        Card_content($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            $$payload4.out.push(`<div class="space-y-2">`);
            push_element($$payload4, "div", 184, 12);
            $$payload4.out.push(`<a href="/demo" class="flex items-center text-blue-600 hover:text-blue-700">`);
            push_element($$payload4, "a", 185, 14);
            $$payload4.out.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
            push_element($$payload4, "svg", 186, 16);
            $$payload4.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M9 5l7 7-7 7">`);
            push_element($$payload4, "path", 187, 18);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` Try Live Demo</a>`);
            pop_element();
            $$payload4.out.push(` <a href="/pricing" class="flex items-center text-blue-600 hover:text-blue-700">`);
            push_element($$payload4, "a", 191, 14);
            $$payload4.out.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
            push_element($$payload4, "svg", 192, 16);
            $$payload4.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M9 5l7 7-7 7">`);
            push_element($$payload4, "path", 193, 18);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` View Pricing</a>`);
            pop_element();
            $$payload4.out.push(` <a href="/about" class="flex items-center text-blue-600 hover:text-blue-700">`);
            push_element($$payload4, "a", 197, 14);
            $$payload4.out.push(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
            push_element($$payload4, "svg", 198, 16);
            $$payload4.out.push(`<path stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", 2)} d="M9 5l7 7-7 7">`);
            push_element($$payload4, "path", 199, 18);
            $$payload4.out.push(`</path>`);
            pop_element();
            $$payload4.out.push(`</svg>`);
            pop_element();
            $$payload4.out.push(` About Us</a>`);
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
    $$payload2.out.push(` <div class="lg:col-span-2">`);
    push_element($$payload2, "div", 209, 6);
    Card($$payload2, {
      children: prevent_snippet_stringification(($$payload3) => {
        Card_header($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            Card_title($$payload4, {
              children: prevent_snippet_stringification(($$payload5) => {
                $$payload5.out.push(`<!---->Send Us a Message`);
              }),
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> <p class="text-gray-600">`);
            push_element($$payload4, "p", 213, 12);
            $$payload4.out.push(`Fill out the form below and we'll get back to you within 24 hours.</p>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        Card_content($$payload3, {
          children: prevent_snippet_stringification(($$payload4) => {
            {
              $$payload4.out.push("<!--[!-->");
            }
            $$payload4.out.push(`<!--]--> `);
            {
              $$payload4.out.push("<!--[!-->");
            }
            $$payload4.out.push(`<!--]--> <form class="space-y-6">`);
            push_element($$payload4, "form", 229, 12);
            $$payload4.out.push(`<div class="grid md:grid-cols-2 gap-6">`);
            push_element($$payload4, "div", 230, 14);
            $$payload4.out.push(`<div>`);
            push_element($$payload4, "div", 231, 16);
            $$payload4.out.push(`<label for="name" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 232, 18);
            $$payload4.out.push(`Full Name *</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "text",
              id: "name",
              required: true,
              class: "w-full",
              placeholder: "Your full name",
              get value() {
                return formData.name;
              },
              set value($$value) {
                formData.name = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 243, 16);
            $$payload4.out.push(`<label for="email" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 244, 18);
            $$payload4.out.push(`Email Address *</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "email",
              id: "email",
              required: true,
              class: "w-full",
              placeholder: "john@lawfirm.com",
              get value() {
                return formData.email;
              },
              set value($$value) {
                formData.email = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div class="grid md:grid-cols-2 gap-6">`);
            push_element($$payload4, "div", 256, 14);
            $$payload4.out.push(`<div>`);
            push_element($$payload4, "div", 257, 16);
            $$payload4.out.push(`<label for="company" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 258, 18);
            $$payload4.out.push(`Law Firm / Company</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "text",
              id: "company",
              class: "w-full",
              placeholder: "Smith & Associates",
              get value() {
                return formData.company;
              },
              set value($$value) {
                formData.company = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 268, 16);
            $$payload4.out.push(`<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 269, 18);
            $$payload4.out.push(`Phone Number</label>`);
            pop_element();
            $$payload4.out.push(` `);
            Input($$payload4, {
              type: "tel",
              id: "phone",
              class: "w-full",
              placeholder: "+27 11 234 5678",
              get value() {
                return formData.phone;
              },
              set value($$value) {
                formData.phone = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 280, 14);
            $$payload4.out.push(`<label for="subject" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 281, 16);
            $$payload4.out.push(`Subject *</label>`);
            pop_element();
            $$payload4.out.push(` <select id="subject" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">`);
            push_element($$payload4, "select", 282, 16);
            $$payload4.select_value = formData.subject;
            $$payload4.out.push(`<option value=""${maybe_selected($$payload4, "")}>`);
            push_element($$payload4, "option", 288, 18);
            $$payload4.out.push(`Select a subject</option>`);
            pop_element();
            $$payload4.out.push(`<option value="demo"${maybe_selected($$payload4, "demo")}>`);
            push_element($$payload4, "option", 289, 18);
            $$payload4.out.push(`Request a Demo</option>`);
            pop_element();
            $$payload4.out.push(`<option value="pricing"${maybe_selected($$payload4, "pricing")}>`);
            push_element($$payload4, "option", 290, 18);
            $$payload4.out.push(`Pricing Inquiry</option>`);
            pop_element();
            $$payload4.out.push(`<option value="support"${maybe_selected($$payload4, "support")}>`);
            push_element($$payload4, "option", 291, 18);
            $$payload4.out.push(`Technical Support</option>`);
            pop_element();
            $$payload4.out.push(`<option value="partnership"${maybe_selected($$payload4, "partnership")}>`);
            push_element($$payload4, "option", 292, 18);
            $$payload4.out.push(`Partnership Opportunity</option>`);
            pop_element();
            $$payload4.out.push(`<option value="other"${maybe_selected($$payload4, "other")}>`);
            push_element($$payload4, "option", 293, 18);
            $$payload4.out.push(`Other</option>`);
            pop_element();
            $$payload4.select_value = void 0;
            $$payload4.out.push(`</select>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` <div>`);
            push_element($$payload4, "div", 297, 14);
            $$payload4.out.push(`<label for="message" class="block text-sm font-medium text-gray-700 mb-1">`);
            push_element($$payload4, "label", 298, 16);
            $$payload4.out.push(`Message *</label>`);
            pop_element();
            $$payload4.out.push(` <textarea id="message" required rows="6" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tell us how we can help you...">`);
            push_element($$payload4, "textarea", 299, 16);
            const $$body = escape_html(formData.message);
            if ($$body) {
              $$payload4.out.push(`${$$body}`);
            }
            $$payload4.out.push(`</textarea>`);
            pop_element();
            $$payload4.out.push(`</div>`);
            pop_element();
            $$payload4.out.push(` `);
            Button($$payload4, {
              type: "submit",
              variant: "default",
              class: "w-full md:w-auto",
              disabled: loading,
              children: prevent_snippet_stringification(($$payload5) => {
                {
                  $$payload5.out.push("<!--[!-->");
                  $$payload5.out.push(`Send Message`);
                }
                $$payload5.out.push(`<!--]-->`);
              }),
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----></form>`);
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
