import { getAllEvents } from '$lib/server/db/events';
import type { RequestHandler } from '@sveltejs/kit';

type CalendarEvent = Awaited<ReturnType<typeof getAllEvents>>[number];

export const GET: RequestHandler = async ({ request }) => {
	const now = new Date();

	// Rolling window: 180 days past to 365 days future
	const rangeStart = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
	const rangeEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

	const events = await getAllEvents(rangeStart, rangeEnd);

	let lastModified = 0;
	for (const e of events) {
		const t = new Date(e.updatedAt || e.createdAt).getTime();
		if (t > lastModified) lastModified = t;
	}
	// HTTP dates have 1-second precision; truncate so the emitted
	// Last-Modified header and the If-Modified-Since comparison stay consistent.
	lastModified = Math.floor(lastModified / 1000) * 1000;
	const lastModifiedDate = new Date(lastModified);

	const body = generateICal(lastModifiedDate, events);
	const etag = `"${await sha1Hex(body)}"`;

	const ifNoneMatch = request.headers.get('if-none-match');
	if (ifNoneMatch === etag) {
		return new Response(null, {
			status: 304,
			headers: { ETag: etag }
		});
	}
	const ifModifiedSince = request.headers.get('if-modified-since');
	if (ifModifiedSince && new Date(ifModifiedSince).getTime() >= lastModified) {
		return new Response(null, {
			status: 304,
			headers: { ETag: etag }
		});
	}

	return new Response(body, {
		headers: {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Cache-Control': 'no-cache',
			'Content-Disposition': 'inline; filename="cal72.ics"',
			'X-Published-TTL': 'PT15M',
			ETag: etag,
			'Last-Modified': lastModifiedDate.toUTCString()
		}
	});
};

async function sha1Hex(text: string): Promise<string> {
	const data = new TextEncoder().encode(text);
	const digest = await crypto.subtle.digest('SHA-1', data);
	return Array.from(new Uint8Array(digest))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

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
		.replace(/\\/g, '\\\\') // Backslash must be escaped first
		.replace(/;/g, '\\;') // Semicolon
		.replace(/,/g, '\\,') // Comma
		.replace(/\n/g, '\\n'); // Newline
}

// Format datetime string for iCalendar (local time without conversion)
function formatDateTime(dateStr: string): string | null {
	const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
	if (!match) return null;

	const [, year, month, day, hours, minutes, seconds] = match;
	const sec = seconds || '00';
	return `${year}${month}${day}T${hours}${minutes}${sec}`;
}

function generateICal(stamp: Date, events: CalendarEvent[]) {
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//CAL72//Shared Calendar//EN',
		'METHOD:PUBLISH',
		'CALSCALE:GREGORIAN',
		'X-WR-CALNAME:Shared Calendar',
		'X-WR-TIMEZONE:Europe/Berlin',
		'X-WR-CALDESC:Shared Calendar for AL72',
		`DTSTAMP:${formatICalTimestamp(stamp)}`,
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

	for (const event of events) {
		if (!event.id || !event.title || !event.start || !event.end) {
			console.warn(`Skipping event with missing fields:`, event.id);
			continue;
		}

		const startFormatted = formatDateTime(event.start);
		const endFormatted = formatDateTime(event.end);

		if (!startFormatted || !endFormatted) {
			console.warn(
				`Skipping event ${event.id} with invalid date format - start: "${event.start}", end: "${event.end}"`
			);
			continue;
		}

		const startDate = new Date(event.start);
		const endDate = new Date(event.end);
		if (startDate >= endDate) {
			console.warn(`Skipping event ${event.id} with start >= end`);
			continue;
		}

		lines.push('BEGIN:VEVENT');
		lines.push(`UID:${event.id}@cal72`);
		lines.push(`DTSTAMP:${formatICalTimestamp(event.updatedAt || event.createdAt)}`);
		lines.push(`SEQUENCE:${event.sequence || 0}`);
		if (event.updatedAt) {
			lines.push(`LAST-MODIFIED:${formatICalTimestamp(new Date(event.updatedAt))}`);
		}
		lines.push(`DTSTART;TZID=Europe/Berlin:${startFormatted}`);
		lines.push(`DTEND;TZID=Europe/Berlin:${endFormatted}`);
		lines.push(
			`SUMMARY:${escapeICalText(event.title)}${event.club ? ' [' + escapeICalText(event.club.name) + ']' : ''}`
		);
		lines.push(`DESCRIPTION:${escapeICalText(event.description)}`);
		lines.push('END:VEVENT');
	}

	lines.push('END:VCALENDAR');

	return lines.map(foldLine).join('\r\n') + '\r\n';
}
