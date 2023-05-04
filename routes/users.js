// Ioana A Mititean
// Exercise 34.1 - Message.ly

/**
 * Routes for users.
 */


const express = require("express");
const router = express.Router();

const { client: db } = require("../db");
const { ExpressError } = require("../expressError");
const { User } = require("../models/user");


/** GET / - Get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", async (req, res, next) => {
    try {
        const users = await User.all();
        return res.json({ users });

    } catch(err) {
        return next(err);
    }
})


/** GET /:username - Get details of a user.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", async (req, res, next) => {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });

    } catch(err) {
        return next(err);
    }
})


/** GET /:username/to - Get messages to a user.
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", async (req, res, next) => {
    try {
        const messages = await User.messagesTo(req.params.username);
        return res.json({ messages });

    } catch(err) {
        return next(err);
    }
})


/** GET /:username/from - Get messages from a user.
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", async (req, res, next) => {
    try {
        const messages = await User.messagesFrom(req.params.username);
        return res.json({ messages });

    } catch(err) {
        return next(err);
    }
})


module.exports = { router };
