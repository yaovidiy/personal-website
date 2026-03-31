import { dev } from '$app/environment';

/**
 * A simple server-side logger that redacts sensitive fields and is active
 * only in non-production environments (determined by SvelteKit's `dev` flag).
 */

const SENSITIVE_FIELDS = new Set([
	'password',
	'_password',
	'email',
	'token',
	'session',
	'cookie',
	'set-cookie',
	'authorization',
	'secret'
]);

/**
 * Recursively redacts sensitive fields from an object or array.
 */
function redact(obj: unknown): unknown {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (obj instanceof Error) {
		return {
			name: obj.name,
			message: obj.message,
			stack: dev ? obj.stack : undefined
		};
	}

	if (Array.isArray(obj)) {
		return obj.map(redact);
	}

	const redacted: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(obj)) {
		if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
			redacted[key] = '[REDACTED]';
		} else {
			redacted[key] = redact(value);
		}
	}
	return redacted;
}

export const logger = {
	info: (message: string, ...args: unknown[]) => {
		if (dev) {
			console.info(`[INFO] ${message}`, ...args.map(redact));
		}
	},
	error: (message: string, ...args: unknown[]) => {
		// Log errors even in production, but redacted?
		// The user explicitly asked to gate to non-production environments to avoid noise.
		if (dev) {
			console.error(`[ERROR] ${message}`, ...args.map(redact));
		}
	},
	warn: (message: string, ...args: unknown[]) => {
		if (dev) {
			console.warn(`[WARN] ${message}`, ...args.map(redact));
		}
	},
	debug: (message: string, ...args: unknown[]) => {
		if (dev) {
			console.debug(`[DEBUG] ${message}`, ...args.map(redact));
		}
	}
};
