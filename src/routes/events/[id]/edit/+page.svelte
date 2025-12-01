<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	// Convert ISO string to datetime-local format
	const formatDateTime = (isoString: string) => {
		const date = new Date(isoString);
		return date.toISOString().slice(0, 16);
	};
</script>

<main class="event-edit">
	<h1>Edit Event</h1>
	<form method="POST">
		{#if form?.success == false}<p class="alert error">{form?.message}</p>{/if}
		{#if form?.success}<p class="alert success">{form?.message}</p>{/if}

		<label>
			Title
			<input
				type="text"
				name="title"
				placeholder="Event title"
				required
				value={data.event?.title ?? ''}
			/>
		</label>

		<label>
			Description
			<textarea name="description" placeholder="Description of the Event" rows="3"
				>{data.event?.description ?? ''}</textarea
			>
		</label>

		<div class="create-event__dates">
			<label>
				Start
				<input
					type="datetime-local"
					name="start"
					required
					value={data.event?.start ? formatDateTime(data.event.start) : ''}
				/>
			</label>
			<label>
				End
				<input
					type="datetime-local"
					name="end"
					required
					value={data.event?.end ? formatDateTime(data.event.end) : ''}
				/>
			</label>
		</div>

		<label>
			Club (optional)
			<select name="club">
				<option value="">No club</option>
				{#each data.clubs as club}
					<option value={club.id} selected={data.event?.club === club.id}>
						{club.name}
					</option>
				{/each}
			</select>
		</label>

		<button class="success" type="submit">Save Event</button>
	</form>
</main>
