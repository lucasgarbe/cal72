import { deleteEvent, getEvent, getClub } from '$lib/server/db/events';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const event = await getEvent(params.id);
	let club = null;

	if (event?.club) {
		club = await getClub(event.club.toString());
	}

	return {
		event,
		club
	};
};

export const actions: Actions = {
	delete: async ({ params }) => {
		try {
			await deleteEvent(parseInt(params.id));
			console.log(`Event ${params.id} deleted`);
		} catch (error) {
			console.error(`Error deleting Event ${params.id}`);
			return fail(400, { success: false, message: `Error deleting Event ${params.id}` });
		}
		throw redirect(303, '/events');
	}
};
