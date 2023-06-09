// Ioana A Mititean
// Exercise 34.1 - Message.ly

/** User class for message.ly */

const bcrypt = require("bcrypt");

const {client: db} = require("../db");
const { ExpressError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");


/** User of the site. */
class User {

    /** Register new user -- returns
     *    {username, password, first_name, last_name, phone}
     */
    static async register({username, password, first_name, last_name, phone}) {

        const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const result = await db.query(`
            INSERT INTO users (username, password, first_name, last_name, phone)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING username, password, first_name, last_name, phone`,
            [username, hashedPw, first_name, last_name, phone]);

        const user = result.rows[0];

        // Update last_login_at for this user
        await this.updateLoginTimestamp(user.username);

        return user;
    }

    /** Authenticate: is this username/password valid? Returns boolean. */
    static async authenticate(username, password) {

        const result = await db.query(`
            SELECT password FROM users
            WHERE username = $1`,
            [username]);

        const user = result.rows[0];
        if (!user) {
            throw new ExpressError(`No such user: ${username}`, 404);
        }

        const authRes = await bcrypt.compare(password, user.password);
        return authRes;
    }

    /** Update last_login_at for user. */
    static async updateLoginTimestamp(username) {

        const qRes = await db.query(`
            UPDATE users SET last_login_at = CURRENT_TIMESTAMP
            WHERE username = $1
            RETURNING last_login_at`,
            [username]);

        if (!qRes.rows[0]) {
            throw new ExpressError(`No such user: ${username}`, 404);
        }
    }

    /** All: basic info on all users:
     * [{username, first_name, last_name, phone}, ...] */
    static async all() {

        const qRes = await db.query(`
            SELECT username, first_name, last_name, phone
            FROM users`);

        return qRes.rows;
    }

    /** Get: get user by username.
     *
     * Returns {username,
     *          first_name,
     *          last_name,
     *          phone,
     *          join_at,
     *          last_login_at } */
    static async get(username) {

        const qRes = await db.query(`
            SELECT username, first_name, last_name, phone, join_at, last_login_at
            FROM users
            WHERE username = $1`,
            [username]);

        const user = qRes.rows[0];
        if (!user) {
            throw new ExpressError(`No such user: ${username}`, 404);
        }

        return user;
    }

    /** Return messages from this user.
     *
     * [{id, to_user, body, sent_at, read_at}]
     *
     * where to_user is
     *   {username, first_name, last_name, phone}
     */
    static async messagesFrom(username) {

        // First check if user with given username exists
        const userQ = await db.query(`
            SELECT username FROM users
            WHERE username = $1`,
            [username]);

        if (!userQ.rows[0]) {
            throw new ExpressError(`No such user: ${username}`, 404);
        }

        const qRes = await db.query(`
            SELECT
                m.id,
                m.to_username,
                m.body,
                m.sent_at,
                m.read_at,
                t.first_name AS to_first_name,
                t.last_name AS to_last_name,
                t.phone AS to_phone
            FROM messages AS m
                JOIN users AS t
                    ON m.to_username = t.username
            WHERE m.from_username = $1`,
            [username]);

        return qRes.rows.map((msg) => {
            return {
                id: msg.id,
                to_user: {
                    username: msg.to_username,
                    first_name: msg.to_first_name,
                    last_name: msg.to_last_name,
                    phone: msg.to_phone
                },
                body: msg.body,
                sent_at: msg.sent_at,
                read_at: msg.read_at
            };
        });
    }

    /** Return messages to this user.
     *
     * [{id, from_user, body, sent_at, read_at}]
     *
     * where from_user is
     *   {username, first_name, last_name, phone}
     */
    static async messagesTo(username) {

        // First check if user with given username exists
        const userQ = await db.query(`
            SELECT username FROM users
            WHERE username = $1`,
            [username]);

        if (!userQ.rows[0]) {
            throw new ExpressError(`No such user: ${username}`, 404);
        }

        const qRes = await db.query(`
            SELECT
                m.id,
                m.from_username,
                m.body,
                m.sent_at,
                m.read_at,
                f.first_name AS from_first_name,
                f.last_name AS from_last_name,
                f.phone AS from_phone
            FROM messages as m
                JOIN users as f
                    ON m.from_username = f.username
            WHERE m.to_username = $1`,
            [username]);

        return qRes.rows.map((msg) => {
            return {
                id: msg.id,
                from_user: {
                    username: msg.from_username,
                    first_name: msg.from_first_name,
                    last_name: msg.from_last_name,
                    phone: msg.from_phone
                },
                body: msg.body,
                sent_at: msg.sent_at,
                read_at: msg.read_at
            };
        });
    }
}


module.exports = { User };
