import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	return {
		date: url.searchParams.get('date') || null
	};
}
