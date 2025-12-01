// Locale configuration for English with German conventions
export const APP_LOCALE = 'en-DE';

/**
 * Formats an event timespan with smart same-day detection
 * @param start - ISO 8601 date string for event start
 * @param end - ISO 8601 date string for event end
 * @param compact - Use compact format (for lists) or verbose format (for details)
 * @returns Formatted timespan string
 */
export function formatEventTimespan(start: string, end: string, compact = false): string {
	const startDate = new Date(start);
	const endDate = new Date(end);

	const isSameDay = startDate.toDateString() === endDate.toDateString();

	if (compact) {
		// Compact format for event lists
		const dateOpts: Intl.DateTimeFormatOptions = {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		};
		const timeOpts: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false // 24-hour format
		};

		if (isSameDay) {
			// Same day: "Mon, Dec 1, 14:30 - 17:00"
			return `${startDate.toLocaleDateString(APP_LOCALE, dateOpts)}, ${startDate.toLocaleTimeString(APP_LOCALE, timeOpts)} - ${endDate.toLocaleTimeString(APP_LOCALE, timeOpts)}`;
		} else {
			// Multi-day: "Mon, Dec 1, 14:30 - Tue, Dec 2, 17:00"
			return `${startDate.toLocaleDateString(APP_LOCALE, dateOpts)}, ${startDate.toLocaleTimeString(APP_LOCALE, timeOpts)} - ${endDate.toLocaleDateString(APP_LOCALE, dateOpts)}, ${endDate.toLocaleTimeString(APP_LOCALE, timeOpts)}`;
		}
	} else {
		// Verbose format for event details
		const dateOpts: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		const timeOpts: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		};

		if (isSameDay) {
			// Same day: "Monday, 1 December 2025 from 14:30 to 17:00"
			return `${startDate.toLocaleDateString(APP_LOCALE, dateOpts)} from ${startDate.toLocaleTimeString(APP_LOCALE, timeOpts)} to ${endDate.toLocaleTimeString(APP_LOCALE, timeOpts)}`;
		} else {
			// Multi-day: "Monday, 1 December 2025, 14:30 - Tuesday, 2 December 2025, 17:00"
			return `${startDate.toLocaleDateString(APP_LOCALE, dateOpts)}, ${startDate.toLocaleTimeString(APP_LOCALE, timeOpts)} - ${endDate.toLocaleDateString(APP_LOCALE, dateOpts)}, ${endDate.toLocaleTimeString(APP_LOCALE, timeOpts)}`;
		}
	}
}

/**
 * Calculates the duration between two dates
 * @param start - ISO 8601 date string for event start
 * @param end - ISO 8601 date string for event end
 * @returns Formatted duration string (e.g., "2h 30min")
 */
export function formatDuration(start: string, end: string): string {
	const startDate = new Date(start);
	const endDate = new Date(end);

	const durationMs = endDate.getTime() - startDate.getTime();
	const hours = Math.floor(durationMs / (1000 * 60 * 60));
	const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

	if (hours > 0 && minutes > 0) {
		return `${hours}h ${minutes}min`;
	} else if (hours > 0) {
		return `${hours}h`;
	} else {
		return `${minutes}min`;
	}
}
