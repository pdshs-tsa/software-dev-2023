import {fail, redirect} from "@sveltejs/kit";
import * as argon2 from "argon2";
import database from "/database.js";
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

        if (username)

        if (accounttype === "Student"){
            classcode = data.get('class-code');
        }

        if (!isAlphaNumeric(username)) return fail(400, {invalidUsername: true});

        if (await database.checkIfUserExists(username)) return fail(400, {takenUsername: true});

        if (!username) return fail(400, {missingUsername: true});
        if (!password) return fail(400, {missingPassword: true});
        if (password !== verifypassword) return fail(400, {notMatchingPasswords: true});
        if (!accounttype) return fail(400, {missingAccountType: true});
        if (accounttype === 'Student' && (classcode === '' || classcode == null)) return fail(400, {accounttype: accounttype, missingClassCode: true});
        if (accounttype === 'Student' && !await database.verifyClassPassword(classcode)) return fail(400, {accounttype: accounttype, incorrectClassPass: true});

        const hash = await argon2.hash(password);

        const information = {
            username: username,
            hash: hash,
            accounttype: accounttype,
            timestamp: Date.now(),
            class: [],
            sets: [],
            uuid: uuidv4()
        };

        await database.setUser(username, information);
        if (accounttype === "Student") await database.addStudentToClass(username, classcode);
        throw redirect(302, '/login');
    }
}

function isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
};