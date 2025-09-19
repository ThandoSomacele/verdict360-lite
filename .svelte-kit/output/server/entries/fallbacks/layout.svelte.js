import { D as push, G as pop, I as FILENAME } from "../../chunks/index.js";
import "clsx";
Layout[FILENAME] = "node_modules/@sveltejs/kit/src/runtime/components/svelte-5/layout.svelte";
function Layout($$payload, $$props) {
  push(Layout);
  let { children } = $$props;
  children($$payload);
  $$payload.out.push(`<!---->`);
  pop();
}
Layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Layout as default
};
