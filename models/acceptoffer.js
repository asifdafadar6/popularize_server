const mongoose = require("../database/dbconnection");

const schema = mongoose.Schema(
  {
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: "createOffer" },
    isComplete: { type: String, },
  },
  {
    timestamps: true,
  }
);

const acceptoffer = mongoose.model("acceptoffer", schema);
module.exports = acceptoffer;
