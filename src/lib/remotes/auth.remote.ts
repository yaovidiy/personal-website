import { command, form } from '$app/server';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { signIn, signOut as apiSignOut, signUp } from '$lib/api/auth';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/**
 * Extracts the outgoing `Set-Cookie` headers from a Fetch-compatible
 * `Response`-like object returned by `openapi-fetch` and sets them on the
 * SvelteKit response so the browser receives the session cookie.
 */
function forwardSetCookies(raw: Response, event: ReturnType<typeof getRequestEvent>) {
	// Prefer the non-standard but convenient Headers.getSetCookie(), if available.
	let cookies: string[] = [];
	const headerGetSetCookie = (raw.headers as any).getSetCookie?.();
	if (Array.isArray(headerGetSetCookie) && headerGetSetCookie.length > 0) {
		cookies = headerGetSetCookie;
	} else {
		// Fallback: collect all `set-cookie` headers via standard iteration.
		for (const [key, value] of raw.headers) {
			if (key.toLowerCase() === 'set-cookie' && value) {
				cookies.push(value);
			}
		}

		// Final fallback: some environments expose only the first `set-cookie` via get().
		if (cookies.length === 0) {
			const single = raw.headers.get('set-cookie');
			if (single) cookies.push(single);
		}
	}
	for (const cookieStr of cookies) {
		// Parse each Set-Cookie string into its parts so SvelteKit can
		// serialize it properly when sending the response.
		const [nameValue, ...directives] = cookieStr.split(';').map((s) => s.trim());
		const eqIdx = nameValue.indexOf('=');
		// Skip malformed cookie segments that don't contain a valid name=value pair.
		if (eqIdx <= 0) {
			continue;
		}
		const name = nameValue.slice(0, eqIdx);
		const rawValue = nameValue.slice(eqIdx + 1);
		let value = rawValue;
		// Only attempt to decode if the value appears percent-encoded, and
		// guard against malformed percent-encoding that would throw.
		if (rawValue.includes('%')) {
			try {
				value = decodeURIComponent(rawValue);
			} catch {
				// Fall back to the raw value if decoding fails.
			}
		}

		const opts: Parameters<typeof event.cookies.set>[2] = { path: '/' };
		for (const directive of directives) {
			const lower = directive.toLowerCase();
			if (lower === 'httponly') opts.httpOnly = true;
			else if (lower === 'secure') opts.secure = true;
			else if (lower === 'samesite=lax') opts.sameSite = 'lax';
			else if (lower === 'samesite=strict') opts.sameSite = 'strict';
			else if (lower === 'samesite=none') opts.sameSite = 'none';
			else if (lower.startsWith('path=')) opts.path = directive.slice(5);
			else if (lower.startsWith('max-age=')) opts.maxAge = Number(directive.slice(8));
			else if (lower.startsWith('expires=')) opts.expires = new Date(directive.slice(8));
		}

		event.cookies.set(name, value, opts);
	}
}

// ---------------------------------------------------------------------------
// Sign-up
// ---------------------------------------------------------------------------

const SignUpSchema = v.object({
	name: v.pipe(v.string(), v.minLength(2, 'Name must be at least 2 characters.')),
	email: v.pipe(v.string(), v.email('Please enter a valid email.')),
	// Prefix with underscore so the value is NOT repopulated on validation failure.
	_password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters.'))
});

export const registerUser = form(SignUpSchema, async (data) => {
	try {
		const event = getRequestEvent();
		const {
			data: result,
			response,
			error
		} = await signUp({
			name: data.name,
			email: data.email,
			password: data._password
		});

		console.log(result, error, 'Sign up result');
		if (!result || error) {
			const message =
				response?.status === 409
					? 'An account with this email already exists.'
					: 'Sign-up failed. Please try again.';
			throw new Error(message);
		}

		forwardSetCookies(response as unknown as Response, event);
		redirect(303, '/admin');
	} catch (e) {
		console.log(e, 'Signup error');
	}
});

// ---------------------------------------------------------------------------
// Sign-in
// ---------------------------------------------------------------------------

const SignInSchema = v.object({
	email: v.pipe(v.string(), v.email('Please enter a valid email.')),
	// Prefix with underscore so the password is NOT repopulated on failure.
	_password: v.pipe(v.string(), v.minLength(1, 'Password is required.'))
});

export const loginUser = form(SignInSchema, async (data) => {
	const event = getRequestEvent();
	const {
		data: result,
		response,
		error
	} = await signIn({
		email: data.email,
		password: data._password
	});

	if (!result || error) {
		const message =
			response?.status === 401 ? 'Invalid email or password.' : 'Sign-in failed. Please try again.';
		throw new Error(message);
	}

	forwardSetCookies(response as unknown as Response, event);
	redirect(303, '/admin');
});

// ---------------------------------------------------------------------------
// Sign-out
// ---------------------------------------------------------------------------

export const logoutUser = command(async () => {
	const event = getRequestEvent();

	const cookie = event.request.headers.get('cookie');
	await apiSignOut({
		headers: cookie ? { cookie } : undefined,
		fetch: event.fetch,
	});

	// Clear the session cookie on the browser side by setting an expired one.
	for (const name of event.cookies.getAll().map((c) => c.name)) {
		event.cookies.delete(name, { path: '/' });
	}
});
