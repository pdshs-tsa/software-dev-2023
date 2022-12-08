import database from "../../../libs/server/database.js";

export async function load({ cookies }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);

    if (user == null) {
        return {type: 'none'}
    }

    return {type: user.accounttype};
}