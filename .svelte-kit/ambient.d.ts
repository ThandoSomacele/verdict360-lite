
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const NODE_ENV: string;
	export const PORT: string;
	export const DB_HOST: string;
	export const DB_PORT: string;
	export const DB_NAME: string;
	export const DB_USER: string;
	export const DB_PASSWORD: string;
	export const REDIS_HOST: string;
	export const REDIS_PORT: string;
	export const REDIS_PASSWORD: string;
	export const JWT_SECRET: string;
	export const JWT_EXPIRES_IN: string;
	export const JWT_REFRESH_SECRET: string;
	export const JWT_REFRESH_EXPIRES_IN: string;
	export const STRIPE_SECRET_KEY: string;
	export const STRIPE_WEBHOOK_SECRET: string;
	export const STRIPE_PUBLISHABLE_KEY: string;
	export const SMTP_HOST: string;
	export const SMTP_PORT: string;
	export const SMTP_USER: string;
	export const FROM_EMAIL: string;
	export const FROM_NAME: string;
	export const OLLAMA_BASE_URL: string;
	export const AI_ENABLED: string;
	export const AI_MODEL: string;
	export const AI_MAX_TOKENS: string;
	export const AI_TEMPERATURE: string;
	export const VITE_GROQ_API_KEY: string;
	export const VITE_GROQ_MODEL: string;
	export const GROQ_API_KEY: string;
	export const GROQ_MODEL: string;
	export const CALENDAR_REDIRECT_URI: string;
	export const SMTP_PASS: string;
	export const UPLOAD_PATH: string;
	export const MAX_FILE_SIZE: string;
	export const RATE_LIMIT_WINDOW_MS: string;
	export const RATE_LIMIT_MAX_REQUESTS: string;
	export const LOG_LEVEL: string;
	export const LOG_FILE: string;
	export const DEFAULT_TENANT: string;
	export const TENANT_DOMAIN_SUFFIX: string;
	export const CORS_ORIGIN: string;
	export const SESSION_SECRET: string;
	export const GOOGLE_ANALYTICS_ID: string;
	export const MIXPANEL_TOKEN: string;
	export const SENTRY_DSN: string;
	export const DATABASE_URL: string;
	export const ENCRYPTION_KEY: string;
	export const REDIS_URL: string;
	export const EMAIL_FROM: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const COMMAND_MODE: string;
	export const HOME: string;
	export const HOMEBREW_CELLAR: string;
	export const HOMEBREW_PREFIX: string;
	export const HOMEBREW_REPOSITORY: string;
	export const INFOPATH: string;
	export const LESS: string;
	export const LOGNAME: string;
	export const LSCOLORS: string;
	export const LS_COLORS: string;
	export const MallocNanoZone: string;
	export const NVM_BIN: string;
	export const NVM_CD_FLAGS: string;
	export const NVM_DIR: string;
	export const NVM_INC: string;
	export const OLDPWD: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const PAGER: string;
	export const PATH: string;
	export const PWD: string;
	export const SHELL: string;
	export const SHLVL: string;
	export const SSH_AUTH_SOCK: string;
	export const TMPDIR: string;
	export const USER: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const VSCODE_CWD: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const VSCODE_IPC_HOOK: string;
	export const VSCODE_NLS_CONFIG: string;
	export const VSCODE_PID: string;
	export const XPC_FLAGS: string;
	export const XPC_SERVICE_NAME: string;
	export const ZSH: string;
	export const _: string;
	export const __CFBundleIdentifier: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const APPLICATION_INSIGHTS_NO_STATSBEAT: string;
	export const APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL: string;
	export const APPLICATIONINSIGHTS_CONFIGURATION_CONTENT: string;
	export const VSCODE_L10N_BUNDLE_LOCATION: string;
	export const ELECTRON_NO_ASAR: string;
	export const VITE_USER_NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_DOMAIN_SUFFIX: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		NODE_ENV: string;
		PORT: string;
		DB_HOST: string;
		DB_PORT: string;
		DB_NAME: string;
		DB_USER: string;
		DB_PASSWORD: string;
		REDIS_HOST: string;
		REDIS_PORT: string;
		REDIS_PASSWORD: string;
		JWT_SECRET: string;
		JWT_EXPIRES_IN: string;
		JWT_REFRESH_SECRET: string;
		JWT_REFRESH_EXPIRES_IN: string;
		STRIPE_SECRET_KEY: string;
		STRIPE_WEBHOOK_SECRET: string;
		STRIPE_PUBLISHABLE_KEY: string;
		SMTP_HOST: string;
		SMTP_PORT: string;
		SMTP_USER: string;
		FROM_EMAIL: string;
		FROM_NAME: string;
		OLLAMA_BASE_URL: string;
		AI_ENABLED: string;
		AI_MODEL: string;
		AI_MAX_TOKENS: string;
		AI_TEMPERATURE: string;
		VITE_GROQ_API_KEY: string;
		VITE_GROQ_MODEL: string;
		GROQ_API_KEY: string;
		GROQ_MODEL: string;
		CALENDAR_REDIRECT_URI: string;
		SMTP_PASS: string;
		UPLOAD_PATH: string;
		MAX_FILE_SIZE: string;
		RATE_LIMIT_WINDOW_MS: string;
		RATE_LIMIT_MAX_REQUESTS: string;
		LOG_LEVEL: string;
		LOG_FILE: string;
		DEFAULT_TENANT: string;
		TENANT_DOMAIN_SUFFIX: string;
		CORS_ORIGIN: string;
		SESSION_SECRET: string;
		GOOGLE_ANALYTICS_ID: string;
		MIXPANEL_TOKEN: string;
		SENTRY_DSN: string;
		DATABASE_URL: string;
		ENCRYPTION_KEY: string;
		REDIS_URL: string;
		EMAIL_FROM: string;
		ELECTRON_RUN_AS_NODE: string;
		COMMAND_MODE: string;
		HOME: string;
		HOMEBREW_CELLAR: string;
		HOMEBREW_PREFIX: string;
		HOMEBREW_REPOSITORY: string;
		INFOPATH: string;
		LESS: string;
		LOGNAME: string;
		LSCOLORS: string;
		LS_COLORS: string;
		MallocNanoZone: string;
		NVM_BIN: string;
		NVM_CD_FLAGS: string;
		NVM_DIR: string;
		NVM_INC: string;
		OLDPWD: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		PAGER: string;
		PATH: string;
		PWD: string;
		SHELL: string;
		SHLVL: string;
		SSH_AUTH_SOCK: string;
		TMPDIR: string;
		USER: string;
		VSCODE_CODE_CACHE_PATH: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		VSCODE_CWD: string;
		VSCODE_ESM_ENTRYPOINT: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		VSCODE_IPC_HOOK: string;
		VSCODE_NLS_CONFIG: string;
		VSCODE_PID: string;
		XPC_FLAGS: string;
		XPC_SERVICE_NAME: string;
		ZSH: string;
		_: string;
		__CFBundleIdentifier: string;
		__CF_USER_TEXT_ENCODING: string;
		APPLICATION_INSIGHTS_NO_STATSBEAT: string;
		APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL: string;
		APPLICATIONINSIGHTS_CONFIGURATION_CONTENT: string;
		VSCODE_L10N_BUNDLE_LOCATION: string;
		ELECTRON_NO_ASAR: string;
		VITE_USER_NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_DOMAIN_SUFFIX: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
