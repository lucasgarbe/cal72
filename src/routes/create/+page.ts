import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, data }) => {
	return {
		...data,
		date: url.searchParams.get('date') || null
	};
};
