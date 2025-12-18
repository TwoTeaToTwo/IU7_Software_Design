import type { PageLoad } from "./$types.d.ts";

export const load: PageLoad = ({ url }) => {
	return {
		query: url.searchParams.get("query"),
	};
};
