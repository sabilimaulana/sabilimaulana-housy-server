const { Router } = require("express");
const db = require("../models");
const { City } = require("../models");

const router = Router();

router.post("/city", (req, res) => {
  City.create({ cityName: req.body.cityName });
  res.status(200).json({ message: "Success add city" });
});

router.get("/cities", async (req, res) => {
  try {
    const result = await City.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "cityId"] },
    });
    return res.status(200).json({
      status: "Success",
      message: "Get all cities successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed", message: "Internal server error", error });
  }
});

// router.post(
//   "/add-property",
//   checkAuth,
//   upload.array("uploadedImages", 4),
//   (req, res) => {
//     // console.log(req.files);
//     // console.log(req.body);
//     // console.log();

//     const {
//       propertyName,
//       city,
//       address,
//       yearPrice,
//       monthPrice,
//       dayPrice,
//       furnished,
//       petAllowed,
//       sharedAccomodation,
//       bedroom,
//       bathroom,
//       area,
//     } = req.body;

//     if (
//       !propertyName ||
//       !city ||
//       !address ||
//       !yearPrice ||
//       !monthPrice ||
//       !dayPrice ||
//       !furnished ||
//       !petAllowed ||
//       !sharedAccomodation ||
//       !bedroom ||
//       !bathroom ||
//       !area
//     ) {
//       res
//         .status(401)
//         .json({ message: "Uncomplete body request for add-property" });

//       // res.end();
//     } else {
//       Property.create({
//         propertyName,
//         city,
//         address,
//         yearPrice,
//         monthPrice,
//         dayPrice,
//         furnished,
//         petAllowed,
//         sharedAccomodation,
//         bedroom,
//         bathroom,
//         area,
//         urlFirstImage: req.files[0]?.path,
//         urlSecondImage: req.files[1]?.path,
//         urlThirdImage: req.files[2]?.path,
//         urlFourthImage: req.files[3]?.path,
//       });

//       res
//         .status(200)
//         .json({ message: "Add property to database successfully" });
//     }
//   }
// );

module.exports = router;
