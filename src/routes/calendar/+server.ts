import { getAllEvents } from "$lib/server/db/events";
import type { RequestHandler } from "@sveltejs/kit";

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
	];

	events.forEach(event => {
		lines.push('BEGIN:VEVENT');
		lines.push(`UID:${event.id}@cal72`);
		lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
		lines.push(`DTSTART:${new Date(event.start).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
		lines.push(`DTEND:${new Date(event.end).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
		lines.push(`SUMMARY:${event.title}`);
		lines.push(`DESCRIPTION:${event.description}`);
		lines.push('END:VEVENT');
	});

	lines.push('END:VCALENDAR');

	return lines.join('\r\n');
}
