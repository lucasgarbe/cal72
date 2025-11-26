<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main class="club-details">
	<h1>{data.club.name}</h1>
	<div class="club-details__color" style:background-color={data.club.color}>
		Color: {data.club.color}
	</div>
	<a href={`/clubs/${data.club.id}/edit`}>Edit</a>
</main>
