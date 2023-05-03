// Ioana A Mititean
// Exercise 34.1 - Message.ly

/**
 * Routes for authentication.
 */


const express = require("express");
const router = express.Router();

const { client: db } = require("../db");
const { ExpressError } = require("../expressError");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */


module.exports = { router };
