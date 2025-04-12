const jwt = require("jsonwebtoken");
const membership = require("../models/membership");
const user = require("../models/user");

class memberShipController {
    
    static buyMembership = async (req, res) => {
        
        try {
            const { subplanId } = req.body;
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    msg: "Unauthorized access. Please log in."
                });
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            console.log("User Id:", userId);

            const insertmembership = await membership.create({
                subplanId, userId
            });

            return res.status(200).json({
                success: true,
                msg: "Congratulations, Membership purchase successful!",
                insertbuyMembership: insertmembership
            });

        } catch (err) {
            console.error("JWT Verification Error:", err);

            return res.status(500).json({
                success: false,
                msg: "Something went wrong on the backend."
            });
        }
    };


}

module.exports = memberShipController;
