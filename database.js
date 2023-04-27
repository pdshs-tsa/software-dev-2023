import {QuickDB} from 'quick.db';
import * as argon2 from 'argon2';
import {v4 as uuidv4} from 'uuid';
import {compareTwoStrings} from "string-similarity";
import {error} from "@sveltejs/kit";

const users = new QuickDB({filePath: "./users.sqlite"});
// eslint-disable-next-line no-unused-vars
const classes = new QuickDB({filePath: "./classes.sqlite"});
const sessions = new QuickDB({filePath: "./session.sqlite"});
const sets = new QuickDB({filePath: './sets.sqlite'});

class Database {
    /**
     * Fetches the user data from the database.
     * @param {string} user
     * @return The json data of the user
     * @return {Promise<void>}
     */
    async getUser(user){
        return await users.get(user);
    }

    /**
     * Sets the specified user's data. This should only be called when creating an account
     * @param {string} username the username to set
     * @param data the form generated data
     * @return {Promise<void>}
     */
    async setUser(username, data){
        await users.set(username, data);
    }

    /**
     * Verifies a user's password hash
     * @param {string} username
     * @param {string} password
     * @return {Promise<boolean>}
     */
    async checkPassword(username, password){
        if (await users.has(username)){
            const stored = await users.get(`${username}.hash`);
            return await argon2.verify(stored, password);
        }
        return false;
    }

    /**
     * Checks if a user exists
     * @param {string} username
     * @return {Promise<boolean>}
     */
    async checkIfUserExists(username){
        return await users.has(username);
    }


    /**
     * Generates a new session and returns it
     * @param {string} username the user to generate the session for
     * @return {Promise<string>} the session UUID
     */
    async generateSession(username){
        //format- uuid
        const current = await users.get(`${username}.session`)
        if (current != null && await sessions.get(`${current}.expiration`) > Date.now()) return current;

        const uuid = uuidv4();
        const expiration = Date.now() + 86400000;

        const info = {
            username: username,
            timestamp: Date.now(),
            expiration: expiration
        }

        await sessions.set(uuid, info);
        await users.set(`${username}.session`, uuid);
        return uuid;
    }

    /**
     * Fetches the user from the session
     * @param {string} uuid the session ID
     * @return {Promise<unknown>} the user object
     */
    async getUserFromSession(uuid){
        //format- uuid
        if (uuid == null || !(await sessions.has(uuid))) return null;
        const data = await sessions.get(uuid);
        if (data == null) return null;
        if (data.expiration < Date.now()) {
            await sessions.delete(uuid);
            await users.delete(`${data.username}.session`);
            return null;
        }

        return await users.get(data.username);
    }

    /**
     * Destroys the current session
     * @param {string} uuid the session id
     * @return {Promise<void>}
     */
    async destroySession(uuid){
        const data = await sessions.get(uuid);
        if (data == null) return;

        await sessions.delete(uuid);
        await users.delete(`${data.username}.session`);
    }

    /**
     * Creates a new set
     * @param {string} username the username of the set author
     * @param {unknown} setData the data of the set
     * @return {Promise<string>} the uuid of the set
     */
    async createSet(username, setData){
        /*
            setData format:
            {
                title: (string),
                desc: (string),
                data: (setcomponent data)
            }
         */
        const uuid = uuidv4();
        const data = {
            uuid: uuid,
            title: setData.title,
            description: setData.desc,
            author: username,
            timestamp: Date.now(),
            data: setData.data
        }

        await sets.set(uuid, data);
        await users.push(`${username}.sets`, uuid);
        return uuid;
    }

    async updateSet(username, uuid, setData) {
        const data = {
            uuid: uuid,
            title: setData.title,
            description: setData.desc,
            author: username,
            timestamp: Date.now(),
            data: setData.data
        }

        await sets.set(uuid, data);
        return uuid;
    }

    /**
     * Gets the set with the specified uuid
     * @param {string} uuid the uuid of the set
     * @return {Promise<unknown>} the set data
     */
    async getSet(uuid){
        return await sets.get(uuid);
    }

