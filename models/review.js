const mongoose = require("../database/dbconnection");


const schema = mongoose.Schema(
  {
    rating: { type: Number },
    review:{type: String},
    // link: { type: String },
    link: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        link: String,
      }
    ],
    recivedreviewId:{type: mongoose.Schema.Types.ObjectId, ref: "user"},
    userId :{type: mongoose.Schema.Types.ObjectId, ref: "user"}
  },
  {
    timestamps: true,
  }
);

const review = mongoose.model("review", schema);
module.exports = review;