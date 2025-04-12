const Offers = require("../models/createOffer");
const offersdeletedhistory = require("../models/deletedOffershistory");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");


class CreateOfferController {

  static getAllOffers = async (req, res) => {
    try {
      const offers = await Offers.find().populate("businessId");

      if (!offers || offers.length === 0) {
        return res.status(404).json({
          success: false,
          msg: "No offers found",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        msg: "All offers retrieved successfully",
        data: offers,
      });
    } catch (err) {
      console.error("Error fetching offers:", err);
      return res.status(500).json({
        success: false,
        msg: "Something went wrong while fetching offers",
        error: err.message,
      });
    }
  };

  static getOfferById = async (req, res) => {
    try {
      const { id } = req.params;
      const offer = await Offers.findById(id).populate("businessId");

      if (!offer) {
        return res.status(404).json({
          success: false,
          msg: "Offer not found",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Offer Retrieved successfully",
        data: offer,
      });
    } catch (err) {
      console.error("Error fetching offer:", err);
      return res.status(500).json({
        success: false,
        msg: "Something went wrong while fetching the offer",
        error: err.message,
      });
    }
  };

  static getOfferBybusinessId = async (req, res) => {
    try {
      const { businessId } = req.params;
      const offer = await Offers.find({businessId}).populate("businessId");

      if (!offer) {
        return res.status(404).json({
          success: false,
          msg: "Offer not found",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Offer Retrieved successfully",
        data: offer,
      });
    } catch (err) {
      console.error("Error fetching offer:", err);
      return res.status(500).json({
        success: false,
        msg: "Something went wrong while fetching the offer",
        error: err.message,
      });
    }
  };

  static insertOffers = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          msg: "Unauthorized access. Please log in.",
        });
      }

      const { offerName, offerStartingDate, offerExpireDate, discount } =
        req.body;

      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const baseUrl = `${protocol}://${req.get("host")}`;

      if (!offerName || !offerStartingDate || !offerExpireDate || !discount) {
        return res.status(400).json({
          success: false,
          msg: "Missing required fields (offerName, offerStartingDate, offerExpireDate, discount)",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const businessId = decoded.id; 

      let offerImg = req.files?.offerImg?.[0]?.filename || null;
      if(!offerImg)
      {
        return res.status(400).json({
          success: false,
          msg: "Offer Image is Required.",
        });
      }
      const fullImagePath = offerImg ? `${baseUrl}/uploads/${offerImg}` : null;

      const newOffer = await Offers.create({
        businessId,
        offerName,
        offerStartingDate,
        offerExpireDate,
        discount,
        offerImg: fullImagePath,
      });

      return res.status(201).json({
        success: true,
        msg: "New offer created successfully",
        data: newOffer,
      });
    } catch (err) {
      console.error("Error inserting offer:", err);
      return res.status(500).json({
        success: false,
        msg: "Something went wrong while creating the offer",
        error: err.message,
      });
    }
  };

  static editOffers = async (req, res) => {
    try {
      const { id } = req.params;
      const updated_data = req.body;
  
      // Get base URL dynamically
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const baseUrl = `${protocol}://${req.get('host')}`;
  
      // Authorization check
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          msg: "Unauthorized access. Please log in.",
        });
      }
  
      // Extract user ID from token
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const businessId = decoded.id;
  
      // Fetch the existing offer
      const updatedOffer = await Offers.findById(id);
      if (!updatedOffer) {
        return res.status(404).json({
          success: false,
          msg: "Offer not found",
        });
      }
  
      // Ensure the logged-in user owns this offer
      if (updatedOffer.businessId.toString() !== businessId) {
        return res.status(403).json({
          success: false,
          msg: "You are not authorized to update this offer",
        });
      }
  
      // Handle offer image safely
      let offerImg = req.files?.offerImg?.[0]?.filename || null;
      if (offerImg) {
        updatedOffer.offerImg = `${baseUrl}/uploads/${offerImg}`;
      }
  
      // Update fields
      updatedOffer.offerName = updated_data.offerName || updatedOffer.offerName;
      updatedOffer.offerStartingDate =
        updated_data.offerStartingDate || updatedOffer.offerStartingDate;
      updatedOffer.offerExpireDate =
        updated_data.offerExpireDate || updatedOffer.offerExpireDate;
      updatedOffer.discount = updated_data.discount || updatedOffer.discount;
  
      // Save updated offer
      await updatedOffer.save();
  
      return res.status(200).json({
        success: true,
        msg: "Offer updated successfully",
        data: updatedOffer,
      });
  
    } catch (err) {
      console.error("Error updating offer:", err);
      return res.status(500).json({
        success: false,
        msg: "Something went wrong while updating the offer",
        error: err.message,
      });
    }
  };
  
  static deleteOffers = async (req, res) => {

    const offerId = req.params.id;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized access. Please log in.",
      });
    }

    if (offerId.length !== 24) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid 24-character ID." });
    }

          // Extract user ID from token
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const businessId = decoded.id;

    try {

      const existingOffer = await Offers.findById(offerId);

      if (!existingOffer) {
        return res.status(404).json({ msg: "Offer Not Found" });
      }

      const deleteOffer = await offersdeletedhistory.create({
        businessId,
        offerId,
        offerName: existingOffer.offerName,
        offerStartingDate: existingOffer.offerStartingDate,
        offerExpireDate: existingOffer.offerExpireDate,
        discount: existingOffer.discount,
        offerImg: existingOffer.offerImg,
      });

      await Offers.findByIdAndDelete(offerId);

      return res.status(200).json({
        msg: "Offer Deleted Successfully.",
        deleteOffer
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Something wrong happened in the backend." });
    }
  };

  static viewofferdeletedhistory = async(req,res) =>{
    try {
      const { businessId } = req.params;
      const offerhistory = await offersdeletedhistory.find({businessId}).populate("businessId");

      return res.status(200).json({
        success: true,
        msg: "List of Deleted Offer ",
        data: offerhistory,
      });
    } catch (err) {
      console.error("Error fetching offer:", err);
      return res.status(500).json({
        success: false,
        msg: "Something went wrong while fetching the offer",
        error: err.message,
      });
    }
  }

}

module.exports = CreateOfferController;
