<script lang="ts">
	import { loginUser } from '$lib/remotes/auth.remote';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { resolve } from '$app/paths';

	const { email, _password } = loginUser.fields;
	let rememberMe = $state(false);
</script>

<svelte:head>
	<title>Sign In</title>
	<meta name="description" content="Sign in to your account to access the admin dashboard." />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-12">
	<div class="w-full max-w-md">
		<Card>
			<form {...loginUser}>
				<CardHeader class="mb-4 text-center">
					<CardTitle>Sign In</CardTitle>
				</CardHeader>

				<CardContent class="space-y-5">
					<!-- Global errors -->
					{#each loginUser.fields.allIssues() as issue (issue.message)}
						<div
							role="alert"
							class="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
						>
							{issue.message}
						</div>
					{/each}

					<!-- Email -->
					<div class="space-y-2">
						<Label for="email">Email address</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							autocomplete="email"
							{...email.as('text')}
						/>
						{#each email.issues() as issue (issue.message)}
							<p class="text-xs text-destructive">{issue.message}</p>
						{/each}
					</div>

					<!-- Password -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="_password">Password</Label>
							<a
								href={resolve('/forgot-password')}
								class="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
							>
								Forgot password?
							</a>
						</div>
						<Input
							id="_password"
							placeholder="••••••••"
							autocomplete="current-password"
							{..._password.as('password')}
						/>
						{#each _password.issues() as issue (issue.message)}
							<p class="text-xs text-destructive">{issue.message}</p>
						{/each}
					</div>

					<!-- Remember me -->
					<div class="mb-4 flex items-center gap-2.5">
						<Checkbox id="remember" bind:checked={rememberMe} />
						<Label for="remember" class="cursor-pointer font-normal text-muted-foreground">
							Remember me
						</Label>
					</div>
				</CardContent>

				<CardFooter class="flex flex-col gap-4">
					<Button type="submit" size="lg">Sign In</Button>
					<p class="text-center text-sm text-muted-foreground">
						Don't have an account?
						<a
							href={resolve('/signup')}
							class="font-medium text-primary underline-offset-2 hover:underline"
						>
							Create one
						</a>
					</p>
				</CardFooter>
			</form>
		</Card>
	</div>
</div>
