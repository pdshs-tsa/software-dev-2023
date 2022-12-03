import database from "../../../../libs/server/database.js";
import {redirect} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);
    const classData = await database.getClassFromCode(user.class);

    if (classData == null) {
        throw redirect(303, '/create-class');
    } else {
        throw redirect(303, `/class/${classData.code}`);
    }
}