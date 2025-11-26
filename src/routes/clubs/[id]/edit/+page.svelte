<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main class="club-edit">
	<h1>Edit Club</h1>
	<form method="POST">
		<label>
			Name
			<input type="text" name="name" id="name" value={data.club?.name} />
		</label>
		<label>
			Color
			<input type="color" name="color" id="color" value={data.club?.color} />
		</label>

		<button class="success" type="submit">Save Club</button>
	</form>
</main>
