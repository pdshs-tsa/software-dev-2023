import database from "../../../../../../database.js";
import {invalid, redirect, error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);
    const classData = await database.getClassFromCode(params.slug);
    if (!(user.class === classData.code)){
        throw new error(403, "You're not allowed to view this home.");
    }

    const assigned = [];
    for (const data of classData.assigned){
        const set = await database.getSet(data);
        assigned.push({
            uuid: data,
            set: set
        });
    }

    return {data: classData, assigned: assigned};
}