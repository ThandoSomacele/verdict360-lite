import { D as push, U as ensure_array_like, T as head, K as push_element, M as pop_element, F as prevent_snippet_stringification, G as pop, I as FILENAME, R as escape_html, P as attr } from "../../../chunks/index.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../chunks/card-content.js";
_page[FILENAME] = "src/routes/about/+page.svelte";
function _page($$payload, $$props) {
  push(_page);
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=3B82F6&color=fff",
      bio: "Former partner at a leading SA law firm with 15 years of experience"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://ui-avatars.com/api/?name=Michael+Chen&background=3B82F6&color=fff",
      bio: "AI expert with a passion for transforming legal services"
    },
    {
      name: "Thandi Nkosi",
      role: "Head of Legal AI",
      image: "https://ui-avatars.com/api/?name=Thandi+Nkosi&background=3B82F6&color=fff",
      bio: "Specializes in South African legal frameworks and AI training"
    },
    {
      name: "David Kruger",
      role: "Head of Customer Success",
      image: "https://ui-avatars.com/api/?name=David+Kruger&background=3B82F6&color=fff",
      bio: "Dedicated to helping law firms maximize their AI potential"
    }
  ];
  const values = [
    {
      title: "Innovation",
      description: "Pushing the boundaries of legal technology to deliver cutting-edge solutions",
      icon: "💡"
    },
    {
      title: "Integrity",
      description: "Maintaining the highest ethical standards in all our operations",
      icon: "⚖️"
    },
    {
      title: "Accessibility",
      description: "Making legal services more accessible to all South Africans",
      icon: "🤝"
    },
    {
      title: "Excellence",
      description: "Committed to delivering exceptional quality in everything we do",
      icon: "⭐"
    }
  ];
  const each_array = ensure_array_like(values);
  const each_array_1 = ensure_array_like(teamMembers);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>About Us - Verdict 360</title>`;
    $$payload2.out.push(`<meta name="description" content="Learn about Verdict 360's mission to transform legal services in South Africa through AI technology."/>`);
    push_element($$payload2, "meta", 60, 2);
    pop_element();
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">`);
  push_element($$payload, "div", 63, 0);
  $$payload.out.push(`<div class="bg-white shadow-sm">`);
  push_element($$payload, "div", 65, 2);
  $$payload.out.push(`<div class="container mx-auto px-4 py-16 max-w-7xl">`);
  push_element($$payload, "div", 66, 4);
  $$payload.out.push(`<div class="text-center">`);
  push_element($$payload, "div", 67, 6);
  $$payload.out.push(`<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">`);
  push_element($$payload, "h1", 68, 8);
  $$payload.out.push(`Transforming Legal Services in South Africa</h1>`);
  pop_element();
  $$payload.out.push(` <p class="text-xl text-gray-600 max-w-3xl mx-auto">`);
  push_element($$payload, "p", 71, 8);
  $$payload.out.push(`We're on a mission to make legal services more accessible, efficient, and client-focused 
          through innovative AI technology tailored for South African law.</p>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="container mx-auto px-4 py-16 max-w-7xl">`);
  push_element($$payload, "div", 79, 2);
  $$payload.out.push(`<div class="mb-16">`);
  push_element($$payload, "div", 81, 4);
  Card($$payload, {
    children: prevent_snippet_stringification(($$payload2) => {
      Card_header($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          Card_title($$payload3, {
            class: "text-3xl text-center",
            children: prevent_snippet_stringification(($$payload4) => {
              $$payload4.out.push(`<!---->Our Story`);
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!----> `);
      Card_content($$payload2, {
        children: prevent_snippet_stringification(($$payload3) => {
          $$payload3.out.push(`<div class="prose max-w-none text-gray-700 space-y-4">`);
          push_element($$payload3, "div", 87, 10);
          $$payload3.out.push(`<p>`);
          push_element($$payload3, "p", 88, 12);
          $$payload3.out.push(`Founded in 2023, Verdict 360 emerged from a simple observation: South African law firms 
              were struggling to balance providing quality legal services with managing increasing client demands 
              and administrative burden.</p>`);
          pop_element();
          $$payload3.out.push(` <p>`);
          push_element($$payload3, "p", 93, 12);
          $$payload3.out.push(`Our founders, having experienced these challenges firsthand, envisioned a solution that would 
              leverage artificial intelligence to handle routine legal queries, allowing lawyers to focus on 
              complex cases that truly require their expertise.</p>`);
          pop_element();
          $$payload3.out.push(` <p>`);
          push_element($$payload3, "p", 98, 12);
          $$payload3.out.push(`Today, we serve over 200 law firms across South Africa, from solo practitioners in townships 
              to major firms in city centers. Our AI assistants have handled over 100,000 legal consultations, 
              helping firms improve client satisfaction while reducing operational costs by up to 40%.</p>`);
          pop_element();
          $$payload3.out.push(`</div>`);
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
  $$payload.out.push(` <div class="mb-16">`);
  push_element($$payload, "div", 109, 4);
  $$payload.out.push(`<h2 class="text-3xl font-bold text-center mb-8">`);
  push_element($$payload, "h2", 110, 6);
  $$payload.out.push(`Our Values</h2>`);
  pop_element();
  $$payload.out.push(` <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">`);
  push_element($$payload, "div", 111, 6);
  $$payload.out.push(`<!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let value = each_array[$$index];
    Card($$payload, {
      class: "text-center",
      children: prevent_snippet_stringification(($$payload2) => {
        Card_content($$payload2, {
          class: "pt-6",
          children: prevent_snippet_stringification(($$payload3) => {
            $$payload3.out.push(`<div class="text-4xl mb-4">`);
            push_element($$payload3, "div", 115, 14);
            $$payload3.out.push(`${escape_html(value.icon)}</div>`);
            pop_element();
            $$payload3.out.push(` <h3 class="font-semibold text-lg mb-2">`);
            push_element($$payload3, "h3", 116, 14);
            $$payload3.out.push(`${escape_html(value.title)}</h3>`);
            pop_element();
            $$payload3.out.push(` <p class="text-gray-600 text-sm">`);
            push_element($$payload3, "p", 117, 14);
            $$payload3.out.push(`${escape_html(value.description)}</p>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
      }),
      $$slots: { default: true }
    });
  }
  $$payload.out.push(`<!--]--></div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="mb-16">`);
  push_element($$payload, "div", 125, 4);
  $$payload.out.push(`<h2 class="text-3xl font-bold text-center mb-8">`);
  push_element($$payload, "h2", 126, 6);
  $$payload.out.push(`Meet Our Team</h2>`);
  pop_element();
  $$payload.out.push(` <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">`);
  push_element($$payload, "div", 127, 6);
  $$payload.out.push(`<!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let member = each_array_1[$$index_1];
    Card($$payload, {
      children: prevent_snippet_stringification(($$payload2) => {
        Card_content($$payload2, {
          class: "text-center pt-6",
          children: prevent_snippet_stringification(($$payload3) => {
            $$payload3.out.push(`<img${attr("src", member.image)}${attr("alt", member.name)} class="w-24 h-24 rounded-full mx-auto mb-4"/>`);
            push_element($$payload3, "img", 131, 14);
            pop_element();
            $$payload3.out.push(` <h3 class="font-semibold text-lg">`);
            push_element($$payload3, "h3", 136, 14);
            $$payload3.out.push(`${escape_html(member.name)}</h3>`);
            pop_element();
            $$payload3.out.push(` <p class="text-blue-600 text-sm mb-2">`);
            push_element($$payload3, "p", 137, 14);
            $$payload3.out.push(`${escape_html(member.role)}</p>`);
            pop_element();
            $$payload3.out.push(` <p class="text-gray-600 text-sm">`);
            push_element($$payload3, "p", 138, 14);
            $$payload3.out.push(`${escape_html(member.bio)}</p>`);
            pop_element();
          }),
          $$slots: { default: true }
        });
      }),
      $$slots: { default: true }
    });
  }
  $$payload.out.push(`<!--]--></div>`);
  pop_element();
  $$payload.out.push(`</div>`);
  pop_element();
  $$payload.out.push(` <div class="mb-16">`);
  push_element($$payload, "div", 146, 4);
  Card($$payload, {
    class: "bg-blue-600 text-white",
    children: prevent_snippet_stringification(($$payload2) => {
      Card_content($$payload2, {
        class: "py-12",
        children: prevent_snippet_stringification(($$payload3) => {
          $$payload3.out.push(`<div class="grid md:grid-cols-4 gap-8 text-center">`);
          push_element($$payload3, "div", 149, 10);
          $$payload3.out.push(`<div>`);
          push_element($$payload3, "div", 150, 12);
          $$payload3.out.push(`<div class="text-4xl font-bold mb-2">`);
          push_element($$payload3, "div", 151, 14);
          $$payload3.out.push(`200+</div>`);
          pop_element();
          $$payload3.out.push(` <div class="text-blue-100">`);
          push_element($$payload3, "div", 152, 14);
          $$payload3.out.push(`Law Firms</div>`);
          pop_element();
          $$payload3.out.push(`</div>`);
          pop_element();
          $$payload3.out.push(` <div>`);
          push_element($$payload3, "div", 154, 12);
          $$payload3.out.push(`<div class="text-4xl font-bold mb-2">`);
          push_element($$payload3, "div", 155, 14);
          $$payload3.out.push(`100K+</div>`);
          pop_element();
          $$payload3.out.push(` <div class="text-blue-100">`);
          push_element($$payload3, "div", 156, 14);
          $$payload3.out.push(`Consultations</div>`);
          pop_element();
          $$payload3.out.push(`</div>`);
          pop_element();
          $$payload3.out.push(` <div>`);
          push_element($$payload3, "div", 158, 12);
          $$payload3.out.push(`<div class="text-4xl font-bold mb-2">`);
          push_element($$payload3, "div", 159, 14);
          $$payload3.out.push(`99.9%</div>`);
          pop_element();
          $$payload3.out.push(` <div class="text-blue-100">`);
          push_element($$payload3, "div", 160, 14);
          $$payload3.out.push(`Uptime</div>`);
          pop_element();
          $$payload3.out.push(`</div>`);
          pop_element();
          $$payload3.out.push(` <div>`);
          push_element($$payload3, "div", 162, 12);
          $$payload3.out.push(`<div class="text-4xl font-bold mb-2">`);
          push_element($$payload3, "div", 163, 14);
          $$payload3.out.push(`4.8/5</div>`);
          pop_element();
          $$payload3.out.push(` <div class="text-blue-100">`);
          push_element($$payload3, "div", 164, 14);
          $$payload3.out.push(`Client Rating</div>`);
          pop_element();
          $$payload3.out.push(`</div>`);
          pop_element();
          $$payload3.out.push(`</div>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div>`);
  pop_element();
  $$payload.out.push(` <div class="text-center">`);
  push_element($$payload, "div", 172, 4);
  Card($$payload, {
    children: prevent_snippet_stringification(($$payload2) => {
      Card_content($$payload2, {
        class: "py-12",
        children: prevent_snippet_stringification(($$payload3) => {
          $$payload3.out.push(`<h2 class="text-2xl font-bold mb-4">`);
          push_element($$payload3, "h2", 175, 10);
          $$payload3.out.push(`Ready to Join the Legal AI Revolution?</h2>`);
          pop_element();
          $$payload3.out.push(` <p class="text-gray-600 mb-6">`);
          push_element($$payload3, "p", 176, 10);
          $$payload3.out.push(`See how Verdict 360 can transform your law practice</p>`);
          pop_element();
          $$payload3.out.push(` <div class="flex justify-center space-x-4">`);
          push_element($$payload3, "div", 179, 10);
          $$payload3.out.push(`<a href="/demo" class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">`);
          push_element($$payload3, "a", 180, 12);
          $$payload3.out.push(`Try Demo</a>`);
          pop_element();
          $$payload3.out.push(` <a href="/contact" class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">`);
          push_element($$payload3, "a", 183, 12);
          $$payload3.out.push(`Contact Us</a>`);
          pop_element();
          $$payload3.out.push(`</div>`);
          pop_element();
        }),
        $$slots: { default: true }
      });
    }),
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div>`);
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
