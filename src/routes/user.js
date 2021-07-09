const { Router } = require("express");
const bodyParser = require("body-parser");
const db = require("../models");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// Harusnya ini ada di .env

const router = Router();

const {
  signin,
  signup,
  getAllUsers,
  deleteUser,
  getUserByUsername,
  updateProfilePicture,
  getProfile,
  changePassword,
} = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

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

// router.get("/get-users", (req, res) => {
//   db.User.findAll().then((users) => res.send(users));
// });

router.post("/signin", signin);

router.post("/signup", signup);

router.get("/users", getAllUsers);

router.delete("/user/:id", deleteUser);

// Opsional
router.get("/user/username", getUserByUsername);

router.patch(
  "/user/profile-picture/",
  checkAuth,
  upload.single("profilePicture"),
  updateProfilePicture
);

router.get("/user/profile", checkAuth, getProfile);

router.patch("/user/change-password", checkAuth, changePassword);

module.exports = router;
