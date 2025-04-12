const acceptoffer = require("../models/acceptoffer");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

class acceptofferController {
  
    static getofferbyinflu = async (req, res) => {
      try {
          const authHeader = req.headers.authorization;

          if (!authHeader || !authHeader.startsWith("Bearer ")) {
              return res.status(401).json({
                  success: false,
                  msg: "Unauthorized access. Please log in.",
              });
          }

          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.id;

          // Fetch all accepted offers by influencer with non-null offerId
          const offerbyinflu = await acceptoffer.find({ 
              userId,
              offerId: { $exists: true, $ne: null } // Ensure offerId exists and isn't null
          }).populate({
              path: "offerId",
              match: { _id: { $exists: true } } // Only populate if offer exists
          });

          // Filter out documents where population failed (offerId is null)
          const validOffers = offerbyinflu.filter(offer => offer.offerId !== null);

          // Use a Set to filter unique offerId entries
          const uniqueOffers = [];
          const seenOfferIds = new Set();

          for (const offer of validOffers) {
              const offerIdStr = offer.offerId._id.toString();
              
              if (!seenOfferIds.has(offerIdStr)) {
                  seenOfferIds.add(offerIdStr);

                  // Fetch business details
                  const businessDetails = await user.findById(offer.offerId.businessId)
                      .select("-userPassword")
                      .lean();

                  uniqueOffers.push({
                      ...offer.toObject(),
                      businessDetails,
                  });
              }
          }

          return res.status(200).json({
              success: true,
              offersWithBusinessDetails: uniqueOffers,
          });

      } catch (err) {
          console.error("Error in getofferbyinflu:", err); // More detailed error logging
          return res.status(500).json({
              success: false,
              msg: "Failed to retrieve offers. Please try again later.",
              error: process.env.NODE_ENV === 'development' ? err.message : undefined
          });
      }
    };
    
    // static getofferbybusiness = async (req, res) => {
    //   try {
    //     const authHeader = req.headers.authorization;
    //     if (!authHeader?.startsWith("Bearer ")) {
    //       return res.status(401).json({ success: false, message: "Unauthorized" });
    //     }
    
    //     const token = authHeader.split(" ")[1];
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     const businessId = decoded.id;
    
    //     // Find offers with non-null offerId
    //     const acceptedOffers = await acceptoffer.find({ 
    //       businessId,
    //       offerId: { $exists: true, $ne: null } // Only documents with offerId
    //     })
    //     .populate({
    //       path: 'offerId',
    //       match: { _id: { $exists: true } }, // Only populate if exists
    //       populate: {
    //         path: 'businessId',
    //         select: '-userPassword'
    //       }
    //     })
    //     .populate({
    //       path: 'userId',
    //       select: '-userPassword'
    //     });
    
    //     // Filter out any documents where population failed
    //     const validOffers = acceptedOffers.filter(offer => 
    //       offer.offerId && offer.offerId._id && offer.userId
    //     );
    
    //     if (validOffers.length === 0) {
    //       return res.status(404).json({
    //         success: false,
    //         message: "No valid offers found"
    //       });
    //     }
    
    //     const offersMap = new Map();
    
    //     validOffers.forEach(offer => {
    //       const offerId = offer.offerId._id.toString();
    //       if (!offersMap.has(offerId)) {
    //         offersMap.set(offerId, {
    //           offer: offer.offerId,
    //           influencers: []
    //         });
    //       }
    //       if (offer.userId) {
    //         offersMap.get(offerId).influencers.push(offer.userId);
    //       }
    //     });
    
    //     return res.status(200).json({
    //       success: true,
    //       offers: Array.from(offersMap.values())
    //     });
    
    //   } catch (err) {
    //     console.error("Error in getofferbybusiness:", err);
    //     return res.status(500).json({
    //       success: false,
    //       message: err.name === 'JsonWebTokenError' 
    //         ? 'Invalid token' 
    //         : `Server error: ${err.message}`
    //     });
    //   }
    // };

    static getofferbybusiness = async (req, res) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
          return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const businessId = decoded.id;
    
        const userlist = await acceptoffer.find({ businessId }).populate("offerId").populate("userId");
    
        return res.status(200).json({
          success: true,
          userlist
      });
      } catch (err) {
        console.error("Error in getofferbybusiness:", err);
        return res.status(500).json({
          success: false,
          message: err.name === 'JsonWebTokenError' 
            ? 'Invalid token' 
            : `Server error: ${err.message}`
        });
      }
    };

    static acceptoffer = async (req, res) => {
      const { businessId, offerId } = req.body;

      try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({
            success: false,
            msg: "Unauthorized access. Please log in.",
          });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const isComplete = "Complete";

        const newOffer = await acceptoffer.create({
          userId,
          businessId,
          offerId,
          isComplete,
        });

        return res.status(201).json({
          success: true,
          msg: "Congratulation",
          data: newOffer,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          msg: `Something went wrong in backend like - ${err.message}`,
        });
      }
    };
}
module.exports = acceptofferController;
