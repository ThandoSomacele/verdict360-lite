export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26')
];

export const server_loads = [2];

export const dictionary = {
		"/": [3],
		"/about": [4],
		"/admin": [5,[2]],
		"/admin/installation": [6,[2]],
		"/admin/invoices": [7,[2]],
		"/admin/invoices/[id]": [8,[2]],
		"/admin/leads": [~9,[2]],
		"/admin/settings": [10,[2]],
		"/admin/tenants": [11,[2]],
		"/admin/tenants/new": [13,[2]],
		"/admin/tenants/[id]": [12,[2]],
		"/contact": [14],
		"/dashboard": [15],
		"/dashboard/ai-settings": [16],
		"/dashboard/analytics": [17],
		"/dashboard/conversations": [18],
		"/dashboard/leads": [19],
		"/demo": [20],
		"/login": [21],
		"/pricing": [22],
		"/privacy": [23],
		"/settings": [24],
		"/signup": [25],
		"/welcome": [26]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';