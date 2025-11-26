<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	let copied = $state(false);

	async function copyToClipboard(e: MouseEvent) {
		e.preventDefault();
		navigator.clipboard.writeText(`${window.location.origin}/calendar`);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1200);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style global>
		@import 'style.css';
	</style>
</svelte:head>

<header>
	<a class="name" href="/">CAL72</a>
	<nav>
		<a href="/">Calendar</a>
		<a href="/events">Events</a>
		<a href="/clubs">Clubs</a>
	</nav>
	<p class="subscriptionlink">
		Subscription URL: <a href="/calendar" onclick={copyToClipboard}>
			/calendar
			{#if copied}
				<span class="tooltip">copied</span>
			{/if}
		</a>
	</p>
</header>

{@render children()}
