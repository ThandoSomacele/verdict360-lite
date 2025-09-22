
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
		RouteId(): "/" | "/about" | "/admin" | "/admin/installation" | "/admin/invoices" | "/admin/invoices/[id]" | "/admin/leads" | "/admin/settings" | "/admin/tenants" | "/admin/tenants/new" | "/admin/tenants/[id]" | "/api" | "/api/admin" | "/api/admin/stats" | "/api/admin/system" | "/api/admin/system/health" | "/api/admin/tenants" | "/api/ai" | "/api/ai/chat" | "/api/ai/welcome" | "/api/auth" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/register" | "/api/auth/signup" | "/api/calendar" | "/api/chat" | "/api/health" | "/api/tenants" | "/api/tenants/check-subdomain" | "/api/tenants/current" | "/api/tenants/register" | "/contact" | "/dashboard" | "/dashboard/ai-settings" | "/dashboard/analytics" | "/dashboard/conversations" | "/dashboard/leads" | "/demo" | "/login" | "/pricing" | "/privacy" | "/settings" | "/signup" | "/welcome" | "/[tenant]";
		RouteParams(): {
			"/admin/invoices/[id]": { id: string };
			"/admin/tenants/[id]": { id: string };
			"/[tenant]": { tenant: string }
		};
		LayoutParams(): {
			"/": { id?: string; tenant?: string };
			"/about": Record<string, never>;
			"/admin": { id?: string };
			"/admin/installation": Record<string, never>;
			"/admin/invoices": { id?: string };
			"/admin/invoices/[id]": { id: string };
			"/admin/leads": Record<string, never>;
			"/admin/settings": Record<string, never>;
			"/admin/tenants": { id?: string };
			"/admin/tenants/new": Record<string, never>;
			"/admin/tenants/[id]": { id: string };
			"/api": Record<string, never>;
			"/api/admin": Record<string, never>;
			"/api/admin/stats": Record<string, never>;
			"/api/admin/system": Record<string, never>;
			"/api/admin/system/health": Record<string, never>;
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
			"/dashboard/ai-settings": Record<string, never>;
			"/dashboard/analytics": Record<string, never>;
			"/dashboard/conversations": Record<string, never>;
			"/dashboard/leads": Record<string, never>;
			"/demo": Record<string, never>;
			"/login": Record<string, never>;
			"/pricing": Record<string, never>;
			"/privacy": Record<string, never>;
			"/settings": Record<string, never>;
			"/signup": Record<string, never>;
			"/welcome": Record<string, never>;
			"/[tenant]": { tenant: string }
		};
		Pathname(): "/" | "/about" | "/about/" | "/admin" | "/admin/" | "/admin/installation" | "/admin/installation/" | "/admin/invoices" | "/admin/invoices/" | `/admin/invoices/${string}` & {} | `/admin/invoices/${string}/` & {} | "/admin/leads" | "/admin/leads/" | "/admin/settings" | "/admin/settings/" | "/admin/tenants" | "/admin/tenants/" | "/admin/tenants/new" | "/admin/tenants/new/" | `/admin/tenants/${string}` & {} | `/admin/tenants/${string}/` & {} | "/api" | "/api/" | "/api/admin" | "/api/admin/" | "/api/admin/stats" | "/api/admin/stats/" | "/api/admin/system" | "/api/admin/system/" | "/api/admin/system/health" | "/api/admin/system/health/" | "/api/admin/tenants" | "/api/admin/tenants/" | "/api/ai" | "/api/ai/" | "/api/ai/chat" | "/api/ai/chat/" | "/api/ai/welcome" | "/api/ai/welcome/" | "/api/auth" | "/api/auth/" | "/api/auth/login" | "/api/auth/login/" | "/api/auth/logout" | "/api/auth/logout/" | "/api/auth/register" | "/api/auth/register/" | "/api/auth/signup" | "/api/auth/signup/" | "/api/calendar" | "/api/calendar/" | "/api/chat" | "/api/chat/" | "/api/health" | "/api/health/" | "/api/tenants" | "/api/tenants/" | "/api/tenants/check-subdomain" | "/api/tenants/check-subdomain/" | "/api/tenants/current" | "/api/tenants/current/" | "/api/tenants/register" | "/api/tenants/register/" | "/contact" | "/contact/" | "/dashboard" | "/dashboard/" | "/dashboard/ai-settings" | "/dashboard/ai-settings/" | "/dashboard/analytics" | "/dashboard/analytics/" | "/dashboard/conversations" | "/dashboard/conversations/" | "/dashboard/leads" | "/dashboard/leads/" | "/demo" | "/demo/" | "/login" | "/login/" | "/pricing" | "/pricing/" | "/privacy" | "/privacy/" | "/settings" | "/settings/" | "/signup" | "/signup/" | "/welcome" | "/welcome/" | `/${string}` & {} | `/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | "/notification.mp3" | string & {};
	}
}