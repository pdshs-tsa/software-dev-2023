import { redirect } from "@sveltejs/kit";
import database from "../../../../database.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
    let cookie = cookies.get('admin');
    if (typeof cookie !== 'string') throw redirect(300, '/admin');
    cookie = Number(cookie);
    if (cookie > Date.now()) throw redirect(300, '/admin');
    if (cookie < Date.now() - 86400000) throw redirect(300, '/admin');

    const sets = await database.fetchSetTable();
    const classes = await database.fetchClassTable();
    const sessions = await database.fetchSessionTable();
    const users = await database.fetchUserTable();

    return {
        sets: sets,
        classes: classes,
        sessions: sessions,
        users: users
    }
}