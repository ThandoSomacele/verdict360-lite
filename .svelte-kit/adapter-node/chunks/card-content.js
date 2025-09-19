import { D as push, Y as spread_attributes, Z as clsx$1, K as push_element, M as pop_element, G as pop, I as FILENAME } from "./index.js";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
Card[FILENAME] = "src/lib/components/ui/card.svelte";
function Card($$payload, $$props) {
  push(Card);
  let {
    class: className = "",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<div${spread_attributes(
    {
      class: clsx$1(cn("rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm", className)),
      ...restProps
    }
  )}>`);
  push_element($$payload, "div", 12, 0);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  pop_element();
  pop();
}
Card.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Card_header[FILENAME] = "src/lib/components/ui/card-header.svelte";
function Card_header($$payload, $$props) {
  push(Card_header);
  let {
    class: className = "",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<div${spread_attributes(
    {
      class: clsx$1(cn("flex flex-col space-y-1.5 p-6", className)),
      ...restProps
    }
  )}>`);
  push_element($$payload, "div", 12, 0);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  pop_element();
  pop();
}
Card_header.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Card_title[FILENAME] = "src/lib/components/ui/card-title.svelte";
function Card_title($$payload, $$props) {
  push(Card_title);
  let {
    class: className = "",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<h3${spread_attributes(
    {
      class: clsx$1(cn("text-2xl font-semibold leading-none tracking-tight", className)),
      ...restProps
    }
  )}>`);
  push_element($$payload, "h3", 12, 0);
  children?.($$payload);
  $$payload.out.push(`<!----></h3>`);
  pop_element();
  pop();
}
Card_title.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Card_content[FILENAME] = "src/lib/components/ui/card-content.svelte";
function Card_content($$payload, $$props) {
  push(Card_content);
  let {
    class: className = "",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<div${spread_attributes({ class: clsx$1(cn("p-6 pt-0", className)), ...restProps })}>`);
  push_element($$payload, "div", 12, 0);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  pop_element();
  pop();
}
Card_content.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Card as C,
  Card_header as a,
  Card_title as b,
  Card_content as c,
  cn as d
};
