import database from "../../../../../database.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({url }) {
    let q = url.searchParams.get('q');
    if (q == null || q === '') {
        const arr = await database.getRandomSets(10);
        return { q, arr };
    }

    const arr = await database.searchSets(q);
    return { q, arr };
}