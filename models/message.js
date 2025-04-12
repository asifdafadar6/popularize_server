const mongoose = require("../database/dbconnection");


const schema = mongoose.Schema(
  {
    senderId :{type: mongoose.Schema.Types.ObjectId, ref: "user"},
    reciverId :{type: mongoose.Schema.Types.ObjectId, ref: "user"},
    text :{type: String},
  },
  {
    timestamps: true,
  }
);

const message = mongoose.model("message", schema);
module.exports = message;