const mongoose = require("../database/dbconnection");


const schema = mongoose.Schema(
  {
    plantype: { type: String },
    planname:{type: String},
    duration: { type: String },
    discount :{type:String},
    originalprice :{type:String},
    sellingprice :{type:String},
  },
  {
    timestamps: true,
  }
);

const plan = mongoose.model("plan", schema);
module.exports = plan;