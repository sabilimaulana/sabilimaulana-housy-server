const { authTransaction } = require("../helpers/authSchema");
const db = require("../models");
const { Property, City, Transaction, User } = require("../models");
const router = require("../routes/user");
const { Op } = require("sequelize");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

exports.addTransaction = async (req, res) => {
  try {
    const transactionValidate = await authTransaction.validateAsync(req.body);
    console.log(transactionValidate);
    const {
      checkin,
      checkout,
      total,
      status,
      propertyId,
      userId,
      ownerId,
      attachment,
      duration,
    } = req.body;

    const result = await Transaction.create({
      checkin,
      checkout,
      total,
      status,
      propertyId,
      userId,
      ownerId,
      attachment,
      duration,
    });

    const resultAftedCreated = await Transaction.findOne({
      include: [
        {
          model: Property,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["propertyId"] },
      where: { id: result.id },
    });

    const resultUser = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });
    const resultOwner = await User.findOne({
      where: { id: ownerId },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    resultAftedCreated.dataValues.userData = resultUser;
    resultAftedCreated.dataValues.ownerData = resultOwner;

    res.status(200).json({
      message: "Add transaction to database successfully",
      data: resultAftedCreated,
    });
  } catch (error) {
    if (error.isJoi) {
      res.status(422).json({ error: error.details[0].message });
    } else {
      res
        .status(500)
        .json({ status: "Failed", message: "Internal server error", error });
    }
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const result = await db.Transaction.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "propertyId"],
      },
      include: [
        {
          model: Property,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    const newResult = await Promise.all(
      result.map(async (transaction) => {
        const resultUser = await User.findOne({
          where: { id: transaction.userId },
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });
        const resultOwner = await User.findOne({
          where: { id: transaction.ownerId },
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });
        transaction.dataValues.userData = await resultUser;
        transaction.dataValues.ownerData = await resultOwner;

        return transaction;
      })
    );

    res
      .status(200)
      .json({ message: "Get all transactions successfully", data: newResult });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;

  const {
    checkin,
    checkout,
    total,
    status,
    propertyId,
    userId,
    ownerId,
    attachment,
    duration,
  } = req.body;

  try {
    const result = await db.Transaction.update(
      {
        checkin,
        checkout,
        total,
        status,
        propertyId,
        userId,
        ownerId,
        // Perbaikan
        attachment: req.file && req.file.path,
        duration,
      },
      {
        where: { id },
      }
    );

    if (result[0] === 0) {
      res.status(400).json({ message: "Id transaction is doesn't exist" });
    } else {
      db.Transaction.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "propertyId", "userId"],
        },
        include: [
          {
            model: Property,
            include: [
              {
                model: City,
                attributes: { exclude: ["createdAt", "updatedAt", "cityId"] },
              },
            ],
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
          },
        ],
      })
        .then((result) => {
          res.status(200).json({
            message: `Transaction with id ${id} has been updated`,
            data: result,
          });
        })
        .catch((error) => {
          object;
          res.status(400).json({ error });
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

exports.getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.Transaction.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "propertyId"],
      },
      include: [
        {
          model: Property,
          include: [
            {
              model: City,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
          attributes: { exclude: ["createdAt", "updatedAt", "cityId"] },
        },
        // {
        //   model: User,
        //   attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        // },
      ],
    });

    if (!result) {
      res.status(400).json({
        message:
          "Get transaction detail by id is failed because id doesn't exist",
      });
    }

    const resultUser = await User.findOne({
      where: { id: result.userId },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });
    const resultOwner = await User.findOne({
      where: { id: result.ownerId },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    result.dataValues.userData = resultUser;
    result.dataValues.ownerData = resultOwner;

    res.status(200).json({
      message: "Get transaction detail by id succesfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

// Opsional
exports.getTransactionsByOwnerId = async (req, res) => {
  try {
    const { userId } = req;
    const { ownerId } = req.params;

    if (+userId !== +ownerId) {
      return res
        .status(401)
        .json({ status: "Failed", message: "You're not the owner" });
    }

    const result = await Transaction.findAll({
      where: {
        ownerId,
        [Op.or]: [
          { status: "Waiting Approve" },
          { status: "Cancel" },
          { status: "Approved" },
        ],
      },
      include: { model: Property },
    });

    const newResult = await Promise.all(
      result.map(async (transaction) => {
        const resultUser = await User.findOne({
          where: { id: transaction.userId },
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });
        const resultOwner = await User.findOne({
          where: { id: transaction.ownerId },
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });
        transaction.dataValues.userData = await resultUser;
        transaction.dataValues.ownerData = await resultOwner;
        if (transaction.dataValues.attachment) {
          transaction.dataValues.attachment =
            BASE_URL + transaction.dataValues.attachment;
        }
        return transaction;
      })
    );

    return res.status(200).json({
      status: "Success",
      message: `Get transactions by ownerId: ${ownerId} successfully`,
      data: newResult,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { userId } = req;

    const result = await db.Transaction.findAll({
      where: {
        userId,
        [Op.or]: [{ status: "Waiting Payment" }, { status: "Waiting Approve" }],
      },
      include: { model: Property },
    });

    const newResult = await Promise.all(
      result.map(async (transaction) => {
        const resultUser = await User.findOne({
          where: { id: transaction.userId },
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });
        const resultOwner = await User.findOne({
          where: { id: transaction.ownerId },
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });
        transaction.dataValues.userData = await resultUser;
        transaction.dataValues.ownerData = await resultOwner;
        if (transaction.dataValues.attachment) {
          transaction.dataValues.attachment =
            BASE_URL + transaction.dataValues.attachment;
        }

        return transaction;
      })
    );
    // console.log(result);

    return res.status(200).json({
      message: `Get order with user id: ${userId} successfully`,
      data: newResult,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { userId } = req;

    let result;
    let newResult;
    const userData = await User.findOne({ where: { id: userId } });
    console.log(userData.listAs);
    if (userData.listAs === "Tenant") {
      result = await db.Transaction.findAll({
        where: {
          userId,
          [Op.or]: [{ status: "Cancel" }, { status: "Approved" }],
        },
        include: { model: Property },
      });
    } else {
      result = await db.Transaction.findAll({
        where: {
          ownerId: userId,
          [Op.or]: [{ status: "Cancel" }, { status: "Approved" }],
        },
        include: { model: Property },
      });
    }

    newResult = await Promise.all(
      result.map(async (transaction) => {
        const resultUser = await User.findOne({
          where: { id: transaction.userId },
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });
        const resultOwner = await User.findOne({
          where: { id: transaction.ownerId },
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });
        transaction.dataValues.userData = await resultUser;
        transaction.dataValues.ownerData = await resultOwner;
        if (transaction.dataValues.attachment) {
          transaction.dataValues.attachment =
            BASE_URL + transaction.dataValues.attachment;
        }

        return transaction;
      })
    );

    return res.status(200).json({
      message: `Get history with user id: ${userId} successfully`,
      data: newResult,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};
