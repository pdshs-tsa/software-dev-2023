import database from "../../../../../../database.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const classCode = url.searchParams.get('class');
    const username = url.searchParams.get('username');
    const set = url.searchParams.get('set');
    const score = url.searchParams.get('score');

    console.log(url);

    await database.addAssignmentAttempt(username, classCode, set, score);

    return new Response('');
}