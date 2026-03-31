<script lang="ts">
	import { page } from '$app/state';
	import { LayoutDashboard, Briefcase, Users, Menu, X } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import { resolve } from '$app/paths';

	let isOpen = $state(false);

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
		{ href: '/admin/users', label: 'Users', icon: Users }
	] as const;

	function toggleSidebar() {
		isOpen = !isOpen;
	}

	function closeSidebar() {
		isOpen = false;
	}
</script>

<!-- Mobile Toggle Button -->
<div class="flex h-14 items-center border-b bg-surface px-4 md:hidden">
	<button
		type="button"
		class="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
		aria-controls="admin-sidebar"
		aria-expanded={isOpen}
		onclick={toggleSidebar}
	>
		<span class="sr-only">{isOpen ? 'Close sidebar' : 'Open sidebar'}</span>
		{#if isOpen}
			<X class="h-6 w-6" />
		{:else}
			<Menu class="h-6 w-6" />
		{/if}
	</button>
	<span class="ml-4 font-display text-lg font-bold">Admin Panel</span>
</div>

<!-- Sidebar Overlay (Mobile) -->
{#if isOpen}
	<div
		class="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
		onclick={closeSidebar}
		aria-hidden="true"
	></div>
{/if}

<!-- Sidebar Content -->
<aside
	id="admin-sidebar"
	class={cn(
		'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-surface transition-transform duration-200 ease-in-out md:static md:translate-x-0',
		isOpen ? 'translate-x-0' : '-translate-x-full'
	)}
>
	<div class="flex h-14 items-center border-b px-6 md:h-16">
		<span class="font-display text-xl font-bold">Admin Panel</span>
	</div>

	<nav class="mt-4 px-3" aria-label="Main Navigation">
		<ul class="space-y-1">
			{#each navItems as item (item.href)}
				<li>
					<a
						href={resolve(item.href)}
						class={cn(
							'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary',
							page.url.pathname === resolve(item.href)
								? 'bg-primary text-on-primary'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'
						)}
						aria-current={page.url.pathname === resolve(item.href) ? 'page' : undefined}
						onclick={closeSidebar}
					>
						<item.icon
							class={cn(
								'mr-3 h-5 w-5 shrink-0',
								page.url.pathname === item.href
									? 'text-on-primary'
									: 'text-muted-foreground group-hover:text-foreground'
							)}
						/>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>
