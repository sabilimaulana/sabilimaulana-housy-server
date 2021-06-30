const db = require("../models");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");

const JWT_KEY = "secret";

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.User.findOne({
      where: {
        username,
        password,
      },
    });

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
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }

  // db.User.findOne({
  //   where: {
  //     username,
  //     password,
  //   },
  // }).then((result) => {
  //   if (result) {
  //     const token = jwt.sign({ username }, JWT_KEY, {
  //       expiresIn: "1h",
  //     });
  //     res.status(200).json({
  //       data: { username, token },
  //     });
  //   } else {
  //     res.status(401).json({ message: "Data doesn't match with the database" });
  //   }
  // });
};

exports.signup = async (req, res) => {
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

  try {
    const result = await db.User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

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
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }

  // db.User.findOne({
  //   where: {
  //     [Op.or]: [{ username }, { email }],
  //   },
  // }).then((result) => {
  //   if (result) {
  //     res.status(401).json({ message: "Username or email is already exist" });
  //   } else {
  //     const token = jwt.sign({ username, email }, JWT_KEY, { expiresIn: "1h" });

  //     User.create({
  //       username,
  //       password,
  //       fullname,
  //       email,
  //       address,
  //       status,
  //       gender,
  //       phone,
  //     });
  //     res.status(200).json({
  //       message: "Add user to database successfully",
  //       data: {
  //         username,
  //         token,
  //       },
  //     });
  //   }
  // });
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.User.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });
    res
      .status(200)
      .json({ message: "Get all data users successfully", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }

  // db.User.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } }).then(
  //   (result) => {
  //     res
  //       .status(200)
  //       .json({ message: "Get all data users successfully", data: result });
  //   }
  // );
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = db.User.findOne({
      where: {
        id,
      },
    });

    if (!result) {
      res.status(400).json({
        message: `Delete user by id is failed because user with id: ${id} doesn't exist`,
      });
    } else {
      try {
        db.User.destroy({
          where: { id },
        });
        res
          .status(200)
          .json({ message: `Delete user by id: ${id} successfully` });
      } catch (error) {
        res
          .status(500)
          .json({ status: "Failed", message: "Internal server error", error });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }

  // db.User.findOne({
  //   where: {
  //     id,
  //   },
  // })
  //   .then((result) => {
  //     if (!result) {
  //       res.status(400).json({
  //         message: `Delete user by id is failed because user with id: ${id} doesn't exist`,
  //       });
  //     } else {
  //       try {
  //         db.User.destroy({
  //           where: { id },
  //         });
  //         res
  //           .status(200)
  //           .json({ message: `Delete user by id: ${id} successfully` });
  //       } catch (error) {
  //         res.status(500).json({
  //           status: "Failed",
  //           message: "Internal server error",
  //           error,
  //         });
  //       }
  //     }
  //   })
  //   .catch((error) => {
  //     res
  //       .status(500)
  //       .json({ status: "Failed", message: "Internal server error", error });
  //   });
};
