// const City = require("./City");

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    checkin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    checkout: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    total: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Waiting Payment",
    },
    attachment: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  });
  // City.hasOne(Property);
  // Property.belongsTo(City);
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: "userId" }); // If only one portfolio per user
    Transaction.belongsTo(models.Property, { foreignKey: "propertyId" }); // If only one portfolio per user
  };
  return Transaction;
};
