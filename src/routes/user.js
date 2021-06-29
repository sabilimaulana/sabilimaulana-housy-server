const { Router } = require("express");
const bodyParser = require("body-parser");
const db = require("../models");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

// Harusnya ini ada di .env
const JWT_KEY = "secret";

const router = Router();

// router.get("/get-users", (req, res) => {
//   db.User.findAll().then((users) => res.send(users));
// });

router.post("/signin", (req, res) => {
  const { username, password } = req.body;

  db.User.findOne({
    where: {
      username,
      password,
    },
  }).then((result) => {
    if (result) {
      const token = jwt.sign({ username }, JWT_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({
        data: { username, token },
      });
    } else {
      res.status(401).json({ message: "Data doesn't match with the database" });
    }
  });
});

router.post("/signup", (req, res) => {
  const {
    username,
    password,
    fullname,
    email,
    address,
    status,
    gender,
    phone,
  } = req.body;

  if (
    !username ||
    !password ||
    !fullname ||
    !email ||
    !address ||
    !status ||
    !gender ||
    !phone
  ) {
    res.status(400).json({ message: "Failed add user, Uncomplete body" });
    return;
  }

  db.User.findOne({
    where: {
      [Op.or]: [{ username }, { email }],
    },
  }).then((result) => {
    if (result) {
      res.status(401).json({ message: "Username or email is already exist" });
    } else {
      const token = jwt.sign({ username, email }, JWT_KEY, { expiresIn: "1h" });

      User.create({
        username,
        password,
        fullname,
        email,
        address,
        status,
        gender,
        phone,
      });
      res.status(200).json({
        message: "Add user to database successfully",
        data: {
          username,
          token,
        },
      });
    }
  });
});

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
