const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const loginController = require("../controller/loginController")
const ProfileController = require("../controller/profileController");
const forgetPasswordController = require("../controller/forgetPasswordController");
const createOfferController = require("../controller/createOfferController");
const planController = require("../controller/planController");
const subplanController = require("../controller/subplanController");
const memberShipController = require("../controller/membershipController");
const paymentController = require("../controller/paymentController");
const addressController = require("../controller/addressController");
const reviewController = require("../controller/reviewController");
const influencerController = require("../controller/influencerController");
const dummyMessage = require("../controller/dummyMessage");
const acceptofferController = require("../controller/acceptofferController");


router.get("/viewallprofile", ProfileController.getAllUsers);
router.get("/viewprofilebyid/:id", ProfileController.getUserById);
router.post("/registration", upload.fields([{ name: "profileImage", maxCount: 1 }]),ProfileController.insertProfile);
router.put("/editprofile/:id", upload.single("profileImage"),ProfileController.editProfile);
router.delete("/deleteprofile/:id",ProfileController.deleteProfile);

router.post("/login",loginController.login);

router.post("/confirmemail",forgetPasswordController.confirmEmail);
router.post("/checkotp",forgetPasswordController.checkOtp);
router.post("/changepasswrod",forgetPasswordController.changePassword);

router.get("/getAllAddress",addressController.getAllAddress);
router.get("/getAddressById/:id",addressController.getAddressById);
router.post("/insertAddress",addressController.insertAddress);
router.put("/editAddress/:id",addressController.editAddress);
router.delete("/deleteAddress/:id",addressController.deleteAddress);

router.get("/getAlloffers",createOfferController.getAllOffers);
router.get("/getofferById/:id",createOfferController.getOfferById);
router.get("/getofferBybusinessId/:businessId",createOfferController.getOfferBybusinessId);
router.post("/insertoffer", upload.fields([{ name: "offerImg", maxCount: 1 }]),createOfferController.insertOffers);
router.put("/editoffer/:id", upload.fields([{ name: "offerImg", maxCount: 1 }]),createOfferController.editOffers);
router.delete("/deleteoffer/:id",createOfferController.deleteOffers);
router.get("/viewofferdeletedhistory/:businessId",createOfferController.viewofferdeletedhistory);

router.post("/createPlan",planController.createPlan);
router.get("/getAllPlans",planController.getAllPlans);
router.get("/getPlansById/:id",planController.getPlansById);
router.put("/editPlans/:id", planController.editPlans);
router.delete("/deletePlans/:id",planController.deletePlans);


router.post("/createSubplan",subplanController.createSubplan);
router.get("/allsubplans", subplanController.getAllSubPlans);        
router.get("/subplans/:id", subplanController.getAllSubPlansById); 
router.get("/planbyid/:planId", subplanController.planbyid); 
router.put("/editsubplans/:id", subplanController.editSubPlans);   
router.delete("/deletesubplans/:id", subplanController.deleteSubPlans); 


router.post("/buyMembership",memberShipController.buyMembership);

router.get("/getAllPayment",paymentController.getAllPayments);
router.get("/getPaymentsbyId",paymentController.getPaymentsbyId);
router.post("/payment/process",paymentController.ProcessPaymentController);
router.get("/getkey",paymentController.getKey);
router.post("/paymentVerification",paymentController.paymentVerification);

router.get("/getAllreview",reviewController.getAllreview);
router.get("/getreviewbyreviewId/:id",reviewController.getreviewbyreviewId);
router.post("/givereview",reviewController.insertreview);
router.put("/editreview/:id",reviewController.editreview);
router.delete("/deletereview/:id",reviewController.deletereview);

router.get("/getAllinflu",influencerController.getAllinfluencer);
router.get("/getinfluencerById/:id",influencerController.getinfluencerById);


router.get('/getmessage/:id', dummyMessage.getmessagebysenderId);
router.post("/sendmessage/:reciverid",dummyMessage.sendMessage);


router.get("/getofferbyinflu",acceptofferController.getofferbyinflu);
router.get("/getofferbybusiness",acceptofferController.getofferbybusiness);
router.post("/acceptoffer",acceptofferController.acceptoffer);


module.exports = router;
 