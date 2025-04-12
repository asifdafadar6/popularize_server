const mongoose = require("../database/dbconnection");


const schema = mongoose.Schema(
  {
    userId :{type: mongoose.Schema.Types.ObjectId, ref: "user"},
    following :{type: mongoose.Schema.Types.ObjectId, ref: "user"},
    followers :{type: mongoose.Schema.Types.ObjectId, ref: "user"},
  },
  {
    timestamps: true,
  }
);

const followersSchema = mongoose.model("followersSchema", schema);
module.exports = followersSchema;