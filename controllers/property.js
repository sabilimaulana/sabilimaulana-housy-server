const db = require("../models");
const { Property, City } = require("../models");

exports.getAllProperties = (req, res) => {
  db.Property.findAll({ include: City })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => res.status(404).json(error));
};

exports.getProperty = (req, res) => {
  const { id } = req.params;

  db.Property.findOne({
    where: {
      id,
    },
  }).then((result) => {
    if (!result) {
      res.status(400).json({
        message: "Get property detail by id is failed because id doesn't exist",
      });
    }
    res
      .status(200)
      .json({ message: "Get property detail by id succesfully", data: result });
  });
};

exports.deleteProperty = (req, res) => {
  const { id } = req.params;

  try {
    db.Property.destroy({
      where: { id },
    });
    res.status(200).json({ message: "Delete property by id successfully" });
  } catch (error) {
    res.send(error);
  }
};

//res.send(result) nya belom dihandle

exports.updateProperty = (req, res) => {
  const { id } = req.params;

  const {
    propertyName,
    cityId,
    address,
    yearPrice,
    monthPrice,
    dayPrice,
    furnished,
    petAllowed,
    sharedAccomodation,
    bedroom,
    bathroom,
    area,
  } = req.body;

  db.Property.update(
    {
      propertyName,
      cityId,
      address,
      yearPrice,
      monthPrice,
      dayPrice,
      furnished,
      petAllowed,
      sharedAccomodation,
      bedroom,
      bathroom,
      area,
    },
    { where: { id } }
  )
    .then((result) => {
      if (result[0] === 0) {
        res.status(400).json({ message: "Id property is doesn't exist" });
      } else {
        res.status(200).json({
          message: `Property with id ${id} has been updated`,
          // data: result,
        });
      }
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

exports.addProperty = (req, res) => {
  const {
    propertyName,
    cityId,
    address,
    yearPrice,
    monthPrice,
    dayPrice,
    furnished,
    petAllowed,
    sharedAccomodation,
    bedroom,
    bathroom,
    area,
  } = req.body;

  if (
    !propertyName ||
    !cityId ||
    !address ||
    !yearPrice ||
    !monthPrice ||
    !dayPrice ||
    !furnished ||
    !petAllowed ||
    !sharedAccomodation ||
    !bedroom ||
    !bathroom ||
    !area
  ) {
    res
      .status(401)
      .json({ message: "Uncomplete body request for add-property" });
  } else {
    Property.create({
      propertyName,
      cityId,
      address,
      yearPrice,
      monthPrice,
      dayPrice,
      furnished,
      petAllowed,
      sharedAccomodation,
      bedroom,
      bathroom,
      area,
      urlFirstImage: req.files[0]?.path,
      urlSecondImage: req.files[1]?.path,
      urlThirdImage: req.files[2]?.path,
      urlFourthImage: req.files[3]?.path,
    }).then((result) => {
      res.status(200).json({
        message: "Add property to database successfully",
        data: result,
      });
    });
  }
};
