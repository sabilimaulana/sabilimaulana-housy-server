const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const user = require("./src/routes/user.js");
const property = require("./src/routes/property.js");
const city = require("./src/routes/city");
// const { Property } = require("./models");
// const City = require("./models/City.js");

const db = require("./src/models");
const router = require("./src/routes/user.js");
// const { User } = require("./models");

// Property.hasOne(City);

app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/v1/", user);
app.use("/api/v1/", city);
app.use("/api/v1/", property);

db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    console.log("App is running on localhost on ", PORT);
  });
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
///
///

// app.post("/", (req, res) => {
//   console.log(req.body);
//   res.send("test");
// });

// app.get("/api", (req, res) => {
//   res.status(200).json({ message: "Get api success" });
// });

// app.get("/insert", (req, res) => {
//   User.create({
//     username: "owner",
//     password: "12345678",
//     fullname: "Owner Fullname",
//     email: "owner@gmail.com",
//     address: "Kemang, Jakarta Selatan",
//     status: "Owner",
//     gender: "Female",
//     phone: "081234567890",
//   }).catch((error) => {
//     if (error) {
//       console.log(error);
//     }
//   });
// });

module.exports = router;
