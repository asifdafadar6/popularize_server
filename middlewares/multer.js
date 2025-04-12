
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    let fileName = file.originalname.toLowerCase().split(" ").join("_");
    cb(null, Date.now() + "_" + fileName);
  },
});

const upload = multer({
  storage: storage,
  // limits: { fileSize: 10 * 1024 * 1024 }, // Max 2MB per file
  fileFilter: (req, file, cb) => {

    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only jpg,jpeg,png is accepted"));
    }
  }

})

module.exports = upload;
