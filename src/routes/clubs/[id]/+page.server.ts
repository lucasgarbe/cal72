import { deleteClub, getClub } from "$lib/server/db/events";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
	return {
		club: await getClub(params.id)
	};
}

export const actions: Actions = {
	delete: async ({ params }) => {
		try {
			await deleteClub(parseInt(params.id));
			console.log(`Club ${params.id} deleted`);
		} catch (error) {
			console.error(`Error deleting Club ${params.id}`);
			return fail(400, { success: false, message: `Error deleting Club ${params.id}` });
		}
		throw redirect(303, "/clubs");
	}
}
