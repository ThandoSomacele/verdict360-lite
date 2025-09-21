
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/admin" | "/admin/installation" | "/admin/leads" | "/admin/tenants" | "/api" | "/api/admin" | "/api/admin/stats" | "/api/admin/tenants" | "/api/ai" | "/api/ai/chat" | "/api/ai/welcome" | "/api/auth" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/register" | "/api/auth/signup" | "/api/calendar" | "/api/chat" | "/api/health" | "/api/tenants" | "/api/tenants/check-subdomain" | "/api/tenants/current" | "/api/tenants/register" | "/contact" | "/dashboard" | "/demo" | "/login" | "/pricing" | "/signup" | "/welcome" | "/[tenant]";
		RouteParams(): {
			"/[tenant]": { tenant: string }
		};
		LayoutParams(): {
			"/": { tenant?: string };
			"/about": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/installation": Record<string, never>;
			"/admin/leads": Record<string, never>;
			"/admin/tenants": Record<string, never>;
			"/api": Record<string, never>;
			"/api/admin": Record<string, never>;
			"/api/admin/stats": Record<string, never>;
			"/api/admin/tenants": Record<string, never>;
			"/api/ai": Record<string, never>;
			"/api/ai/chat": Record<string, never>;
			"/api/ai/welcome": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/auth/register": Record<string, never>;
			"/api/auth/signup": Record<string, never>;
			"/api/calendar": Record<string, never>;
			"/api/chat": Record<string, never>;
			"/api/health": Record<string, never>;
			"/api/tenants": Record<string, never>;
			"/api/tenants/check-subdomain": Record<string, never>;
			"/api/tenants/current": Record<string, never>;
			"/api/tenants/register": Record<string, never>;
			"/contact": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/demo": Record<string, never>;
			"/login": Record<string, never>;
			"/pricing": Record<string, never>;
			"/signup": Record<string, never>;
			"/welcome": Record<string, never>;
			"/[tenant]": { tenant: string }
		};
		Pathname(): "/" | "/about" | "/about/" | "/admin" | "/admin/" | "/admin/installation" | "/admin/installation/" | "/admin/leads" | "/admin/leads/" | "/admin/tenants" | "/admin/tenants/" | "/api" | "/api/" | "/api/admin" | "/api/admin/" | "/api/admin/stats" | "/api/admin/stats/" | "/api/admin/tenants" | "/api/admin/tenants/" | "/api/ai" | "/api/ai/" | "/api/ai/chat" | "/api/ai/chat/" | "/api/ai/welcome" | "/api/ai/welcome/" | "/api/auth" | "/api/auth/" | "/api/auth/login" | "/api/auth/login/" | "/api/auth/logout" | "/api/auth/logout/" | "/api/auth/register" | "/api/auth/register/" | "/api/auth/signup" | "/api/auth/signup/" | "/api/calendar" | "/api/calendar/" | "/api/chat" | "/api/chat/" | "/api/health" | "/api/health/" | "/api/tenants" | "/api/tenants/" | "/api/tenants/check-subdomain" | "/api/tenants/check-subdomain/" | "/api/tenants/current" | "/api/tenants/current/" | "/api/tenants/register" | "/api/tenants/register/" | "/contact" | "/contact/" | "/dashboard" | "/dashboard/" | "/demo" | "/demo/" | "/login" | "/login/" | "/pricing" | "/pricing/" | "/signup" | "/signup/" | "/welcome" | "/welcome/" | `/${string}` & {} | `/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | "/notification.mp3" | string & {};
	}
}