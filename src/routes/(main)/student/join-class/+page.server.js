import {fail, redirect} from "@sveltejs/kit";
import database from "/database.js"

/** @type {import('./$types').Actions} */
export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const clazz = data.get('class-code');
        if (!clazz || await database.getClassFromCode(clazz) === null) return fail(400, { error: "empty" });
        const cookie = event.cookies.get('sessionid');
        const user = await database.getUserFromSession(cookie);
        await database.addStudentToClass(user.username, clazz);
        throw redirect(302, '/student/home');
    }
}