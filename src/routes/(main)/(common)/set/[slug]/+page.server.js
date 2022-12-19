import database from "../../../../../../database.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const set = await database.getSet(params.slug);
    return {
        set: set
    };
}