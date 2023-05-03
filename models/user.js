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

        const qRes = await db.query(`
            SELECT
                m.id,
                m.to_user,
                m.body,
                m.sent_at,
                m.read_at,
                t.username,
                t.first_name,
                t.last_name,
                t.phone
            FROM messages AS m
                JOIN users AS t
                    ON m.to_user = t.username
            WHERE m.from_user = $1`,
            [username]);

    }

    /** Return messages to this user.
     *
     * [{id, from_user, body, sent_at, read_at}]
     *
     * where from_user is
     *   {username, first_name, last_name, phone}
     */
    static async messagesTo(username) {

        const qRes = await db.query(`
            SELECT
                m.id,
                m.from_user,
                m.body,
                m.sent_at,
                m.read_at,
                f.username,
                f.first_name,
                f.last_name,
                f.phone
            FROM messages as m
                JOIN users as f
                    ON m.from_user = f.username
            WHERE m.to_user = $1`,
            [username]);

    }
}


module.exports = { User };
