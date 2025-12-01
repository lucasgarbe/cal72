import { getEvent, updateEvent, getAllClubs } from '$lib/server/db/events';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		event: await getEvent(params.id),
		clubs: await getAllClubs()
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const start = formData.get('start') as string;
		const end = formData.get('end') as string;
		const clubId = formData.get('club') as string;
		const id = event.params.id;

		if (!title || !start || !end) {
			console.error('Form submission error: Missing fields');
			return fail(400, {
				success: false,
				message: 'Missing required fields.',
				title,
				description,
				start,
				end
			});
		}

		if (new Date(start) >= new Date(end)) {
			console.error('Form submission error: Start date must be before end date');
			return fail(400, {
				success: false,
				message: 'Start date must be before end date.',
				title,
				description,
				start,
				end
			});
		}

		try {
			console.log('Received event data:', {
				title,
				description,
				start,
				end,
				club: clubId
			});

			updateEvent({
				id,
				title,
				description,
				start,
				end,
				club: clubId ? parseInt(clubId) : null
			});

			return { success: true, message: `Event updated successfully: ${title}` };
		} catch (error) {
			console.error('Error updating event:', error);
			return fail(400, {
				success: false,
				message: 'Failed to update event.',
				title,
				description,
				start,
				end
			});
		}
	}
};
