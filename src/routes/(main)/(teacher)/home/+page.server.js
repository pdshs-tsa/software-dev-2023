import database from "../../../../../database.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const user = await database.getUserFromSession(cookies.get('sessionid'));
    const sets = user.sets;
    let newsets = [];

    if (sets != null){
        for (const i of sets) {
            newsets.push(await database.getSet(i));
        }
    }

    newsets = newsets.sort((a, b) => {
        return b.timestamp - a.timestamp;
    });

    let classes = [];
    for (const code of user.class) {
        classes.push(await database.getClassFromCode(code));
    }

    return {
        sets: newsets,
        classes: classes
    }
}