/** @type {import('./$types').LayoutServerLoad} */
export async function load({url }) {
    return {code: url.searchParams.get('code')};
}