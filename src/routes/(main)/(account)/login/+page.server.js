import {fail, redirect} from "@sveltejs/kit";
import database from "/database.js"

/** @type {import('./$types').Actions} */
export const actions = {
    default: async(event) => {
        const data = await event.request.formData();
        const username = data.get('username');
        const password = data.get('password');
        if (!username || !password) return fail(400, {error: "empty"});

        if (!(await database.checkIfUserExists(username))) return fail(404, {error: "userunknown"});
        if (!(await database.checkPassword(username, password))) return fail(403, {error: "denied"});

        event.cookies.set('sessionid', await database.generateSession(username), { path: '/' });
        throw redirect(302, '/home');
    }
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    const user = await database.getUserFromSession(cookies.get('sessionid'));
    if (user != null) {
        if (user.accounttype === 'Teacher') {
            throw new redirect('303', '/home');
        } else {
            throw new redirect('303', '/student/home');
        }

    }
}