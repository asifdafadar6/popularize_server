const mongoose = require("../database/dbconnection");

const schema = mongoose.Schema(
  {
    businessId :{type: mongoose.Schema.Types.ObjectId, ref: "user"},
    offerId:{type: mongoose.Schema.Types.ObjectId, ref: "createOffer"},
    offerName: { type: String },
    offerStartingDate:{type:String},
    offerExpireDate:{type:String},
    discount:{type:String},
    offerImg:{type:String},
    status:{type:String,default:"Deleted"}
  },
  {
    timestamps: true,
  }
);

const deletedofferhistory = mongoose.model("deletedofferhistory", schema);
module.exports = deletedofferhistory;
