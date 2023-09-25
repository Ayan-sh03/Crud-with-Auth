const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  forgotPasswordHandler,
  resetPasswordHandler,
} = require("../controllers/userController");
const validateToken = require("../middleware/validate");

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/current", validateToken, currentUser);
userRouter.post("/forgot", forgotPasswordHandler);
userRouter.patch("/reset/:token", resetPasswordHandler);
// router.post

module.exports = userRouter;
