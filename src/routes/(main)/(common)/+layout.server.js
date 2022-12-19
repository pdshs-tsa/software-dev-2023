import database from "../../../../database.js";

export async function load({ cookies }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);

    if (user == null) {
        return {type: 'none', username: ''}
    }

    return {type: user.accounttype, username: user.username};
}