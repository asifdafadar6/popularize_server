const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    },
    productid: {
        type: mongoose.Schema.Types.ObjectId, ref: "subplan"
    },
    amount: {
        type: Number,
        required: true,
    },
    planExpire:{
      type:Date
    },
    razorpay_payment_id: {
        type: String,
        // required: true,
    },
    razorpay_order_id: {
        type: String,
        // required: true,
    },
    razorpay_signature: {
        type: String,
        // required: true,
    },
    status: {
        type: String,
        default: "Pending",
    },
}, { timestamps: true });


const payment = mongoose.model("Payment", PaymentSchema);
module.exports = payment;

