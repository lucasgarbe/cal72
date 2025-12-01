<script lang="ts">
	import type { PageProps } from './$types';
	import ConfirmationButton from '$lib/components/ConfirmationButton.svelte';

	let { data }: PageProps = $props();

	const startDate = new Date(data.event?.start).toLocaleString();
	const endDate = new Date(data.event?.end).toLocaleString();
</script>

<main class="event-details">
	<h1>{data.event?.title}</h1>

	{#if data.club}
		<div class="event-details__club" style:background-color={data.club.color}>
			Club: {data.club.name}
		</div>
	{/if}

	<p>
		<time datetime={data.event?.start}>{startDate}</time>
		-
		<time datetime={data.event?.end}>{endDate}</time>
	</p>
	<p>{data.event?.description}</p>

	<div class="event-details__actions">
		<a class="button" href={`/events/${data.event?.id}/edit`}>Edit</a>
		<ConfirmationButton message="Are you sure you want to delete this event?" action="?/delete">
			Delete Event
		</ConfirmationButton>
	</div>

	<a href="/events">Back to all events</a>
</main>
