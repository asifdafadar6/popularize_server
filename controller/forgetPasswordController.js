const user = require("../models/user");
const nodemailer = require("nodemailer");
const { generateJwtTokenForget } = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");

class forgetPasswordController {
  
  static confirmEmail = async (req, res) => {
    
    const { userEmail } = req.body;
    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    try {
      const existemail = await user.findOne({ userEmail });

      if (!existemail) {
        return res.status(404).json({ msg: "Email does not Exists" });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail", // Use your email provider
        port: 465,
        secure: true,
        auth: {
          user: "robiulislam5024@gmail.com",
          pass: "gfzpneyqfapoefvu",
        },
      });
      // Email content
      const mailOptions = {
        from: "robiulislam5024@gmail.com", // Sender address
        to: userEmail, // Recipient address
        subject: "Welcome Back to Populaize!",
        html: `
                      <p>Dear User,</p>
                      <p>Welcome to <strong>Populaize</strong>! We are delighted to have you join our community.</p>
                      <p>To Get your Password, please use the One-Time Password (OTP) provided below:</p>
                      <p style="font-size: 18px; font-weight: bold; color: #1998CD;">Your OTP: <strong>${randomDigits}</strong></p>
                      <p>Please note that this OTP is valid for the next <strong>10 minutes</strong>. Do not share this code with anyone for security reasons.</p>
                      <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
                      <p>Thank you for choosing <strong>Populaize</strong>. We look forward to serving you!</p>
                      <br>
                      <p>Best regards,</p>
                      <p><strong>Populaize Team</strong></p>
                  `,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      const payload = {
        user_id: existemail.id,
        user_email: existemail.userEmail,
        otp: randomDigits,
      };
      const token = generateJwtTokenForget(payload);

      return res.status(200).json({
        success: true,
        msg: "Otp Send To your Register Email Id",
        token: token,
        payload,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "Something wrong is happened in the backend" });
    }
  };

  static checkOtp = async (req, res) => {
    const { otp_g } = req.body;

    const authHeader = req.headers.authorization;
    if (!otp_g) {
      return res.status(400).json({
        success: false,
        msg: "Please provide OTP .",
      });
    }
    
    // Check if authHeader exists
    if (!authHeader) {
      return res.status(400).json({
        success: false,
        msg: "Please Confirm your Email Id",
      });
    }

    try {
      const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_email = decoded.user_email;
      const otp = decoded.otp;

      if (otp == otp_g) {
        res.status(200).json({
          success: true,
          msg: "OTP Verified.",
        });
      } else {
        return res.status(404).json({ msg: "OTP is Invalid" });
      }
    } catch (err) {
      console.log(err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          msg: "Token has expired. Please request a new OTP.",
        });
      }
      res
        .status(500)
        .json({ msg: "Something wrong is happened in the backend" });
    }
  };

  static changePassword = async (req, res) => {
    const { password } = req.body;
    const authHeader = req.headers.authorization;

    if (!password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide Password.",
      });
    }
    try {
      if (!authHeader) {
        return res.status(400).json({
          success: false,
          msg: "Please Confirm your Email Id",
        });
      }

      const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_email = decoded.user_email;

      const updatedUser = await user.findOneAndUpdate(
        { userEmail: user_email },
        { userPassword: password },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found." });
      }

      return res.status(200).json({
        success: true,
        msg: "Password updated successfully.",
      });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          msg: "Token has expired. Please request a new OTP.",
        });
      }
      console.log(err);
      res
        .status(500)
        .json({ msg: "Something wrong is happened in the backend" });
    }
  };
}

module.exports = forgetPasswordController;
