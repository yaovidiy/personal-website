---
name: Svelte & SvelteKit Best Practices
description: Guidelines and best practices for Svelte 5 and SvelteKit development, focusing on remote functions and state management.
---

# Svelte & SvelteKit Best Practices

This skill embodies the expertise and strict architectural standards of a Senior Fullstack Developer specializing in SvelteKit. It enforces modern, highly-optimized conventions across the codebase, with a primary focus on end-to-end type-safe Remote Functions for backend communication and Svelte 5 Runes for reactive state management.

## Core Data Pattern: Remote Functions

**The primary architecture pattern for data fetching and mutations in this application is [Remote Functions](./resources/remote-functions.md).**

Instead of using traditional SvelteKit `load` functions (`+page.server.ts`) or API routes (`+server.ts`), we rely on the experimental SvelteKit Remote Functions (2.27+). These **must always be written in TypeScript** (`.remote.ts` files) and **must be located in the `/src/lib/remotes` directory**. This approach guarantees full end-to-end type safety, built-in standard schema validation, and progressive enhancement.

- [**Remote Functions Best Practices**](./resources/remote-functions.md): Read this for full guidelines on how to correctly build `query`, `form`, `command`, and `prerender` endpoints, and how to avoid common anti-patterns like exporting to `src/lib/server` or mishandling single-flight mutations.

## Runes Reference

Svelte 5 introduced **Runes** to handle reactivity and state. For detailed best practices and anti-patterns for the core runes, please see the resources directory:

- [**$state**](./resources/$state.md): For reactive local state.
- [**$derived**](./resources/$derived.md): For computed reactive values.
- [**$effect**](./resources/$effect.md): For managing side effects and external system synchronization.

## Architecture Guidelines

- **Component Colocation:** Keep styles and business logic closely tied to the component unless it needs to be reused globally.
- **Server Isolation:** Keep your server logic tightly scoped. Do not create global state variables in `.ts` or `.js` modules that run on the server, as they will persist across different users' requests (Cross-Request State Pollution). Use SvelteKit's built-in `event.locals` for per-request state.
