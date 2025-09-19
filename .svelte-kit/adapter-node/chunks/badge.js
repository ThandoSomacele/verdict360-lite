import { D as push, Y as spread_attributes, Z as clsx, K as push_element, M as pop_element, G as pop, I as FILENAME } from "./index.js";
import { d as cn } from "./card-content.js";
Badge[FILENAME] = "src/lib/components/ui/badge.svelte";
function Badge($$payload, $$props) {
  push(Badge);
  let {
    variant = "default",
    class: className = "",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const variantStyles = {
    default: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "text-gray-950 border border-gray-200",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800"
  };
  $$payload.out.push(`<div${spread_attributes(
    {
      class: clsx(cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", variantStyles[variant], className)),
      ...restProps
    }
  )}>`);
  push_element($$payload, "div", 27, 0);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  pop_element();
  pop();
}
Badge.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Badge as B
};
