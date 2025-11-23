<script lang="ts">
	import { goto } from '$app/navigation';
	import type { LayoutProps } from './$types';

	let { data }: LayoutProps = $props();
</script>

<section class="event-list">
	<h1>Event List</h1>
	{#each data.events as event}
		<article
			class="event-list__item"
			tabindex="-1"
			onclick={() => goto(`/events/${event.id}`)}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					goto(`/events/&{event.id}`);
				}
			}}
		>
			<h2><a href={`/events/${event.id}`}>{event.title}</a></h2>
			<p><time datetime={event.start}>Starts: {event.start}</time></p>
			<p><time datetime={event.end}>Ends: {event.end}</time></p>
			<p>{event.description}</p>
		</article>
	{/each}
</section>
