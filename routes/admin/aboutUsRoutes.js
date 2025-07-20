const router = require("express").Router();
const aboutUsController = require("../../controllers/admin/aboutUsController");
const ensureAdmin = require("../../middleware/ensureAdmin");
const authGuard = require("../../middleware/authGuard");

const {upload} = require("../../middleware/upload");

// Add or update About Us content
router.post("/add", authGuard, ensureAdmin, upload.array("images", 3), aboutUsController.addAboutUsContent);

// Get About Us content
router.get("/get", aboutUsController.getAboutUsContent);

module.exports = router;