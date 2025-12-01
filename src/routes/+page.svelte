<script lang="ts">
	import { goto } from '$app/navigation';
	import type { LayoutProps } from './$types';
	import { Calendar, DayGrid, TimeGrid, Interaction } from '@event-calendar/core';

	let { data }: LayoutProps = $props();

	let options = $derived({
		view: 'dayGridMonth',
		events: data.events.map((event: any) => ({
			...event,
			backgroundColor: event.club?.color || undefined,
			textColor: 'black'
		})),
		firstDay: 1,
		dateClick: (info: any) => {
			console.log(`Clicked on date: ${JSON.stringify(info.date)}`);
			goto(`/create?date=${info.dateStr}`);
		},
		eventClick: (info: any) => {
			console.log('Event clicked', info.event);
			goto(`/events/${info?.event?.id}`);
		}
	});
</script>

<main class="calendar">
	<div class="viewcontroll">
		<button onclick={() => (options.view = 'dayGridMonth')}>Month</button>
		<button onclick={() => (options.view = 'timeGridWeek')}>Week</button>
	</div>

	<Calendar plugins={[DayGrid, TimeGrid, Interaction]} {options} />
</main>
