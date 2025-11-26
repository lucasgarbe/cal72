import { getClub, updateClub } from "$lib/server/db/events";
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	return {
		club: await getClub(params.id)
	};
};

export const actions: Actions = {
	default: async (event) => {
		console.log(event);
		const formData = await event.request.formData();
		const name = formData.get("name") as string;
		const color = formData.get("color") as string;
		const id = event.params.id;


		if (!name || !color) {
			console.error('Form submission error: Missing fields');
			return fail(400, { success: false, message: 'Missing field.', name, color });
		}

		try {
			console.log('Received event data:', {
				name,
				color,
			});

			updateClub({
				id,
				name,
				color,
			});

			return { success: true, message: `Club created successfully: ${name}` };
		} catch (error) {
			console.error('Error creating club:', error);
			return fail(400, { success: false, message: 'Failed to create club.', name, color });
		}

	}
}
