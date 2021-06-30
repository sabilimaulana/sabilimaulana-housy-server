const { Router } = require("express");
const bodyParser = require("body-parser");
const db = require("../models");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

// Harusnya ini ada di .env

const router = Router();

const {
  signin,
  signup,
  getAllUsers,
  deleteUser,
} = require("../controllers/user");

// router.get("/get-users", (req, res) => {
//   db.User.findAll().then((users) => res.send(users));
// });

router.post("/signin", signin);

router.post("/signup", signup);

router.get("/users", getAllUsers);

router.delete("/user/:id", deleteUser);

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

// const { getUsers } = require("../controllers/users/index");

// router.get("/get-users", getUsers);

// router.post("/add-user", (req, res) => {

// });

// export const addUser = async (req, res) => {
//   console.log(req.body);
//   res.send("test");
// };

module.exports = router;
