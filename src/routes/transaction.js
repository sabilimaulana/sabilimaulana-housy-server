const { Router } = require("express");
const multer = require("multer");
const {
  addTransaction,
  getAllTransactions,
  updateTransaction,
  getTransactionById,
  getOrder,
  getHistory,
  getTransactionsByOwnerId,
} = require("../controllers/transaction");
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

const router = Router();

router.post("/transaction", addTransaction);

router.get("/transactions", getAllTransactions);

router.patch(
  "/transaction/:id",
  upload.single("proofImage"),
  updateTransaction
);

router.get("/transaction/:id", getTransactionById);

// Opsional
router.get("/transactions/order", checkAuth, getOrder);

router.get("/transactions/history", checkAuth, getHistory);

router.get("/transactions/:ownerId", checkAuth, getTransactionsByOwnerId);

module.exports = router;
