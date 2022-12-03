import database from "../../../../libs/server/database.js";
import {redirect} from "@sveltejs/kit";

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({cookies, request}) => {
        const sessionid = cookies.get('sessionid');
        const user = await database.getUserFromSession(sessionid);
        const formData = await request.formData();
        const classPassword = await formData.get('password');

        let random = 0;
        while (random === 0){
            random = Math.random();
        }

        const code = await database.createClass(user, classPassword);
        throw redirect(303, `/class/${code}`);
    }
}