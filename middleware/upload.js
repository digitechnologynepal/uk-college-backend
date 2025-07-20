const multer = require("multer");

// Acceptable mime types for image and video
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "_");
    cb(null, Date.now() + "_" + fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

const uploadAll = multer({ storage }); // no fileFilter

const upload = multer({
  storage,
  fileFilter,
});

module.exports = {
  upload,
  uploadAll,
};
