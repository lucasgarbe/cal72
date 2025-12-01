<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { formatEventTimespan } from '$lib/utils/dateFormat';

	let { data }: { data: PageData } = $props();
</script>

<main class="event-list">
	<h1>Event List</h1>
	{#each data.events as event}
		<article
			class="event-list__item"
			tabindex="-1"
			onclick={() => goto(`/events/${event.id}`)}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					goto(`/events/${event.id}`);
				}
			}}
		>
			<div class="event-list__item__header">
				<h2><a href={`/events/${event.id}`}>{event.title}</a></h2>
				{#if event.club}
					<div class="event-list__club tag" style:border-color={event.club.color}>
						{event.club.name}
					</div>
				{/if}
			</div>
			<p><time datetime={event.start}>{formatEventTimespan(event.start, event.end, true)}</time></p>
		</article>
	{/each}
</main>
