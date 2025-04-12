const mongoose = require("../database/dbconnection");


const schema = mongoose.Schema(
  {
    subplanId: { type: mongoose.Schema.Types.ObjectId, ref: "subplan" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const membership = mongoose.model("membership", schema);
module.exports = membership;