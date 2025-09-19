import { D as push, Y as spread_attributes, Z as clsx, K as push_element, M as pop_element, a0 as bind_props, G as pop, I as FILENAME } from "./index.js";
import { d as cn } from "./card-content.js";
Input[FILENAME] = "src/lib/components/ui/input.svelte";
function Input($$payload, $$props) {
  push(Input);
  let {
    class: className = "",
    value = void 0,
    oninput,
    onchange,
    onblur,
    onfocus,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<input${spread_attributes(
    {
      value,
      class: clsx(cn("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)),
      ...restProps
    }
  )}/>`);
  push_element($$payload, "input", 21, 0);
  pop_element();
  bind_props($$props, { value });
  pop();
}
Input.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Input as I
};
