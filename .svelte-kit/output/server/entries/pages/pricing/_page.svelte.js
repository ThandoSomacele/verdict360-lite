import { D as push, U as ensure_array_like, T as head, K as push_element, M as pop_element, F as prevent_snippet_stringification, a5 as stringify, G as pop, I as FILENAME, R as escape_html, P as attr } from "../../../chunks/index.js";
import { B as Button } from "../../../chunks/button.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../chunks/card-content.js";
import { B as Badge } from "../../../chunks/badge.js";
_page[FILENAME] = "src/routes/pricing/+page.svelte";
function _page($$payload, $$props) {
  push(_page);
  const plans = [
    {
      name: "Starter",
      price: "R2,999",
      period: "per month",
      description: "Perfect for solo practitioners and small firms",
      features: [
        "Up to 100 conversations/month",
        "1 AI assistant",
        "Basic customization",
        "Email support",
        "Standard response time",
        "Basic analytics"
      ],
      cta: "Start Free Trial",
      href: "/signup",
      popular: false
    },
    {
      name: "Professional",
      price: "R7,999",
      period: "per month",
      description: "Ideal for growing law firms",
      features: [
        "Up to 500 conversations/month",
        "3 AI assistants",
        "Advanced customization",
        "Priority email & phone support",
        "Fast response time",
        "Advanced analytics",
        "Calendar integration",
        "Custom branding"
      ],
      cta: "Start Free Trial",
      href: "/signup",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large firms with specific needs",
      features: [
        "Unlimited conversations",
        "Unlimited AI assistants",
        "Full customization",
        "Dedicated account manager",
        "Instant response time",
        "Custom analytics & reporting",
        "API access",
        "White-label solution",
        "On-premise deployment option",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false
    }
  ];
  const each_array = ensure_array_like(plans);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Pricing - Verdict 360</title>`;
    $$payload2.out.push(`<meta name="description" content="Choose the perfect plan for your law firm. Start with a 14-day free trial. No credit card required."/>`);
    push_element($$payload2, "meta", 72, 2);
    pop_element();
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">`);
  push_element($$payload, "div", 75, 0);
  $$payload.out.push(`<div class="container mx-auto px-4 py-16 max-w-7xl">`);
  push_element($$payload, "div", 76, 2);
  $$payload.out.push(`<div class="text-center mb-12">`);
  push_element($$payload, "div", 78, 4);
  $$payload.out.push(`<h1 class="text-4xl font-bold text-gray-900 mb-4">`);
  push_element($$payload, "h1", 79, 6);
  $$payload.out.push(`Simple, Transparent Pricing</h1>`);
  pop_element();
  $$payload.out.push(` <p class="text-xl text-gray-600 max-w-3xl mx-auto">`);
  push_element($$payload, "p", 82, 6);
  $$payload.out.push(`Choose the plan that fits your law firm's needs. All plans include a 14-day free trial.</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="grid md:grid-cols-3 gap-8 mb-16">`);
  push_element($$payload, "div", 88, 4);
  $$payload.out.push(`<!--[-->`);
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let plan = each_array[$$index_1];
    Card($$payload, {
      class: `relative ${stringify(plan.popular ? "ring-2 ring-blue-600 transform scale-105" : "")}`,
      children: prevent_snippet_stringification(($$payload2) => {
        if (plan.popular) {
          $$payload2.out.push("<!--[-->");
          $$payload2.out.push(`<div class="absolute -top-4 left-1/2 transform -translate-x-1/2">`);
          push_element($$payload2, "div", 92, 12);
          Badge($$payload2, {
            variant: "default",
            class: "px-3 py-1",
            children: prevent_snippet_stringification(($$payload3) => {
              $$payload3.out.push(`<!---->Most Popular`);
            }),
            $$slots: { default: true }
          });
          $$payload2.out.push(`<!----></div>`);
          pop_element();
        } else {
          $$payload2.out.push("<!--[!-->");
        }
        $$payload2.out.push(`<!--]--> `);
        Card_header($$payload2, {
          children: prevent_snippet_stringification(($$payload3) => {
            Card_title($$payload3, {
              class: "text-2xl",
              children: prevent_snippet_stringification(($$payload4) => {
                $$payload4.out.push(`<!---->${escape_html(plan.name)}`);
              }),
              $$slots: { default: true }
            });
            $$payload3.out.push(`<!----> <div class="mt-4">`);
            push_element($$payload3, "div", 99, 12);
            $$payload3.out.push(`<span class="text-4xl font-bold">`);
            push_element($$payload3, "span", 100, 14);
            $$payload3.out.push(`${escape_html(plan.price)}</span>`);
            pop_element();
            $$payload3.out.push(` <span class="text-gray-600 ml-2">`);
            push_element($$payload3, "span", 101, 14);
            $$payload3.out.push(`${escape_html(plan.period)}</span>`);
            pop_element();
            $$payload3.out.push(`</div>`);
            pop_element();
            $$payload3.out.push(` <p class="text-gray-600 mt-2">`);
            push_element($$payload3, "p", 103, 12);
            $$payload3.out.push(`${escape_html(plan.description)}</p>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$payload2.out.push(`<!----> `);
        Card_content($$payload2, {
          children: prevent_snippet_stringification(($$payload3) => {
            const each_array_1 = ensure_array_like(plan.features);
            $$payload3.out.push(`<ul class="space-y-3 mb-8">`);
            push_element($$payload3, "ul", 107, 12);
            $$payload3.out.push(`<!--[-->`);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let feature = each_array_1[$$index];
              $$payload3.out.push(`<li class="flex items-start">`);
              push_element($$payload3, "li", 109, 16);
              $$payload3.out.push(`<svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">`);
              push_element($$payload3, "svg", 110, 18);
              $$payload3.out.push(`<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd">`);
              push_element($$payload3, "path", 111, 20);
              $$payload3.out.push(`</path>`);
              pop_element();
              $$payload3.out.push(`</svg>`);
              pop_element();
              $$payload3.out.push(` <span class="text-gray-700">`);
              push_element($$payload3, "span", 113, 18);
              $$payload3.out.push(`${escape_html(feature)}</span>`);
              pop_element();
              $$payload3.out.push(`</li>`);
              pop_element();
            }
            $$payload3.out.push(`<!--]--></ul>`);
            pop_element();
            $$payload3.out.push(` <a${attr("href", plan.href)} class="block">`);
            push_element($$payload3, "a", 118, 12);
            Button($$payload3, {
              variant: plan.popular ? "default" : "outline",
              class: "w-full",
              children: prevent_snippet_stringification(($$payload4) => {
                $$payload4.out.push(`<!---->${escape_html(plan.cta)}`);
              }),
              $$slots: { default: true }
            });
            $$payload3.out.push(`<!----></a>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
        $$payload2.out.push(`<!---->`);
      }),
      $$slots: { default: true }
    });
  }
  $$payload.out.push(`<!--]--></div>`);
  pop_element();
  $$payload.out.push(` <div class="max-w-3xl mx-auto">`);
  push_element($$payload, "div", 132, 4);
  $$payload.out.push(`<h2 class="text-3xl font-bold text-center mb-8">`);
  push_element($$payload, "h2", 133, 6);
  $$payload.out.push(`Frequently Asked Questions</h2>`);
  pop_element();
  $$payload.out.push(` <div class="space-y-6">`);
  push_element($$payload, "div", 135, 6);
  Card($$payload, {
    children: prevent_snippet_stringification(($$payload2) => {
      Card_header($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          Card_title($$payload3, {
            class: "text-lg",
            children: prevent_snippet_stringification(($$payload4) => {
              $$payload4.out.push(`<!---->Do I need a credit card to start the trial?`);
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!----> `);
      Card_content($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          $$payload3.out.push(`<p class="text-gray-600">`);
          push_element($$payload3, "p", 141, 12);
          $$payload3.out.push(`No, you can start your 14-day free trial without providing any payment information. 
              We'll only ask for payment details when you're ready to continue after the trial.</p>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!---->`);
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Card($$payload, {
    children: prevent_snippet_stringification(($$payload2) => {
      Card_header($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          Card_title($$payload3, {
            class: "text-lg",
            children: prevent_snippet_stringification(($$payload4) => {
              $$payload4.out.push(`<!---->Can I change plans later?`);
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!----> `);
      Card_content($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          $$payload3.out.push(`<p class="text-gray-600">`);
          push_element($$payload3, "p", 153, 12);
          $$payload3.out.push(`Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the 
              start of your next billing cycle.</p>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!---->`);
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Card($$payload, {
    children: prevent_snippet_stringification(($$payload2) => {
      Card_header($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          Card_title($$payload3, {
            class: "text-lg",
            children: prevent_snippet_stringification(($$payload4) => {
              $$payload4.out.push(`<!---->Is my data secure?`);
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!----> `);
      Card_content($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          $$payload3.out.push(`<p class="text-gray-600">`);
          push_element($$payload3, "p", 165, 12);
          $$payload3.out.push(`Absolutely. We use enterprise-grade encryption and are fully POPIA compliant. 
              Your data is stored in secure South African data centers and never shared with third parties.</p>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!---->`);
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Card($$payload, {
    children: prevent_snippet_stringification(($$payload2) => {
      Card_header($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          Card_title($$payload3, {
            class: "text-lg",
            children: prevent_snippet_stringification(($$payload4) => {
              $$payload4.out.push(`<!---->What happens if I exceed my conversation limit?`);
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!----> `);
      Card_content($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          $$payload3.out.push(`<p class="text-gray-600">`);
          push_element($$payload3, "p", 177, 12);
          $$payload3.out.push(`We'll notify you when you're approaching your limit. You can either upgrade your plan 
              or purchase additional conversations as needed. Your service won't be interrupted.</p>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!---->`);
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="text-center mt-16 bg-white rounded-xl shadow-lg p-8">`);
  push_element($$payload, "div", 187, 4);
  $$payload.out.push(`<h2 class="text-2xl font-bold mb-4">`);
  push_element($$payload, "h2", 188, 6);
  $$payload.out.push(`Ready to Transform Your Law Practice?</h2>`);
  pop_element();
  $$payload.out.push(` <p class="text-gray-600 mb-6">`);
  push_element($$payload, "p", 189, 6);
  $$payload.out.push(`Join hundreds of South African law firms already using Verdict 360</p>`);
  pop_element();
  $$payload.out.push(` <div class="flex justify-center space-x-4">`);
  push_element($$payload, "div", 192, 6);
  $$payload.out.push(`<a href="/signup">`);
  push_element($$payload, "a", 193, 8);
  Button($$payload, {
    variant: "default",
    size: "lg",
    children: prevent_snippet_stringification(($$payload2) => {
      $$payload2.out.push(`<!---->Start Your Free Trial`);
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></a>`);
  pop_element();
  $$payload.out.push(` <a href="/demo">`);
  push_element($$payload, "a", 198, 8);
  Button($$payload, {
    variant: "outline",
    size: "lg",
    children: prevent_snippet_stringification(($$payload2) => {
      $$payload2.out.push(`<!---->See Live Demo`);
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></a>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</div>`);
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
