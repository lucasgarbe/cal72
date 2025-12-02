<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { Calendar, DayGrid, TimeGrid, Interaction } from '@event-calendar/core';

	let { data }: { data: PageData } = $props();

	let currentView = $state('dayGridMonth');
	let calendarDate = $state(new Date());

	function isMobile() {
		return window.matchMedia('(max-width: 768px)').matches;
	}

	let options = $derived({
		view: currentView,
		date: calendarDate,
		dayMaxEvents: true,
		moreLinkContent: (arg: any) => `+${arg.num}`,
		events: data.events.map((event: any) => ({
			...event,
			backgroundColor: event.club?.color || undefined,
			textColor: 'black'
		})),
		firstDay: 1,
		dateClick: (info: any) => {
			console.log(`Clicked on date: ${JSON.stringify(info.date)}`);

			if (isMobile() && currentView === 'dayGridMonth') {
				calendarDate = info.date;
				currentView = 'timeGridDay';
			} else {
				goto(`/create?date=${info.dateStr}`);
			}
		},
		eventClick: (info: any) => {
			console.log('Event clicked', info.event);
			goto(`/events/${info?.event?.id}`);
		}
	});

	function setView(view: string) {
		currentView = view;
	}
</script>

<main class="calendar">
	<div class="viewcontroll">
		<button class:active={currentView === 'dayGridMonth'} onclick={() => setView('dayGridMonth')}>
			Month
		</button>
		<button class:active={currentView === 'timeGridWeek'} onclick={() => setView('timeGridWeek')}>
			Week
		</button>
		<button class:active={currentView === 'timeGridDay'} onclick={() => setView('timeGridDay')}>
			Day
		</button>
	</div>

	<Calendar plugins={[DayGrid, TimeGrid, Interaction]} {options} />
</main>
