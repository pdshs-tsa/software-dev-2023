import database from "../../../libs/server/database.js";
import {redirect} from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);

    if (user == null){
        throw redirect(303, '/login');
    }

    if (user.accounttype === 'Teacher'){
        throw redirect(303, '/home');
    }

    return {
        user: user
    }
}