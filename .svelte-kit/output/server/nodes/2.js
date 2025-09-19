import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.BmEbWe5I.js","_app/immutable/chunks/Cexvm7jw.js","_app/immutable/chunks/CHEZFaFW.js"];
export const stylesheets = [];
export const fonts = [];
