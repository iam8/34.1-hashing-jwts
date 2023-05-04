// Ioana A Mititean
// Exercise 34.1 - Message.ly

/**
 * Routes for users.
 */


const express = require("express");
const router = express.Router();

const { client: db } = require("../db");
const { ExpressError } = require("../expressError");


/** GET / - Get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/


/** GET /:username - Get details of a user.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/


/** GET /:username/to - Get messages to a user.
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


/** GET /:username/from - Get messages from a user.
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


module.exports = { router };
