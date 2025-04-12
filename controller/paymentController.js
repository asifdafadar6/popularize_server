require("dotenv").config();
const crypto = require("crypto");
const instance = require("../razorparInstance");
const payment = require("../models/payment");
const membership = require("../models/membership");
const jwt = require("jsonwebtoken");

class paymentController {
  static ProcessPaymentController = async (req, res) => {
    const { productid, amount } = req.body;

    try {
      const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
      };
      const order = await instance.orders.create(options);

      return res.status(200).json({ success: true, order });
    } catch (err) {
      console.log(err);
      res
        .status(404)
        .json({ msg: "Something wrong is happened in the backend" });
    }
  };

  static getKey = async (req, res) => {
    res.status(200).json({
      key: process.env.RAZORPAY_API_KEY,
    });
  };

  static paymentVerification = async (req, res) => {
    console.log(req.body);
    if (req.body.amount == 0) {
      const { userId, productid, amount, status, duration } = req.body;
      const date = new Date();
      const futureDate = new Date();
      futureDate.setDate(date.getDate() + duration);
      const durationDate = futureDate.toISOString().split("T")[0];

      const existUser = await payment.findOne({ userId });

      if (existUser) {
        existUser.productid = req.body.productid || existUser.productid;
        existUser.amount = req.body.amount || existUser.amount;
        existUser.planExpire = req.body.durationDate || existUser.planExpire;
        existUser.razorpay_payment_id = "free";
        existUser.razorpay_order_id = "free";
        existUser.razorpay_signature = "free";
        existUser.status = "success";

        await existUser.save();

        return res.status(200).json({
          msg: "Payment Updated Successfully.",
          existUser,
          success: true,
        });
      }

      const insertPayment = await payment.create({
        productid,
        userId,
        amount,
        planExpire: durationDate,
        razorpay_payment_id: "free",
        razorpay_order_id: "free",
        razorpay_signature: "free",
        status,
      });
      console.log("product id:", productid);

      return res.status(200).json({
        success: true,
        msg: "Payment verified and stored successfully",
        paymentDetails: insertPayment,
      });
    }
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
      productid,
      amount,
      status,
      duration,
    } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    const date = new Date();
    const futureDate = new Date();
    futureDate.setDate(date.getDate() + duration);
    const durationDate = futureDate.toISOString().split("T")[0];

    // console.log("Current Date:", date.toISOString().split("T")[0]); // YYYY-MM-DD
    // console.log("Future Date:", futureDate.toISOString().split("T")[0]);

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      // return res.redirect(`paymentSuccess?reference=${razorpay_payment_id}`);
      console.log("Payment Complete");

      const existUser = await payment.findOne({ userId });

      if (existUser) {
        //   return res.status(404).json({ msg: "Email Already Exists" });
        // const existingUser = await user.findById(id);
        // if (!existingUser) {
        //     return res.status(404).json({ msg: "User not found." });
        // }

        existUser.productid = req.body.productid || existUser.productid;
        existUser.amount = req.body.amount || existUser.amount;
        existUser.planExpire = req.body.durationDate || existUser.planExpire;
        existUser.razorpay_payment_id =
          req.body.razorpay_payment_id || existUser.razorpay_payment_id;
        existUser.razorpay_order_id =
          req.body.razorpay_order_id || existUser.razorpay_order_id;
        existUser.razorpay_signature =
          req.body.razorpay_signature || existUser.razorpay_signature;
        existUser.status = "success";

        await existUser.save();

        return res.status(200).json({
          msg: "Payment Updated Successfully.",
          existUser,
          success: true,
        });
      }

      const insertPayment = await payment.create({
        productid,
        userId,
        amount,
        planExpire: durationDate,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        status,
      });
      console.log("product id:", productid);

      return res.status(200).json({
        success: true,
        msg: "Payment verified and stored successfully",
        paymentDetails: insertPayment,
      });
    } else {
      res.status(404).json({
        success: false,
        msg: "Payment failed",
      });
    }
  };

  static getAllPayments = async (req, res) => {
    try {
      const payments = await payment
        .find()
        .sort({ createdAt: -1 })
        .populate("productid");

      if (!payments.length) {
        return res
          .status(404)
          .json({ success: false, msg: "No payments found" });
      }

      return res.status(200).json({ success: true, payments });
    } catch (err) {
      console.error("Error fetching all payments:", err);
      res.status(500).json({ success: false, msg: "Failed to fetch payments" });
    }
  };


  
  static getPaymentsbyId = async (req, res) => {

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          msg: "Please First Make login.",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id; // which person give review

      const payments = await payment
        .find(userId)
        .sort({ createdAt: -1 })
        .populate("productid");

      if (!payments.length) {
        return res
          .status(404)
          .json({ success: false, msg: "No payments found" });
      }

      return res.status(200).json({ success: true, payments });
    } catch (err) {
      console.error("Error fetching all payments:", err);
      res.status(500).json({ success: false, msg: "Failed to fetch payments" });
    }
  };
}

module.exports = paymentController;
