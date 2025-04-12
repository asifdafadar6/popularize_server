const user_details = require("../models/user");

const { generateJwtToken } = require("../middlewares/jwt");

class loginController {

  static login = async (req, res) => {
    
    const { userEmail, password } = req.body;
    try {
      const existingUser = await user_details.findOne({ userEmail });
      if (!existingUser) {
        return res.status(400).json({ msg: "Incorrect Email Id." });
      }

      if (password !== existingUser.userPassword) {
        return res.status(400).json({ msg: "Incorrect Password." });
      }

      const payload = {
        id: existingUser._id,
        userName: existingUser.userName,
        email: existingUser.userEmail,
        role: existingUser.role,
      };

      const token = generateJwtToken(payload);

      return res.status(200).json({
        msg: "Welcome" + " " + existingUser.userName,
        payload: payload,
        token: token,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Something wrong is happened in the backend" });
    }
  }
}


module.exports = loginController;
