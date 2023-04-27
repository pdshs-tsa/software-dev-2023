import database from "../../../../../database.js";
import {redirect} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    await database.destroySession(cookies.get('sessionid'));
    cookies.delete('/sessionid', {path: "/"});
    throw new redirect('303', '/login');
}