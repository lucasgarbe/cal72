<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
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
	</nav>
	<p>
		Subscription URL: <a
			href="/calendar"
			onclick={(e) => {
				e.preventDefault();
				navigator.clipboard.writeText(`${window.location}calendar`);
			}}>/calendar</a
		>
	</p>
</header>

{@render children()}
