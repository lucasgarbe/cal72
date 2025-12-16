<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main class="create-club">
	<h1>Create New Club</h1>
	<form method="POST">
		{#if form?.success == false}<p class="alert error">{form?.message}</p>{/if}
		{#if form?.success}<p class="alert success">{form?.message}</p>{/if}

		<label>
			Name
			<input type="text" id="name" name="name" value={form?.name ?? ''} />
		</label>
		<label>
			Color
			<input type="color" id="color" name="color" value={form?.color ?? ''} />
		</label>

		<button class="success" type="submit">Create Club</button>
	</form>
</main>
