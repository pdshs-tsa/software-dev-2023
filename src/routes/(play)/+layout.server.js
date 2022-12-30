import database from "../../../database.js";

export async function load({ cookies }) {
    const sessionid = cookies.get('sessionid');
    const user = await database.getUserFromSession(sessionid);

    if (user == null) {
        return {user: null}
    }

    return {user: user};
}