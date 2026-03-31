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
	// Headers.getSetCookie() is supported in the Fetch API
	const cookies = raw.headers.getSetCookie?.() ?? [];
	for (const cookieStr of cookies) {
		// Parse each Set-Cookie string into its parts so SvelteKit can
		// serialize it properly when sending the response.
		const [nameValue, ...directives] = cookieStr.split(';').map((s) => s.trim());
		const eqIdx = nameValue.indexOf('=');
		const name = nameValue.slice(0, eqIdx);
		const value = decodeURIComponent(nameValue.slice(eqIdx + 1));

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

	if (!result || error) {
		const message =
			response?.status === 409
				? 'An account with this email already exists.'
				: 'Sign-up failed. Please try again.';
		throw new Error(message);
	}

	forwardSetCookies(response as unknown as Response, event);
	redirect(303, '/admin');
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

	await apiSignOut();

	// Clear the session cookie on the browser side by setting an expired one.
	for (const name of event.cookies.getAll().map((c) => c.name)) {
		event.cookies.delete(name, { path: '/' });
	}
});
