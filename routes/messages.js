// Ioana A Mititean
// Exercise 34.1 - Message.ly

/**
 * Routes for messages.
 */


const express = require("express");
const router = express.Router();

const { ExpressError } = require("../expressError");
const { Message } = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");


/** GET /:id - get detail of a message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Only the currently-logged-in user can be either the 'to' or 'from' user.
 **/
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
    try {
        const curr_user = req.user.username;
        const message = await Message.get(req.params.id);

        const to_username = message.to_user.username;
        const from_username = message.from_user.username;

        // Throw error if current user is neither message sender nor recipient
        if (curr_user !== to_username && curr_user !== from_username) {
            throw new ExpressError("Unauthorized", 401);
        }

        return res.json({ message });

    } catch(err) {
        return next(err);
    }
})


/** POST / - post a message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 * Only logged-in users can post messages.
 **/
router.post("/", ensureLoggedIn, async (req, res, next) => {
    try {
        const { to_username, body } = req.body;
        const from_username = req.user.username; // Get username of current user
        const message = await Message.create({from_username, to_username, body});

        return res.json({ message });

    } catch(err) {
        return next(err);
    }
})


/** POST/:id/read - mark a message as read.
 *
 *  => {message: {id, read_at}}
 *
 * Only the intended recipient can mark as read.
 **/
router.post("/:id/read", ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const curr_user = req.user.username;

        // Get the message recipient
        const message = await Message.get(id);
        const to_username = message.to_user.username;

        // Throw error if current user is not the recipient
        if (curr_user !== to_username) {
            throw new ExpressError("Unauthorized", 401);
        }

        const markResult = await Message.markRead(id);
        return res.json({message: markResult});

    } catch(err) {
        return next(err);
    }
})


module.exports = { router };
