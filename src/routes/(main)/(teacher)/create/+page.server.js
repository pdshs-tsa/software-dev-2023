/** @type {import('./$types').Actions} */
import database from "../../../../libs/server/database.js";

export const actions = {
    default: async ({cookies, request}) => {
        const formData = await request.formData();
        const title = await formData.get('name');
        const description = await formData.get('desc');
        const data = await formData.get('components');
        const session = await cookies.get('sessionid');
        const user = await database.getUserFromSession(session);

        const setData = {
            title: title,
            desc: description,
            data: JSON.parse(data)
        }
        const set = await database.createSet(user.username, setData);

        return {success: true, set: set};
    }
}