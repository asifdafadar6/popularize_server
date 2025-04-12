const mongoose = require("../database/dbconnection");

const schema = mongoose.Schema(
  {
    userName: { type: String },
    userEmail:{type: String},
    intraID: { type: String },
    type:{type:String},
    userPassword :{type:String},
    companyName :{type:String},
    brandName :{type:String},
    gstNumber :{type:String},
    profileImage :{type:String},
    role:{type:String}
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", schema);
module.exports = user;
