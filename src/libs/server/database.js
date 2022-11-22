import {QuickDB} from 'quick.db';
import * as argon2 from 'argon2';
import {v4 as uuidv4} from 'uuid';

const users = new QuickDB({filePath: "./users.sqlite"});
// eslint-disable-next-line no-unused-vars
const classes = new QuickDB({filePath: "./classes.sqlite"});
const sessions = new QuickDB({filePath: "./session.sqlite"});

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
}

const database = new Database();

export default database;