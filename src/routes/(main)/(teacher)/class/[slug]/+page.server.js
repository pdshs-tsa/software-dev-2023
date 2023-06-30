import database from "../../../../../../database.js";
import {invalid, redirect, error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, params, cookies }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);
    const classData = await database.getClassFromCode(params.slug);
    if (!(user.class.includes(classData.code))){
        throw new error(403, "You're not allowed to view this home.");
    }

    const assigned = [];
    for (const data of classData.assigned){
        const set = await database.getSet(data.uuid);
        assigned.push({
            uuid: data,
            set: set,
            attempts: await database.getStudentAttempts(classData.code, data)
        });
    }

    classData.students.map(async (e) => {
        for (let i = 0; i < e.assignments.length; i++) {
            let temp = e.assignments[i];
            temp.name = (await database.getSet(temp.uuid)).title;
            e.assignments[i] = temp;
        }
    })

    return {data: classData, assigned: assigned};
}