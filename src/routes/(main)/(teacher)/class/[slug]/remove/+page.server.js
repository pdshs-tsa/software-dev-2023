import database from "../../../../../../../database.js";
import {error, redirect} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies, url }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);

    const set = url.searchParams.get('set');

    if (!(user.class.includes(params.slug))){
        throw new error(403, "You're not allowed to view this home.");
    }

    if (!(user.accounttype === 'Teacher')) {
        throw new error(403, "You're not authorized to edit this class.")
    }

    if (set != null){
        await database.removeAssignment(params.slug, set);
        throw redirect(307, `/class`);
    }
}
