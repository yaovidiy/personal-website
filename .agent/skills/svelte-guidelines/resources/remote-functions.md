# SvelteKit Remote Functions (SvelteKit 2.27+)

SvelteKit introduces *experimental* remote functions as a type-safe way to communicate between the client and server. They allow you to define server-only logic that is safely callable from the client.

To enable them, update `svelte.config.js`:
```js
export default {
    kit: { experimental: { remoteFunctions: true } },
    compilerOptions: { experimental: { async: true } }
};
```

**Location & TypeScript Rule:** Remote functions **must always be written in TypeScript** (using a `.remote.ts` file extension) and **must be placed inside the `/src/lib/remotes` directory**. SvelteKit restricts placing them inside `src/lib/server/`.

## The Four Types of Remote Functions

1. **`query`**: For reading dynamic server data. Can return a localized reactive value or be `await`ed.
2. **`form`**: For handling `<form>` submissions with built-in validation, progressive enhancement, returning field objects, and returning structured data.
3. **`command`**: For programmatic server-side mutations (called from event handlers).
4. **`prerender`**: For reading data that changes at most once per redeployment. Evaluated at build-time.

## Best Practices

1. **Strictly Validate Arguments**: 
   Always pass a [Standard Schema](https://standardschema.dev/) library (like Zod or Valibot) as the first argument to any `query`, `form`, or `command` that accepts parameters to validate the payload securely.
   ```ts
   import * as v from 'valibot';
   import { query } from '$app/server';

   export const getPost = query(v.string(), async (slug) => { /* ... */ });
   ```
2. **Prefer `form` over `command` when appropriate**: 
   If your mutation is triggered by a form, always use `form`. It provides robust schema validation mechanisms (via `fields.as('type')`, `fields.issues()`), and handles progressive enhancement automatically.
3. **Optimize Sequential Queries with `query.batch`**: 
   When issuing multiple related read requests in the same tick (like in an `{#each}` loop), use `query.batch` to solve the *N+1 database problem*.
4. **Client-Driven Single-Flight Mutations**:
   When using `form.enhance(async ({ submit }) => ...)`, or `command()`, efficiently update related queries via `updates(...)` rather than letting SvelteKit blindly refresh everything.
   ```ts
   // In enhanced form submit or command wrapper
   await submit().updates(getPosts());
   ```
5. **Handling Form Validation Safely**:
   Ensure sensitive submitted fields (like passwords) are not repopulated upon validation failure by prefixing the field with an underscore (e.g., `_password`).

## Anti-Patterns

- ❌ **Exporting from `src/lib/server`**: SvelteKit remote functions cannot be placed inside `src/lib/server`.
- ❌ **Relying on `url`, `params`, or `route` for Auth**: While you can extract `cookies` via [`getRequestEvent()`]($app-server), never use `event.url` or `event.route` to verify if a user has access to data. These properties reflect the page they *called* from, and can be bypassed easily since it's an HTTP endpoint under the hood. 
- ❌ **Using `redirect(...)` in Commands**: You can use `redirect` in `form`, `query` or `prerender` callbacks, but you **cannot** use it inside `command()`. Commands should be purely for mutation, returning either void or a specific payload back to the client event handler.
- ❌ **Exporting Schemas for Client Use**: You cannot export a schema directly from `.remote.ts` to be used for client preflight checks. Extract schemas into a shared module if you need it available in the component `<script>` block.
- ❌ **Ignoring `handleValidationError` Hook**: An invalid request arg throws a 400 Bad Request. Prevent revealing stack traces to potential attackers by intercepting schema validation errors with the `handleValidationError` hook in `src/hooks.server.ts`.
