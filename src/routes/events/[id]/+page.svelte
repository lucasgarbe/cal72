<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data }: LayoutProps = $props();

	const startDate = new Date(data.event?.start).toLocaleString();
	const endDate = new Date(data.event?.end).toLocaleString();
</script>

<section class="event-details">
	<h1>{data.event?.title}</h1>
	<p>
		<time datetime={data.event?.start}>{startDate}</time>
		-
		<time datetime={data.event?.end}>{endDate}</time>
	</p>
	<p>{data.event?.description}</p>
	<a href="/events">Back to all events</a>
</section>
