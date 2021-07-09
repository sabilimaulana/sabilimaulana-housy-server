const db = require("../models");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
require("dotenv").config();

const JWT_KEY = process.env.JWT_KEY;

const { authUser } = require("../helpers/authSchema");

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.User.findOne({
      where: {
        username,
      },
    });

    if (result) {
      const isValidPassword = await bcrypt.compare(password, result.password);
      if (!isValidPassword) {
        return res.send({
          status: "failed",
          message: "Email or Password dont match",
        });
      }

      const token = jwt.sign({ username, id: result.id }, JWT_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({
        username,
        token,
      });
    } else {
      res.status(401).json({
        status: "Failed",
        message: "Data doesn't match with the database",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

exports.signup = async (req, res) => {
  try {
    const userValidate = await authUser.validateAsync(req.body);

    const {
      username,
      password,
      fullname,
      email,
      address,
      listAs,
      gender,
      phone,
    } = req.body;

    const hashStrenght = 10;
    const hashedPassword = await bcrypt.hash(password, hashStrenght);

    const result = await db.User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (result) {
      res.status(401).json({ message: "Username or email is already exist" });
    } else {
      User.create({
        username,
        password: hashedPassword,
        fullname,
        email,
        address,
        listAs,
        gender,
        phone,
      }).then((result) => {
        // console.log(result);
        const token = jwt.sign({ username, email, id: result.id }, JWT_KEY, {
          expiresIn: "1h",
        });

        res.status(200).json({
          message: "Add user to database successfully",
          data: {
            username,
            token,
          },
        });
      });
    }
  } catch (error) {
    if (error.isJoi === true) {
      res.status(422).json({ error: error.details[0].message });
    } else {
      res
        .status(500)
        .json({ status: "Failed", message: "Internal server error", error });
    }
  }
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
};

// Opsional
exports.getProfile = async (req, res) => {
  try {
    const result = await db.User.findOne({
      where: { id: req.userId },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    if (result) {
      // console.log(result);
      if (result.urlImage !== "") {
        result.urlImage = process.env.BASE_URL + result.urlImage;
      }
      // const newResult = result.map((profile) => {
      //   // profile.urlImage = process.env.BASE_URL + profile.urlImage;
      //   return profile;
      // });
      // console.log(newResult);
      return res
        .status(200)
        .json({ message: "Get profile data successfully", data: result });
    } else {
      return res.status(400).json({ message: "Get profile failed" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.body;

    const result = await db.User.findOne({
      where: { username },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    if (!result) {
      res.status(400).json({
        status: "Failed",
        message: `User with username: ${username} doesn't exist`,
      });
    } else {
      res.status(200).json({
        message: "Get user detail by username successfully",
        data: result,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const { userId } = req;

    const result = db.User.update(
      { urlImage: req.file.path },
      { where: { id: userId } }
    );

    if (result[0] === 0) {
      res
        .status(400)
        .json({ message: `User with id: ${userId} doesn't exist` });
    } else {
      db.User.findOne({ where: { id: userId } }).then((result) => {
        res.status(200).json({
          message: "Update profile picture successfully",
          data: result,
        });
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId } = req;
    const { oldPassword, newPassword } = req.body;

    const result = await User.findOne({ where: { id: userId } });

    if (!result) {
      return res.status(400).json({
        status: "Failed",
        message: "Change password failed because id doesn't exist",
      });
    } else {
      const isValidOldPassword = await bcrypt.compare(
        oldPassword,
        result.password
      );

      if (!isValidOldPassword) {
        return res.status(400).json({
          status: "Failed",
          message: "Change password failed because old password is wrong",
        });
      } else {
        if (oldPassword === newPassword) {
          return res.status(400).json({
            status: "Failed",
            message:
              "Change password failed because old password and new password are same",
          });
        }

        const hashStrenght = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, hashStrenght);
        User.update({ password: hashedNewPassword }, { where: { id: userId } });

        return res
          .status(200)
          .json({ status: "Success", message: "Change password successfully" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};
