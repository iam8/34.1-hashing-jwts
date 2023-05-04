// Ioana A Mititean
// Exercise 34.1 - Message.ly

/**
 * Routes for authentication.
 */


const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");
const { client: db } = require("../db");
const { ExpressError } = require("../expressError");
const { User } = require("../models/user");


/** POST /login - log in.
 *
 * {username, password} => {token}.
 *
 **/
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const loginSuccess = await User.authenticate(username, password);
        if (loginSuccess) {

            // Update last login
            await User.updateLoginTimestamp(username);

            // Create and return JWT
            let token = jwt.sign({ username }, SECRET_KEY);
            return res.json({ token });
        }

        throw new ExpressError("Invalid username and/or password", 400);

    } catch(err) {
        return next(err);
    }
})


/** POST /register - register user: register, log in, and return token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 */
router.post("/register", async (req, res, next) => {
    try {

        // Register and update last login time
        const user = await User.register(req.body);

        // Create and return token
        let token = jwt.sign({ username: user.username }, SECRET_KEY);
        return res.json({ token });

    } catch(err) {
        return next(err);
    }
})


module.exports = { router };
