import database from "../../../../../database.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
    const set = await database.getSet(url.searchParams.get('set'));
    let code = '';
    let live = false;
    let hw = false;
    let classCode = "";
    if (url.searchParams.get('code') !== null) {
        live = true;
        code = url.searchParams.get('code');
    }
    if (url.searchParams.get("class") !== null) {
        hw = true;
        classCode = url.searchParams.get('class');
    }
    if (set === null) throw new error(404, "Set does not exist")
    return {
        set: set,
        live: live,
        homework: hw,
        code: code,
        class: classCode
    };
}