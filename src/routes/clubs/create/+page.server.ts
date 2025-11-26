import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createClub } from '$lib/server/db/events';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get("name") as string;
		const color = formData.get("color") as string;


		if (!name || !color) {
			console.error('Form submission error: Missing fields');
			return fail(400, { success: false, message: 'Missing field.', name, color });
		}

		try {
			console.log('Received event data:', {
				name,
				color,
			});

			createClub({
				name,
				color,
			});

			// return { success: true, message: `Club created successfully: ${name}` };
		} catch (error) {
			console.error('Error creating club:', error);
			return fail(400, { success: false, message: 'Failed to create club.', name, color });
		}
		throw redirect(303, "/clubs");
	}
};
