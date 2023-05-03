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

        return result.rows[0];
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

        if (qRes.rows.length === 0) {
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

    }

    /** Return messages from this user.
     *
     * [{id, to_user, body, sent_at, read_at}]
     *
     * where to_user is
     *   {username, first_name, last_name, phone}
     */
    static async messagesFrom(username) {

    }

    /** Return messages to this user.
     *
     * [{id, from_user, body, sent_at, read_at}]
     *
     * where from_user is
     *   {username, first_name, last_name, phone}
     */
    static async messagesTo(username) {

    }
}


module.exports = { User };
