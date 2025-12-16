import { getAllEvents } from '$lib/server/db/events';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	console.log('Received GET request on +server.ts');

	const ical = await generateICal();
	return new Response(ical, {
		headers: {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Cache-Control': 'no-cache, must-revalidate',
			'Content-Disposition': 'attachment; filename="calendar.ics"'
		}
	});
};

async function generateICal() {
	const events = await getAllEvents();

	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//CAL72//Shared Calendar//EN',
		'CALSCALE:GREGORIAN',
		'X-WR-CALNAME:Shared Calendar',
		'X-WR-TIMEZONE:Europe/Berlin',
		'X-WR-CALDESC:Shared Calendar for AL72',
		'BEGIN:VTIMEZONE',
		'TZID:Europe/Berlin',
		'BEGIN:DAYLIGHT',
		'TZOFFSETFROM:+0100',
		'TZOFFSETTO:+0200',
		'TZNAME:CEST',
		'DTSTART:19700329T020000',
		'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
		'END:DAYLIGHT',
		'BEGIN:STANDARD',
		'TZOFFSETFROM:+0200',
		'TZOFFSETTO:+0100',
		'TZNAME:CET',
		'DTSTART:19701025T030000',
		'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
		'END:STANDARD',
		'END:VTIMEZONE'
	];

	events.forEach((event) => {
		// Format datetime string for iCalendar using standard Date functions
		const formatDateTime = (dateStr: string) => {
			const date = new Date(dateStr);

			// Format as YYYYMMDDTHHMMSS
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			const seconds = String(date.getSeconds()).padStart(2, '0');

			return `${year}${month}${day}T${hours}${minutes}${seconds}`;
		};

		lines.push('BEGIN:VEVENT');
		lines.push(`UID:${event.id}@cal72`);
		lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
		lines.push(`DTSTART;TZID=Europe/Berlin:${formatDateTime(event.start)}`);
		lines.push(`DTEND;TZID=Europe/Berlin:${formatDateTime(event.end)}`);
		lines.push(`SUMMARY:${event.title}`);
		lines.push(`DESCRIPTION:${event.description}`);
		lines.push('END:VEVENT');
	});

	lines.push('END:VCALENDAR');

	return lines.join('\r\n');
}
