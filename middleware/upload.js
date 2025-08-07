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

const pdfMimeTypes = ["application/pdf"];   // PDF only

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s/g, "_");
    cb(null, fileName);
  },
});

// file filter
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// PDF filter
const pdfFileFilter = (req, file, cb) => {
  if (pdfMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const uploadAll = multer({ storage }); // no fileFilter

const upload = multer({
  storage,
  fileFilter,
});

const uploadPDF = multer({
  storage,
  fileFilter: pdfFileFilter,
});

module.exports = {
  upload,
  uploadAll,
  uploadPDF
};
