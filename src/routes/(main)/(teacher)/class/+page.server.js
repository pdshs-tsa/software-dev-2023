import database from "../../../../../database.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);
    const classList = await database.getClassesFromUsername(user.username);


    return {classes: classList.sort((e, f) => {
            if (e.students.length > f.students.length) {
                return -1;
            } else{
                return 1;
            }
    })};
}