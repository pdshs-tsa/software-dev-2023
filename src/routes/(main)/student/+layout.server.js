import database from "../../../../database.js";
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

    const classdata = await database.getClassFromUsername(user.username);
    const data = classdata.students.find((element) => {
        return element.username === user.username;

    });

    return {
        user: user,
        class: data
    }
}