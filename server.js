/** Server startup for Message.ly. */


const app = require("./app");

const HOSTNAME = "127.0.0.1";
const PORT = 3000;


app.listen(PORT, HOSTNAME, function () {
  console.log(`Listening on ${HOSTNAME}, port ${PORT}`);
});
