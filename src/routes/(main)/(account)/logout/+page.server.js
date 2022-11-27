import database from "../../../../libs/server/database.js";
import {redirect} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    await database.destroySession(cookies.get('sessionid'));
    throw new redirect('303', '/login');
}