const City = require("./City");

module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define("Property", {
    propertyName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    yearPrice: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    monthPrice: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    dayPrice: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    furnished: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    petAllowed: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    sharedAccomodation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bedroom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bathroom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    urlFirstImage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    urlSecondImage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    urlThirdImage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    urlFourthImage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  });
  // City.hasOne(Property);
  // Property.belongsTo(City);
  Property.associate = (models) => {
    Property.belongsTo(models.City, { foreignKey: "cityId" }); // If only one portfolio per user
  };
  return Property;
};