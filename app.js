const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const user = require("./src/routes/user.js");
const property = require("./src/routes/property.js");
const city = require("./src/routes/city");
const transaction = require("./src/routes/transaction");

// socket
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// io.on("connection", (socket) => {
//   console.log("new client connected: ", socket.id);
// });

require("./src/socket/index")(io);

const db = require("./src/models");

app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/v1/", user);
app.use("/api/v1/", city);
app.use("/api/v1/", property);
app.use("/api/v1/", transaction);

db.sequelize.sync().then((req) => {
  server.listen(PORT, () => {
    console.log("App is running on localhost on ", PORT);
  });
});
