import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createEvent } from '$lib/server/db/events';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const start = formData.get('start') as string;
		const end = formData.get('end') as string;


		if (!title || !start || !end) {
			console.error('Form submission error: Missing fields');
			return fail(400, { success: false, message: 'Missing field.', title, description, start, end });
		}

		if (new Date(start) >= new Date(end)) {
			console.error('Form submission error: Start date must be before end date');
			return fail(400, { success: false, message: 'Start date must be before end date.', title, description, start, end });
		}

		try {
			console.log('Received event data:', {
				title,
				description,
				start,
				end
			});

			createEvent({
				title,
				description,
				start: start,
				end: end,
				createdAt: Date.now()
			});

			return { success: true, message: `Event created successfully: ${title}` };
		} catch (error) {
			console.error('Error creating event:', error);
			return fail(400, { success: false, message: 'Failed to create event.', title, description, start, end });
		}
	}
};
