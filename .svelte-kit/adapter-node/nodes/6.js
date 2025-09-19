import * as server from '../entries/pages/admin/leads/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/leads/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/leads/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.DU0ole60.js","_app/immutable/chunks/Cexvm7jw.js","_app/immutable/chunks/CHEZFaFW.js","_app/immutable/chunks/4_OcRqll.js","_app/immutable/chunks/V_zUl8LG.js","_app/immutable/chunks/BcIZtQ9e.js","_app/immutable/chunks/ClU6btJJ.js","_app/immutable/chunks/DGVqiR9F.js","_app/immutable/chunks/BA-TEJIs.js","_app/immutable/chunks/DnFxrzVB.js"];
export const stylesheets = [];
export const fonts = [];
