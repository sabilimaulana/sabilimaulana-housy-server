const { Router } = require("express");
const {
  addTransaction,
  getAllTransactions,
  updateTransaction,
  getTransactionById,
} = require("../controllers/transaction");

const router = Router();

router.post("/transaction", addTransaction);

router.get("/transactions", getAllTransactions);

router.patch("/transaction/:id", updateTransaction);

router.get("/transaction/:id", getTransactionById);

module.exports = router;
