// Ioana A Mititean
// Exercise 34.1 - Message.ly

/**
 * Routes for messages.
 */


const express = require("express");
const router = express.Router();

const { client: db } = require("../db");
const { ExpressError } = require("../expressError");
const { User } = require("../models/user");
const { Message } = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");


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
router.get("/:id", async (req, res, next) => {
    try {

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
router.post("/:id/read", async (req, res, next) => {
    try {

    } catch(err) {
        return next(err);
    }
})


module.exports = { router };
