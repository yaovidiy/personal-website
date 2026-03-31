<script lang="ts">
	import { registerUser } from '$lib/remotes/auth.remote';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { resolve } from '$app/paths';

	const { name, email, _password } = registerUser.fields;
	let agreedToTerms = $state(false);
</script>

<svelte:head>
	<title>Create account</title>
	<meta name="description" content="Sign up for a new account." />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-12">
	<div class="w-full max-w-md">
		<!-- Logo / brand mark -->
		<Card>
			<form {...registerUser}>
				<CardHeader class="mb-4 text-center">
					<CardTitle>Sign up</CardTitle>
				</CardHeader>

				<CardContent class="space-y-5">
					<!-- Global error -->
					{#each registerUser.fields.allIssues() as issue (issue.message)}
						<div class="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
							{issue.message}
						</div>
					{/each}

					<!-- Full name -->
					<div class="space-y-2">
						<Label for="name">Full name</Label>
						<Input
							id="name"
							type="text"
							placeholder="Jane Doe"
							autocomplete="name"
							{...name.as('text')}
						/>
						{#each name.issues() as issue (issue.message)}
							<p class="text-xs text-destructive">{issue.message}</p>
						{/each}
					</div>

					<!-- Email -->
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="jane@example.com"
							autocomplete="email"
							{...email.as('text')}
						/>
						{#each email.issues() as issue (issue.message)}
							<p class="text-xs text-destructive">{issue.message}</p>
						{/each}
					</div>

					<!-- Password -->
					<div class="space-y-2">
						<Label for="_password">Password</Label>
						<Input
							id="_password"
							placeholder="At least 8 characters"
							autocomplete="new-password"
							{..._password.as('password')}
						/>
						{#each _password.issues() as issue (issue.message)}
							<p class="text-xs text-destructive">{issue.message}</p>
						{/each}
					</div>

					<!-- Terms agreement -->
					<div class="mb-4 flex items-start gap-3">
						<Checkbox id="terms" bind:checked={agreedToTerms} class="mt-0.5" />
						<Label
							for="terms"
							class="cursor-pointer text-sm leading-snug font-normal text-muted-foreground"
						>
							I agree to the
							<a
								href={resolve('/terms')}
								class="text-primary underline underline-offset-2 hover:opacity-80"
								>Terms of Service</a
							>
							and
							<a
								href={resolve('/privacy')}
								class="text-primary underline underline-offset-2 hover:opacity-80">Privacy Policy</a
							>.
						</Label>
					</div>
				</CardContent>

				<CardFooter class="flex flex-col gap-4">
					<Button type="submit" size="lg" disabled={!agreedToTerms}>Create account</Button>
					<p class="text-center text-sm text-muted-foreground">
						Already have an account?
						<a
							href={resolve('/login')}
							class="font-medium text-primary underline underline-offset-2 hover:opacity-80"
							>Sign in</a
						>
					</p>
				</CardFooter>
			</form>
		</Card>
	</div>
</div>
