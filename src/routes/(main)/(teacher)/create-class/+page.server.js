import database from "../../../../../database.js";
import {redirect} from "@sveltejs/kit";

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({cookies, request}) => {
        const sessionid = cookies.get('sessionid');
        const user = await database.getUserFromSession(sessionid);
        const formData = await request.formData();
        const className = await formData.get('name');

        let random = 0;
        while (random === 0){
            random = Math.random();
        }

        const code = await database.createClass(user, className);
        throw redirect(303, `/class/${code}`);
    }
}