import database from "../../../../../../../database.js";
import {error, redirect} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies, url }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);
    const classData = await database.getClassFromCode(params.slug);

    const set = url.searchParams.get('set');
    if (set != null){
        const setdata = await database.getSet(set);
        await database.assignSet(user.class, setdata.name, set);
        throw redirect(303, `/class/${user.class}`);
    }

    const q = url.searchParams.get('q');
    let arr;
    if (!(q == null || q === '')) {
        arr = await database.searchSets(q)
    }

    if (!(user.class.includes(classData.code))){
        throw new error(403, "You're not allowed to view this home.");
    }

    const sets = user.sets;
    let newsets = [];

    if (sets != null){
        for (const i of sets) {
            newsets.push(await database.getSet(i));
        }
    }

    return {classdata: classData, sets: newsets, arr: arr};
}
