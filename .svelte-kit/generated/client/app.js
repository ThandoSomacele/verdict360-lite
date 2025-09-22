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
	() => import('./nodes/22')
];

export const server_loads = [2];

export const dictionary = {
		"/": [3],
		"/about": [4],
		"/admin": [5,[2]],
		"/admin/installation": [6,[2]],
		"/admin/leads": [~7,[2]],
		"/admin/settings": [8,[2]],
		"/admin/tenants": [9,[2]],
		"/admin/tenants/[id]": [10,[2]],
		"/contact": [11],
		"/dashboard": [12],
		"/dashboard/ai-settings": [13],
		"/dashboard/analytics": [14],
		"/dashboard/conversations": [15],
		"/dashboard/leads": [16],
		"/demo": [17],
		"/login": [18],
		"/pricing": [19],
		"/settings": [20],
		"/signup": [21],
		"/welcome": [22]
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