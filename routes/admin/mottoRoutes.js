const router = require("express").Router();
const mottoController = require("../../controllers/admin/mottoController");
const ensureAdmin = require("../../middleware/ensureAdmin");
const authGuard = require("../../middleware/authGuard");

// No file uploads required anymore
router.post("/add", mottoController.addOrUpdateMottoContent);
router.get("/", mottoController.getMottoContent);

module.exports = router;
