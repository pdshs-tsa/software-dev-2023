import database from "../../../../libs/server/database.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({url }) {
    let q = url.searchParams.get('q');
    if (q == null || q === '') return { q };

    const arr = await database.searchSets(q);
    return { arr };
}