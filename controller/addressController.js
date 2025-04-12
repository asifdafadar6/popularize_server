const Address = require("../models/address"); // Import the Address model

class addressController {
  
  // Get all addresses
  static getAllAddress = async (req, res) => {
    try {
      const addresses = await Address.find().populate("userId", "fullName email"); // Populate user details
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching addresses", error });
    }
  };

  // Get address by ID
  static getAddressById = async (req, res) => {
    try {
      const { id } = req.params;
      const address = await Address.findById(id);

      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ message: "Error fetching address", error });
    }
  };

  // Insert a new address
  static insertAddress = async (req, res) => {
    try {
      const { userId, fullName, streetAddress, city, state, zipCode, country } = req.body;

      const newAddress = new Address({
        userId,
        fullName,
        streetAddress,
        city,
        state,
        zipCode,
        country,
      });

      const savedAddress = await newAddress.save();
      res.status(201).json({ message: "Address added successfully", savedAddress });
    } catch (error) {
      res.status(500).json({ message: "Error inserting address", error });
    }
  };

  // Edit address
  static editAddress = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedAddress = await Address.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }

      res.status(200).json({ message: "Address updated successfully", updatedAddress });
    } catch (error) {
      res.status(500).json({ message: "Error updating address", error });
    }
  };

  // Delete address
  static deleteAddress = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedAddress = await Address.findByIdAndDelete(id);

      if (!deletedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }

      res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting address", error });
    }
  };
}

module.exports = addressController;
