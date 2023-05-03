// Ioana A Mititean
// Exercise 34.1 - Message.ly

/** Common config for message.ly */


// Read .env files and make environmental variables

require("dotenv").config();

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

const DB_URI = (process.env.NODE_ENV === "test")
    ? "postgresql:///messagely_test"
    : "postgresql:///messagely";

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const BCRYPT_WORK_FACTOR = 12;


module.exports = {
    HOSTNAME,
    PORT,
    DB_URI,
    SECRET_KEY,
    BCRYPT_WORK_FACTOR,
};
