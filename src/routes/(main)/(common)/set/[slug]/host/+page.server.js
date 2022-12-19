import database from "../../../../../../../database.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params }) {
    const set = await database.getSet(params.slug);
    const user = await database.getUserFromSession(cookies.get('sessionid'));
    if (set === null) throw new error(404, "Set does not exist")
    return {
        user: user,
        set: set
    };
}