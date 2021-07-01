const { authProperty } = require("../helpers/authSchema");
const db = require("../models");
const { Property, City } = require("../models");

// Get All Houses
exports.getAllProperties = async (req, res) => {
  //baru selesai membuat multiple query filter, tinggal bikin yang single query filter
  if (req.query) {
    try {
      const result = await db.Property.findAll({
        include: {
          model: City,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        attributes: { exclude: ["createdAt", "updatedAt", "cityId"] },
      });

      if (req.query.belowYearPrice && req.query.belowArea) {
        const newResult = result.filter((property) => {
          if (
            parseInt(property.yearPrice) <=
              parseInt(req.query.belowYearPrice) &&
            parseInt(property.area) <= parseInt(req.query.belowArea)
          ) {
            return true;
          }
        });

        res.send(newResult);
      }
      res.send(result);
    } catch (error) {
      res
        .status(500)
        .json({ status: "Failed", message: "Internal server error", error });
    }
  } else {
    try {
      const result = await db.Property.findAll({
        include: {
          model: City,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        attributes: { exclude: ["createdAt", "updatedAt", "cityId"] },
      });

      res
        .status(200)
        .json({ message: "Get all properties successfully", data: result });

      // Jika ingin membuat amenities menjadi format array
      // const newResult = await result.map((property, index) => {
      //   let newProperty = {
      //     propertyName: property.propertyName,
      //     address: property.address,
      //     yearPrice: property.yearPrice,
      //     monthPrice: property.monthPrice,
      //     dayPrice: property.dayPrice,
      //     bedroom: property.bedroom,
      //     bathroom: property.bathroom,
      //     area: property.area,
      //     amenities: [],
      //     City: property.City,
      //   };
      //   const amenities = [];
      //   if (property.furnished === "true") {
      //     newProperty.amenities.push("Furnished");
      //   }
      //   if (property.petAllowed === "true") {
      //     newProperty.amenities.push("Pet Allowed");
      //   }
      //   if (property.sharedAccomodation === "true") {
      //     newProperty.amenities.push("Shared Accomodation");
      //   }
      //   property.amenities = amenities;
      //   return newProperty;
      // });

      // res
      //   .status(200)
      //   .json({ message: "Get all properties successfully", data: newResult });
    } catch (error) {
      res
        .status(500)
        .json({ status: "Failed", message: "Internal server error", error });
    }
  }
};

// Get one house with id
exports.getProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.Property.findOne({
      where: {
        id,
      },
    });

    if (!result) {
      res.status(400).json({
        message: "Get property detail by id is failed because id doesn't exist",
      });
    }
    res.status(200).json({
      message: "Get property detail by id succesfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

// Untuk menghapus property berdasarkan id
// Mengapa kita perlu request body jika kita hanya perlu id?
exports.deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.Property.findOne({
      where: {
        id,
      },
    });
    if (!result) {
      res.status(400).json({
        message: `Delete property by id is failed because id: ${id} doesn't exist`,
      });
    } else {
      try {
        db.Property.destroy({
          where: { id },
        });
        res
          .status(200)
          .json({ message: `Delete property by id: ${id} successfully` });
      } catch (error) {
        res.send(error);
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

// Untuk mengedit property berdasarkan id
// dengan body berbentuk JSON
exports.updateProperty = async (req, res) => {
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

  try {
    const result = await db.Property.update(
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
    );

    if (result[0] === 0) {
      res.status(400).json({ message: "Id property is doesn't exist" });
    } else {
      db.Property.findOne({
        where: { id },
      })
        .then((result) => {
          res.status(200).json({
            message: `Property with id ${id} has been updated`,
            data: result,
          });
        })
        .catch((error) => {
          res.status(500).json({
            status: "Failed",
            message: "Internal server error",
            error,
          });
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
};

// Untuk menambah property
// dengan body berupa multipart form
exports.addProperty = async (req, res) => {
  try {
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

    const propertyValidate = await authProperty.validateAsync(req.body);

    const result = await Property.create({
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
    });

    res.status(200).json({
      message: "Add property to database successfully",
      data: result,
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
  // }
};
