const mongoose = require("../database/dbconnection");

const schema = mongoose.Schema(
  {
    offerName: { type: String },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    offerStartingDate:{type:String},
    offerExpireDate:{type:String},
    discount:{type:String},
    offerImg:{type:String},
  },
  {
    timestamps: true,
  }
);

const createOffer = mongoose.model("createOffer", schema);
module.exports = createOffer;