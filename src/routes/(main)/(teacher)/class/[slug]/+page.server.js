import database from "../../../../../libs/server/database.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);
    const classData = await database.getClassFromCode(params.slug);
    if (!(user.class === classData.code)){
        throw new error(403, "You're not allowed to view this class.");
    }

    return {data: classData};
}