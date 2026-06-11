import { getFutureEvents, getPastEvents } from "$lib/server/db/events";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const [futureEvents, pastEvents] = await Promise.all([
		getFutureEvents(),
		getPastEvents()
	]);

	return {
		futureEvents,
		pastEvents
	};
}
