const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  forgotPasswordHandler,
  resetPasswordHandler,
} = require("../controllers/userController");
const validateToken = require("../middleware/validate");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);
router.post("/forgot", forgotPasswordHandler);
router.patch("/reset/:token", resetPasswordHandler);
// router.post

module.exports = router;