    /**
     * Searches set titles and returns the most similar
     * @param {string} query the search term
     * @return {Promise<object[]>} the array of objects
     */
    async searchSets(query){
        query = query.replaceAll('_', ' ').toLowerCase();
        const arr = await sets.all();

        //TODO: reduce this to one array pass
        const trimmedarr = arr.filter(obj => {
            if (obj.value.title.toLowerCase().includes(query.toLowerCase())) return true;
            const value = compareTwoStrings(obj.value.title.toLowerCase(), query);
            return value > 0.65;
        });

        //TODO: optimize this, way too slow
        return trimmedarr.sort((a, b) => {
            const avalue = compareTwoStrings(a.value.title.toLowerCase(), query);
            const bvalue = compareTwoStrings(b.value.title.toLowerCase(), query);

            if (a.value.title.toLowerCase().includes(query.toLowerCase()) && !b.value.title.toLowerCase().includes(query.toLowerCase())) return -1;
            if (b.value.title.toLowerCase().includes(query.toLowerCase()) && !a.value.title.toLowerCase().includes(query.toLowerCase())) return 1;

            if (avalue > bvalue) {
                return -1;
            }

            if (avalue < bvalue) {
                return 1;
            }

            return 0;
        });
    }

    /**
     * Returns
     * @param number
     * @return {Promise<{id: string, value: any}[]>}
     */
    async getRandomSets (number) {
        const arr = await sets.all();
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, (number > shuffled.length) ? shuffled.length : number);
    }

    /**
     * Get the user's home from username
     * @param {string} username the username
     * @returns {Promise<unknown>} null if the home isn't found
     */
    async getClassesFromUsername(username) {
        const user = await users.get(username);
        let code = user.class;
        return await Promise.all(code.map(async (e) => await this.getClassFromCode(e)));
    }

    async getClassFromCode(code){
        if (code == null || !(await classes.has(code))) {
            return null
        }
        return await classes.get(code);
    }

    async createClass(user, name) {
        //generate unique alphanumeric code
        let random = 0;
        let code = '';
        while (random === 0 && !(await classes.has(code))) {
            random = Math.random();
            code = random.toString(36).slice(2, 8)
        }

        const data = {
            owner: user.username,
            name: name,
            code: code,
            assigned: [],
            students: []
        }

        await classes.set(code, data);
        await users.push(`${user.username}.class`, code);
        return code;
    }

    /**
     * Checks if a password for a home code is correct
     * @param {string} code home to check
     * @return {Promise<boolean>} if the password is correct
     */
    async verifyClassPassword(code){
        const classData = await this.getClassFromCode(code);
        if (classData === null) return false;
        return classData.code === code;
    }

    /**
     * Adds a student to a home
     * @param {string} username the username to add
     * @param {string} code the code of the home
     * @return {Promise<void>}
     */
    async addStudentToClass(username, code) {
        const data = {
            username: username,
            assignments: []
        }
        await classes.push(`${code}.students`, data);
        await users.push(`${username}.class`, code);
    }

    /**
     * Assigns a set to the given home
     * @param {string} classcode the home code to assign the set to
     * @param name {string} the name of the set
     * @param {string} uuid the uuid of the set
     */
    async assignSet(classcode, name, uuid){
        const current = await classes.get(`${classcode}.assigned`);
        if (current.includes(uuid)) return;
        await classes.push(`${classcode}.assigned`, uuid);
        const studentData = await classes.get(`${classcode}.students`);
        if (!(studentData instanceof Array)) throw new error(500, "Could not assign sets to all students.");
        studentData.map((student) => {
            student.assignments.push({
                name: name,
                uuid: uuid,
                attempts: []
            })
            return student;
        });
        await classes.set(`${classcode}.students`, studentData);
    }

    async addAssignmentAttempt(student, clazz, uuid, score) {
        const studentClass = await this.getClassFromCode(clazz);
        const index = studentClass.students.findIndex((e) => e.username === student);
        let studentData = studentClass.students[index];
        studentData.assignments.map((e) => {
            if (e.uuid === uuid) {
                e.attempts.push(score);
                return e;
            } else {
                return e;
            }
        });
        await classes.set(clazz, studentClass);
    }

    async fetchSetTable() {
        return await sets.all();
    }

    async fetchUserTable() {
        return await users.all();
    }

    async fetchSessionTable() {
        return await sessions.all();
    }

    async fetchClassTable() {
        return await classes.all();
    }
}

const database = new Database();

export default database;