const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(/[ \.]+/).slice(0, -1).join("_");
    const extension = MIME_TYPES[file.mimetype];
    const whenUploaded = new Date(Date.now() + 7200000).toISOString().split(":").join("-")
    callback(null, whenUploaded + name + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");