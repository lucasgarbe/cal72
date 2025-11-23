import { getAllEvents } from "$lib/server/db/events";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	return {
		events: await getAllEvents()
	};
}
