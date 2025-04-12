const reviews = require("../models/review");
const users = require("../models/user");
const jwt = require("jsonwebtoken");

class reviewController {

  static getAllreview = async (req, res) => {
    try {
      const alldata = await reviews
        .find()
        .populate("userId")
        .populate("recivedreviewId");
         console.log(alldata);
      // 🕒 Function to Convert Date to "Time Ago" Format
      const getTimeAgo = (date) => {
        const now = new Date();
        const seconds = Math.floor((now - new Date(date)) / 1000);

        const intervals = [
          { label: "year", seconds: 31536000 },
          { label: "month", seconds: 2592000 },
          { label: "week", seconds: 604800 },
          { label: "day", seconds: 86400 },
          { label: "hour", seconds: 3600 },
          { label: "minute", seconds: 60 },
          { label: "second", seconds: 1 },
        ];

        for (let interval of intervals) {
          const count = Math.floor(seconds / interval.seconds);
          if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
          }
        }

        return "just now";
      };

      // Add "timeAgo" field to each review
      const formattedReviews = alldata.map((review) => ({
        ...review._doc,
        timeAgo: getTimeAgo(review.createdAt),
      }));

      if (formattedReviews.length > 0) {
        return res.status(200).json({ alldata: formattedReviews });
      } else {
        return res.status(404).json({ msg: "No Data is Here.." });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "Something went wrong in the backend" });
    }
  };

  // static getreviewbyId = async (req, res) => {
  //   const findbyuserid = req.params.id; // Get review ID from URL

  //   try {
  //     const review = await review
  //       .find({ userId: findbyuserid })
  //       .populate("userId");

  //     if (!review) {
  //       return res.status(404).json({ msg: "No review found" });
  //     }
  //     // 🕒 Function to Convert Date to "Time Ago" Format
  //     const getTimeAgo = (date) => {
  //       const now = new Date();
  //       const seconds = Math.floor((now - new Date(date)) / 1000);

  //       const intervals = [
  //         { label: "year", seconds: 31536000 },
  //         { label: "month", seconds: 2592000 },
  //         { label: "week", seconds: 604800 },
  //         { label: "day", seconds: 86400 },
  //         { label: "hour", seconds: 3600 },
  //         { label: "minute", seconds: 60 },
  //         { label: "second", seconds: 1 },
  //       ];

  //       for (let interval of intervals) {
  //         const count = Math.floor(seconds / interval.seconds);
  //         if (count >= 1) {
  //           return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  //         }
  //       }

  //       return "just now";
  //     };

  //     // Add "timeAgo" field to each review
  //     const formattedReviews = review.map((reviews) => ({
  //       ...reviews._doc,
  //       timeAgo: getTimeAgo(review.createdAt),
  //     }));

  //     if (formattedReviews.length > 0) {
  //       return res.status(200).json({ alldata: formattedReviews });
  //     } else {
  //       return res.status(404).json({ msg: "No Data is Here.." });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return res
  //       .status(500)
  //       .json({ msg: "Something went wrong in the backend" });
  //   }
  // };

  static getreviewbyreviewId = async (req, res) => {

    const findbyreviewid = req.params.id; // Get review ID from URL

    try {
      const review = await reviews
        .find({ _id: findbyreviewid })
        .populate("userId").populate("recivedreviewId");

      if (!review) {
        return res.status(404).json({ msg: "No review found" });
      }
      // 🕒 Function to Convert Date to "Time Ago" Format
      const getTimeAgo = (date) => {
        const now = new Date();
        const seconds = Math.floor((now - new Date(date)) / 1000);

        const intervals = [
          { label: "year", seconds: 31536000 },
          { label: "month", seconds: 2592000 },
          { label: "week", seconds: 604800 },
          { label: "day", seconds: 86400 },
          { label: "hour", seconds: 3600 },
          { label: "minute", seconds: 60 },
          { label: "second", seconds: 1 },
        ];

        for (let interval of intervals) {
          const count = Math.floor(seconds / interval.seconds);
          if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
          }
        }

        return "just now";
      };

      // Add "timeAgo" field to each review
      const formattedReviews = review.map((reviews) => ({
        ...reviews._doc,
        timeAgo: getTimeAgo(review.createdAt),
      }));

      if (formattedReviews.length > 0) {
        return res.status(200).json({ alldata: formattedReviews });
      } else {
        return res.status(404).json({ msg: "No Data is Here.." });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "Something went wrong in the backend" });
    }
  };

  static insertreview = async (req, res) => {
    const { rating, review, link, recivedreviewId } = req.body;

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
      const userId = decoded.id;  // which person give review

      if (!rating || !review) {
        return res
          .status(404)
          .json({ msg: "Please provide all fields", success: false });
      }

      const insertsubplan = await reviews.create({
        rating,
        review,
        link,
        userId,
        recivedreviewId,
      });

      return res.status(201).json({
        msg: "Plan Created Successfully",
        success: true,
        insertedSubData: insertsubplan,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "Something wrong is happened in the backend" });
    }
  };

  // static editreview = async (req, res) => {
  //   const reviewId = req.params.id;
  //   const updated_data = req.body;

  //   try {
  //     const existingReview = await reviews.findById(reviewId);

  //     if (!existingReview) {
  //       return res.status(404).json({ msg: "Review not found." });
  //     }
  //     const authHeader = req.headers.authorization;

  //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //       return res.status(401).json({
  //         success: false,
  //         msg: "Unauthorized access. Please log in.",
  //       });
  //     }

  //     const token = authHeader.split(" ")[1];
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     const userId = decoded.id;

  //     if (existingReview.userId.toString() !== userId) {
  //       return res
  //         .status(403)
  //         .json({ msg: "You can only edit your own reviews." });
  //     }
  //     existingReview.rating = updated_data.rating || existingReview.rating;
  //     existingReview.review = updated_data.review || existingReview.review;
  //     // existingReview.link = updated_data.link || existingReview.link;


  //     // ✅ Update specific link if provided
  //     if (updated_data.link && updated_data.link._id) {
  //       const linkIndex = existingReview.link.findIndex(
  //         (item) => item._id.toString() === updated_data.link._id
  //       );

  //       if (linkIndex !== -1) {
  //         existingReview.link[linkIndex].link = updated_data.link.link;
  //       }
  //     }

  //     await existingReview.save();

  //     return res
  //       .status(200)
  //       .json({ msg: "Review Updated Successfully.", existingReview });
  //   } catch (err) {
      
  //   }
  // };

  static editreview = async (req, res) => {
    const reviewId = req.params.id;
    const updated_data = req.body;
  
    try {
      const existingReview = await reviews.findById(reviewId);
      if (!existingReview) {
        return res.status(404).json({ msg: "Review not found." });
      }
  
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
  
      if (existingReview.userId.toString() !== userId) {
        return res.status(403).json({ msg: "You can only edit your own reviews." });
      }
  
      existingReview.rating = updated_data.rating || existingReview.rating;
      existingReview.review = updated_data.review || existingReview.review;
  
      if (updated_data.link && Array.isArray(updated_data.link)) {
        updated_data.link.forEach((newLinkObj) => {
          const index = existingReview.link.findIndex(
            (item) => item._id.toString() === newLinkObj._id
          );
          if (index !== -1) {
            existingReview.link[index].link = newLinkObj.link;
          }
        });
  
        existingReview.markModified("link");
      }
  
      await existingReview.save();
  
      return res.status(200).json({
        msg: "Review Updated Successfully.",
        existingReview,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong in the backend." });
    }
  };

  static deletereview = async (req, res) => {
    const reviewId = req.params.id;
    try {
      if (reviewId.length !== 24) {
        return res
          .status(400)
          .json({ msg: "Please enter a valid 24-character ID." });
      }
      const existingReview = await reviews.findById(reviewId);
      if (!existingReview) {
        return res.status(404).json({ msg: "Review Not Found" });
      }

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

      if (existingReview.userId.toString() !== userId) {
        return res
          .status(403)
          .json({ msg: "You can only delete your own reviews." });
      }

      await reviews.findByIdAndDelete(reviewId);

      return res
        .status(200)
        .json({ msg: "Review Deleted successfully Deleted Successfully." });
    } catch (err) {}
  };
}

module.exports = reviewController;
