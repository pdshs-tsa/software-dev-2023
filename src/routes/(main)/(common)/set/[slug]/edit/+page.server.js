import database from "../../../../../../../database.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params }) {
    const set = await database.getSet(params.slug);
    const user = await database.getUserFromSession(cookies.get('sessionid'));
    if (set === null) throw new error(404, "Set does not exist");
    if (set.author !== user.username) throw new error(403, "You can't edit sets that aren't your own");
    return {
        user: user,
        set: set
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({cookies, request}) => {
        const formData = await request.formData();
        const title = await formData.get('name');
        const description = await formData.get('desc');
        const data = await formData.get('components');
        const uuid = await formData.get('uuid');
        const session = await cookies.get('sessionid');
        const user = await database.getUserFromSession(session);

        const setData = {
            title: title,
            desc: description,
            data: JSON.parse(data)
        }

        const set = await database.updateSet(user.username, uuid, setData);

        return {success: true, set: set};
    }
}