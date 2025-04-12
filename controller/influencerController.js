const user = require("../models/user");
const followers = require("../")

class influencerController {
  static getAllinfluencer = async (req, res) => {
    try {
      const allinflu = await user.find({ role: "influencer" });
      if (allinflu.length > 0) {
        return res.status(200).json({ allinflu });
      } else {
        return res.status(404).json({ msg: "No Data is Here.." });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "Something wrong is happened in the backend" });
    }
  };

  static getinfluencerById = async (req, res) => {
    const influId = req.params.id;
    try {
      const influData = await user.findById(influId);

      if (influData) {
        return res.status(200).json({ influData });
      } else {
        return res.status(404).json({ msg: "No Data is Here.." });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "Something went wrong in the backend",
        error: err.message,
      });
    }
  };



}

module.exports = influencerController;
