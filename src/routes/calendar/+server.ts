import { getAllEvents } from '$lib/server/db/events';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	console.log('Received GET request on +server.ts');

	const ical = await generateICal();
	return new Response(ical, {
		headers: {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Cache-Control': 'private, max-age=300',
			'X-Published-TTL': 'PT15M'
		}
	});
};

// Helper function to format Date to iCal format (YYYYMMDDTHHMMSSZ)
function formatICalTimestamp(date: Date): string {
	return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// Fold long lines per RFC 5545 §3.1 (max 75 octets per line)
function foldLine(line: string): string {
	const encoder = new TextEncoder();
	if (encoder.encode(line).length <= 75) return line;

	const chunks: string[] = [];
	let current = '';
	for (const char of line) {
		const candidate = current + char;
		if (encoder.encode(candidate).length > (chunks.length === 0 ? 75 : 74)) {
			chunks.push(current);
			current = ' ' + char;
		} else {
			current = candidate;
		}
	}
	if (current) chunks.push(current);
	return chunks.join('\r\n');
}

// Helper function to escape special characters per RFC 5545
function escapeICalText(text: string): string {
	if (!text) return '';
	return text
		.replace(/\\/g, '\\\\')  // Backslash must be escaped first
		.replace(/;/g, '\\;')     // Semicolon
		.replace(/,/g, '\\,')     // Comma
		.replace(/\n/g, '\\n');   // Newline
}

// Format datetime string for iCalendar (local time without conversion)
function formatDateTime(dateStr: string): string | null {
	// Parse the ISO string components directly (seconds are optional)
	const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
	if (!match) return null;

	const [_, year, month, day, hours, minutes, seconds] = match;
	const sec = seconds || '00'; // Default to 00 if seconds not provided
	return `${year}${month}${day}T${hours}${minutes}${sec}`;
}

async function generateICal() {
	const allEvents = await getAllEvents();
	const now = new Date();

	// Filter to a reasonable time range: 1 year ago to 2 years ahead
	const rangeStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
	const rangeEnd = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());

	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//CAL72//Shared Calendar//EN',
		'METHOD:PUBLISH',
		'CALSCALE:GREGORIAN',
		'X-WR-CALNAME:Shared Calendar',
		'X-WR-TIMEZONE:Europe/Berlin',
		'X-WR-CALDESC:Shared Calendar for AL72',
		`DTSTAMP:${formatICalTimestamp(now)}`,
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

	for (const event of allEvents) {
		// Validate required fields
		if (!event.id || !event.title || !event.start || !event.end) {
			console.warn(`Skipping event with missing fields:`, event.id);
			continue;
		}

		// Validate and format dates
		const startFormatted = formatDateTime(event.start);
		const endFormatted = formatDateTime(event.end);

		if (!startFormatted || !endFormatted) {
			console.warn(`Skipping event ${event.id} with invalid date format - start: "${event.start}", end: "${event.end}"`);
			continue;
		}

		// Validate start < end
		const startDate = new Date(event.start);
		const endDate = new Date(event.end);
		if (startDate >= endDate) {
			console.warn(`Skipping event ${event.id} with start >= end`);
			continue;
		}

		// Skip events outside the date range
		if (startDate > rangeEnd || endDate < rangeStart) {
			console.log(`Skipping event ${event.id} outside date range`);
			continue;
		}

		lines.push('BEGIN:VEVENT');
		lines.push(`UID:${event.id}@cal72`);
		lines.push(`DTSTAMP:${formatICalTimestamp(now)}`);
		lines.push(`SEQUENCE:${event.sequence || 0}`);
		if (event.updatedAt) {
			lines.push(`LAST-MODIFIED:${formatICalTimestamp(new Date(event.updatedAt))}`);
		}
		lines.push(`DTSTART;TZID=Europe/Berlin:${startFormatted}`);
		lines.push(`DTEND;TZID=Europe/Berlin:${endFormatted}`);
		lines.push(`SUMMARY:${escapeICalText(event.title)}${event.club ? " [" + escapeICalText(event.club.name) + "]" : ""}`);
		lines.push(`DESCRIPTION:${escapeICalText(event.description)}`);
		lines.push('END:VEVENT');
	}

	lines.push('END:VCALENDAR');

	return lines.map(foldLine).join('\r\n') + '\r\n';
}
