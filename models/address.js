const mongoose = require("../database/dbconnection");

const schema = mongoose.Schema(
  {
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },
    fullName:{type:String},
    mobileNo:{type:String},
    streetAddress:{type:String},
    city:{type:String},
    state:{type:String},
    zipCode:{type:String},
    country:{type:String},  
  },
  {
    timestamps: true,
  }
);

const address = mongoose.model("address", schema);
module.exports = address;
