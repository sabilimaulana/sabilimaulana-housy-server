const db = require("../models");
const { City } = require("../models");

const socketProperty = require("./property");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

const socketIo = (io) => {
  io.on("connection", (socket) => {
    console.log("new client connected: ", socket.id);
    // interval = setInterval(async () => {
    //   const messages = await Chat.findAll({
    //     attributes: ["id", "message"],
    //   });
    //   socket.emit("messages", messages);
    // }, 2000);

    // socket.on("message", async (data) => {
    //   await Chat.create({ message: data });
    //   socket.emit("messages", messages);
    // });

    // socket.on("disconnect", () => {
    //   console.log("disconnect");
    //   socket.disconnect();
    //   clearInterval(interval);
    // });
  });

  // create namespace / route
  const propertyNameSpace = io.of("/property");

  propertyNameSpace.on("connection", (socket) => {
    let interval;

    interval = setInterval(async () => {
      // socketProperty.respond(socket);
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
      console.log("connect to /property");
    }, 5000);

    socket.on("disconnect", () => {
      console.log("disconnect");
      socket.disconnect();
      clearInterval(interval);
    });

    socketProperty.respond(socket);
  });

  // // create middleware
  // propertyNameSpace.use((socket, next) => {
  //   if (socket.handshake.auth && socket.handshake.auth.token) {
  //     const token = socket.handshake.auth.token;
  //     socket.token = token;
  //     next();
  //   } else {
  //     const err = new Error("not authorized");
  //     next(err);
  //   }
  // });
};

module.exports = socketIo;
