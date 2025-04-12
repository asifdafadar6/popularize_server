const Razorpay = require("razorpay");
require("dotenv").config();


// console.log("🔹 Razorpay API Key:", process.env.RAZORPAY_API_KEY);
// console.log("🔹 Razorpay API Secret Loaded:", process.env.RAZORPAY_SECRET_KEY ? "Yes" : "No");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

module.exports = instance;
