const express = require("express");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const transporter = require("./transporter.js");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvail = await User.findOne({ email, username });
  if (userAvail) {
    res.status(400);
    throw new Error("User already exists");
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({ _id: user._id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }

  res.json({ message: "Register the user" });
});
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ username });

  //compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("password is not valid");
  }
});
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const forgotPasswordHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if the user with the provided email exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a JWT for password reset with a short expiration time
  const resetToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // Store the reset token and its expiration date in the user's document
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send an email to the user with the reset token
  const mailOptions = {
    from: `${process.env.EMAIL}`,
    to: user.email,
    subject: "Password Reset",
    text: `To reset your password, click on this link: http://localhost:8080/api/users/reset/${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Email sending failed" });
    }


    

    res.status(200).json({ message: "Password reset email sent successfully" });
  });
});

const resetPasswordHandler = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ _id: decodedToken.userId });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();
    const Updateduser = await User.findOne({ _id: decodedToken.userId });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Password reset failed" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  forgotPasswordHandler,
  resetPasswordHandler,
};
