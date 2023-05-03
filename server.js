// Ioana A Mititean
// Exercise 34.1 - Message.ly

/** Server startup for Message.ly. */


const { app } = require("./app");
const { HOSTNAME, PORT } = require("./config");


app.listen(PORT, HOSTNAME, function () {
    console.log(`Listening on ${HOSTNAME}, port ${PORT}`);
});
