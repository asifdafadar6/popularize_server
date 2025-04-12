const user = require("../models/user");
const fs = require("fs");
const path = require("path");

class ProfileController {
  static getAllUsers = async (req, res) => {
    try {
      let all_data = await user.find();

      if (all_data.length > 0) {
        return res.status(200).json({ all_data });
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

  static getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Fetch user details
        const userDetails = await user.findById(id);

        if (!userDetails) {
            return res.status(404).json({ msg: "User ID not found" });
        }

        return res.status(200).json({ userDetails });

    } catch (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ msg: "Internal server error. Please try again later." });
    }
};

  static insertProfile = async (req, res) => {
    const body = req.body;
    
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const baseUrl = `${protocol}://${req.get('host')}`;

    const role = body.role;

    try {
      const existemail = await user.findOne({ userEmail: body.userEmail });

      if (existemail) {
        return res.status(404).json({ msg: "Email Already Exists" });
      }

      let profileImage =
        req.files?.profileImage?.[0]?.filename || "defaultImage.png";

      const missingFields =
        role === "influencer"
          ? !body.userName ||
            !body.userEmail ||
            !body.intraID ||
            !body.type ||
            !body.userPassword
          : !body.companyName ||
            !body.brandName ||
            !body.gstNumber ||
            !body.userEmail ||
            !body.intraID ||
            !body.userPassword;

      if (missingFields) {
        if (profileImage !== "defaultImage.png") {
          try {
            fs.unlinkSync(
              path.join(__dirname, "../public/uploads", profileImage)
            );
          } catch (err) {
            console.error("Failed to delete image:", err);
          }
        }
        return res.status(404).json({ msg: "Please Provide All Fields" });
      }

      const fullImagePath = `${baseUrl}/uploads/${profileImage}`;
      const insertuser = await user.create({
        ...body,
        profileImage: fullImagePath,
      });

      return res.status(201).json({
        msg:
          role === "influencer"
            ? "Influencer Profile Created Successfully"
            : "Business Profile Created Successfully",
        insertuser,
      });
    } catch (err) {
      console.error(err);

      if (profileImage !== "defaultImage.png") {
        try {
          fs.unlinkSync(
            path.join(__dirname, "../public/uploads", profileImage)
          );
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }

      return res
        .status(500)
        .json({ msg: "Something went wrong in the backend" });
    }
  };

  
  static editProfile = async (req, res) => {
    try {
        console.log(req.body);

        const { id } = req.params;
        const updated_data = req.body;

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const baseUrl = `${protocol}://${req.get('host')}`;
        console.log(baseUrl);
        // Find existing user
        const existingUser = await user.findById(id);
        if (!existingUser) {
            return res.status(404).json({ msg: "User not found." });
        }

        // Handle profile image update
        if (req.file) {
            const newImage = req.file.filename;

            // Delete old image if it exists and is not the default image
            if (existingUser.profileImage && !existingUser.profileImage.includes("defaultImage.png")) {
                const oldImagePath = path.join(__dirname, "../public/uploads", path.basename(existingUser.profileImage));
                if (fs.existsSync(oldImagePath)) {
                    await fs.promises.unlink(oldImagePath);
                }
            }
            // Update profile image path
            existingUser.profileImage = `${baseUrl}/uploads/${newImage}`;
        }

        // Update other fields
        existingUser.intraID = updated_data.intraID || existingUser.intraID;
        existingUser.userEmail = updated_data.userEmail || existingUser.userEmail;
        existingUser.userPassword = updated_data.userPassword || existingUser.userPassword;

        if (existingUser.role === "influencer") {
            existingUser.userName = updated_data.userName || existingUser.userName;
            existingUser.type = updated_data.type || existingUser.type;
        } else if (existingUser.role === "business") {
            existingUser.companyName = updated_data.companyName || existingUser.companyName;
            existingUser.brandName = updated_data.brandName || existingUser.brandName;
            existingUser.gstNumber = updated_data.gstNumber || existingUser.gstNumber;
        }

        // Save the updated user
        await existingUser.save();

        return res.status(200).json({ msg: "Profile Updated Successfully.", existingUser });

    } catch (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({ msg: "Internal server error." });
    }
};

  static deleteProfile = async (req, res) => {
    const user_id = req.params.id;

    if (user_id.length !== 24) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid 24-character ID." });
    }

    try {
      const existingUser = await user.findById(user_id);

      if (!existingUser) {
        return res.status(404).json({ msg: "User Not Found" });
      }
      
      if (
        existingUser.profileImage &&
        !existingUser.profileImage.includes("defaultImage.png")
      ) {
        const imagePath = path.join(
          __dirname,
          "../public/uploads",
          path.basename(existingUser.profileImage)
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the file
        }
      }
      await user.findByIdAndDelete(user_id);

      return res.status(200).json({ msg: "Profile Deleted Successfully." });
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Something wrong happened in the backend." });
    }
  };
}

module.exports = ProfileController;
