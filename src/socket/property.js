const db = require("../models");
const { City } = require("../models");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

module.exports.respond = (socket) => {
  // socket.on("disconnect", () => {
  //   console.log("user disconnect");
  // });

  socket.on("load property", async () => {
    try {
      const result = await db.Property.findAll({
        include: {
          model: City,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        attributes: { exclude: ["createdAt", "updatedAt", "cityId"] },
      });

      // Menambahkan base url kepada path gambar rumah
      const newResult = result.map((property) => {
        if (property.urlFirstImage) {
          property.urlFirstImage = BASE_URL + property.urlFirstImage;
        }
        if (property.urlSecondImage) {
          property.urlSecondImage = BASE_URL + property.urlSecondImage;
        }
        if (property.urlThirdImage) {
          property.urlThirdImage = BASE_URL + property.urlThirdImage;
        }
        if (property.urlFourthImage) {
          property.urlFourthImage = BASE_URL + property.urlFourthImage;
        }

        return property;
      });

      socket.emit("property", newResult);
    } catch (error) {
      socket.disconnect();
      console.log(error);
    }
  });

  // socket.on("disconnect", () => {
  //   console.log("disconnect");
  //   socket.disconnect();
  //   clearInterval(interval);
  // });
};
