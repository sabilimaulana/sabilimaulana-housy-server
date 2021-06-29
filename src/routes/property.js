const { Router } = require("express");
const db = require("../models");
const { Property, City } = require("../models");

const bodyParser = require("body-parser");

const router = Router();

const checkAuth = require("../../middleware/check-auth.js");

const multer = require("multer");
const { route } = require("./user");

const {
  getAllProperties,
  getProperty,
  deleteProperty,
  updateProperty,
  addProperty,
} = require("../../controllers/property.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 },
});

//
//
// Get All Houses
router.get("/properties", getAllProperties);

// Get one house with id
router.get("/property/:id", getProperty);

// Untuk menghapus property berdasarkan id
// Mengapa kita perlu request body jika kita hanya perlu id?
router.delete("/property/:id", checkAuth, deleteProperty);

// Untuk mengedit property berdasarkan id
// dengan body berbentuk JSON
router.patch("/property/:id", checkAuth, updateProperty);

// Untuk menambah property
// dengan body berupa multipart form
router.post(
  "/property",
  checkAuth,
  upload.array("uploadedImages", 4),
  addProperty
);

module.exports = router;
