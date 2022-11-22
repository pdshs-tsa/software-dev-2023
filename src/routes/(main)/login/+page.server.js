import {invalid, redirect} from "@sveltejs/kit";
import database from "/src/libs/server/database.js"

/** @type {import('./$types').Actions} */
export const actions = {
    default: async(event) => {
        const data = await event.request.formData();
        const username = data.get('username');
        const password = data.get('password');
        if (!username || !password) return invalid(400, {error: "empty"});

        if (!(await database.checkIfUserExists(username))) return invalid(404, {error: "userunknown"});
        if (!(await database.checkPassword(username, password))) return  invalid(403, {error: "denied"});

        event.cookies.set('sessionid', await database.generateSession(username), { path: '/' });
        throw redirect(302, '/home');
    }
}