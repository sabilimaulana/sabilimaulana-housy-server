const { authTransaction } = require("../helpers/authSchema");
const db = require("../models");
const { Property, City, Transaction, User } = require("../models");
const router = require("../routes/user");
const { Op } = require("sequelize");

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
      attachment,
      duration,
    });

    const resultAftedCreated = await Transaction.findOne({
      include: [
        {
          model: Property,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
      ],
      attributes: { exclude: ["userId", "propertyId"] },
      where: { id: result.id },
    });

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
        exclude: ["createdAt", "updatedAt", "propertyId", "userId"],
      },
      include: [
        {
          model: Property,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: User,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
      ],
    });

    res
      .status(200)
      .json({ message: "Get all transactions successfully", data: result });
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
        attachment,
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
          res.status(400).json({ error });
        });
    }
  } catch (error) {
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
        exclude: ["createdAt", "updatedAt", "propertyId", "userId"],
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
        {
          model: User,
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
      ],
    });

    if (!result) {
      res.status(400).json({
        message:
          "Get transaction detail by id is failed because id doesn't exist",
      });
    }
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
exports.getOrder = async (req, res) => {
  try {
    const { userId } = req;

    const result = await db.Transaction.findAll({
      where: {
        userId,
        [Op.or]: [{ status: "Waiting Payment" }, { status: "Waiting Approve" }],
      },
    });

    console.log(result);

    return res.status(200).json({
      message: `Get order with user id: ${userId} successfully`,
      data: result,
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

    const result = await db.Transaction.findAll({
      where: {
        userId,
        [Op.or]: [{ status: "Cancel" }, { status: "Approved" }],
      },
    });

    console.log(result);

    return res.status(200).json({
      message: `Get history with user id: ${userId} successfully`,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};
