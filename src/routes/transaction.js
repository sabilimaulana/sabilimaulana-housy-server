const { Router } = require("express");
const {
  addTransaction,
  getAllTransactions,
  updateTransaction,
  getTransactionById,
  getOrder,
  getHistory,
} = require("../controllers/transaction");
const checkAuth = require("../middleware/check-auth");

const router = Router();

router.post("/transaction", addTransaction);

router.get("/transactions", getAllTransactions);

router.patch("/transaction/:id", updateTransaction);

router.get("/transaction/:id", getTransactionById);

router.get("/transactions/order", checkAuth, getOrder);

router.get("/transactions/history", checkAuth, getHistory);

module.exports = router;
