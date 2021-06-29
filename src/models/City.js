const Property = require("./Property");

module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define("City", {
    cityName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  City.associate = (models) => {
    City.hasOne(models.Property, { foreignKey: "cityId" }); // If only one portfolio per user
  };
  // City.hasOne(Property);

  return City;
};
