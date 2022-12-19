import database from "../../../../../database.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
    const set = await database.getSet(url.searchParams.get('set'));
    let code = '';
    let live = false;
    if (url.searchParams.get('code') !== null) {
        live = true;
        code = url.searchParams.get('code');
    }
    if (set === null) throw new error(404, "Set does not exist")
    return {
        set: set,
        live: live,
        code: code
    };
}