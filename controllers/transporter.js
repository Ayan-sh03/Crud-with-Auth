const nodemailer = require("nodemailer");
require("dotenv").config();
// Create a Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  logger: true,
  secure: true,
  //   debug: true,
  secureConnection: false,
  auth: {
    user: process.env.EMAIL, // Your Gmail email address
    pass: process.env.PASS, // Your Gmail password or an app-specific password
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer setup error:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

module.exports = transporter;
