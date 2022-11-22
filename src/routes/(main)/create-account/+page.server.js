import {invalid, redirect} from "@sveltejs/kit";
import * as argon2 from "argon2";
import database from "/src/libs/server/database.js";
import {v4 as uuidv4} from 'uuid';

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({request}) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');
        const verifypassword = data.get('verify-password');
        const accounttype = data.get('account-type');
        let classcode = '';

        if (accounttype === "Student"){
            classcode = data.get('class-code');
        }

        if (await database.checkIfUserExists(username)) return invalid(400, {takenUsername: true});

        if (!username) return invalid(400, {missingUsername: true});
        if (!password) return invalid(400, {missingPassword: true});
        if (password !== verifypassword) return invalid(400, {notMatchingPasswords: true});
        if (!accounttype) return invalid(400, {missingAccountType: true});
        if (accounttype === 'Student' && !classcode) return invalid(400, {accounttype: accounttype, missingClassCode: true});

        const hash = await argon2.hash(password);

        const information = {
            username: username,
            hash: hash,
            accounttype: accounttype,
            class: classcode,
            uuid: uuidv4()
        };

        await database.setUser(username, information);
        throw redirect(302, '/login');
    }
}