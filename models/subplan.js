const mongoose = require("../database/dbconnection");


const schema = mongoose.Schema(
  {
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "plan" },
    subplanname:{type: String},
    subplandetails: { type: String },
    subsellingprice :{type:String},
    duration: {type:Number},
    durationTime:{type:String}
  },
  {
    timestamps: true,
  }
);

const subplan = mongoose.model("subplan", schema);
module.exports = subplan;