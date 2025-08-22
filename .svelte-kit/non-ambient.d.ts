
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
		RouteId(): "/" | "/admin" | "/api" | "/api/admin" | "/api/admin/stats" | "/api/admin/tenants" | "/api/ai" | "/api/ai/chat" | "/api/ai/welcome" | "/api/auth" | "/api/calendar" | "/api/chat" | "/api/health" | "/api/tenants" | "/api/tenants/current" | "/demo" | "/login" | "/pricing" | "/signup" | "/[tenant]";
		RouteParams(): {
			"/[tenant]": { tenant: string }
		};
		LayoutParams(): {
			"/": { tenant?: string };
			"/admin": Record<string, never>;
			"/api": Record<string, never>;
			"/api/admin": Record<string, never>;
			"/api/admin/stats": Record<string, never>;
			"/api/admin/tenants": Record<string, never>;
			"/api/ai": Record<string, never>;
			"/api/ai/chat": Record<string, never>;
			"/api/ai/welcome": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/calendar": Record<string, never>;
			"/api/chat": Record<string, never>;
			"/api/health": Record<string, never>;
			"/api/tenants": Record<string, never>;
			"/api/tenants/current": Record<string, never>;
			"/demo": Record<string, never>;
			"/login": Record<string, never>;
			"/pricing": Record<string, never>;
			"/signup": Record<string, never>;
			"/[tenant]": { tenant: string }
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/api" | "/api/" | "/api/admin" | "/api/admin/" | "/api/admin/stats" | "/api/admin/stats/" | "/api/admin/tenants" | "/api/admin/tenants/" | "/api/ai" | "/api/ai/" | "/api/ai/chat" | "/api/ai/chat/" | "/api/ai/welcome" | "/api/ai/welcome/" | "/api/auth" | "/api/auth/" | "/api/calendar" | "/api/calendar/" | "/api/chat" | "/api/chat/" | "/api/health" | "/api/health/" | "/api/tenants" | "/api/tenants/" | "/api/tenants/current" | "/api/tenants/current/" | "/demo" | "/demo/" | "/login" | "/login/" | "/pricing" | "/pricing/" | "/signup" | "/signup/" | `/${string}` & {} | `/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | string & {};
	}
}