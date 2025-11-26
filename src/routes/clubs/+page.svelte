<script lang="ts">
	import ConfirmationButton from '$lib/components/ConfirmationButton.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main class="club-list">
	<h1>Clubs</h1>

	{#each data.clubs as club}
		<article class="club-list__item" style:background-color={club.color}>
			<h2>{club.name}</h2>
			<div class="club-list__item__actions">
				<a class="button" href={`/clubs/${club.id}/edit`}> Edit </a>
				<ConfirmationButton action="/clubs/{club.id}?/delete">Delete</ConfirmationButton>
			</div>
		</article>
	{/each}

	<a class="club-createlink" href="/clubs/create">Add Club</a>
</main>

<style>
	.club-createlink {
		align-self: flex-end;
	}

	.club-list__item__actions {
		display: flex;
		align-items: center;
		gap: calc(var(--space) / 2);
	}
</style>
