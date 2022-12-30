import database from "../../../../../../database.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const user = await database.getUser(params.slug);
    let sets = [];
    for (const set of user.sets) {
        sets.push(await database.getSet(set));
    }
    return {
        user: user,
        sets: sets
    };
}