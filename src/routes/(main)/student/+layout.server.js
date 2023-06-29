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

    const classList = await database.getClassesFromUsername(user.username);
    const assignmentList = await database.getStudentAssignedSets(user.username, user.class);

    assignmentList.map(async (e) => {
        e.set = await database.getSet(e.data.uuid);
    })

    assignmentList.sort((a, b) => {
        if (a.class > b.class) return 1;
        return -1;
    })

    return {
        user: user,
        class: classList,
        assignments: assignmentList
    }
}