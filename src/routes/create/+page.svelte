<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<main class="create-event">
	<h1>Create New Event</h1>
	<form method="post">
		{#if form?.success == false}<p class="alert error">{form?.message}</p>{/if}
		{#if form?.success}<p class="alert success">{form?.message}</p>{/if}

		<label>
			Title
			<input
				type="text"
				name="title"
				placeholder="Event title"
				required
				value={form?.title ?? ''}
			/>
		</label>

		<label>
			Description
			<textarea name="description" placeholder="Description of the Event" rows="3"
				>{form?.description ?? ''}</textarea
			>
		</label>

		<div class="create-event__dates">
			<label>
				Start
				<input type="datetime-local" name="start" required value={form?.start ?? data.date ?? ''} />
			</label>
			<label>
				End
				<input type="datetime-local" name="end" required value={form?.end ?? data.date ?? ''} />
			</label>
		</div>

		<label>
			Club (optional)
			<select name="club">
				<option value="">No club</option>
				{#each data.clubs as club}
					<option value={club.id}>
						{club.name}
					</option>
				{/each}
			</select>
		</label>

		<button class="success" type="submit">Create Event</button>
	</form>
</main>
