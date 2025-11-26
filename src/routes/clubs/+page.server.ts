import { getAllClubs } from "$lib/server/db/events";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	return {
		clubs: await getAllClubs()
	};
}
