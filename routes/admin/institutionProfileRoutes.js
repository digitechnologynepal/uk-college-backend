const router = require("express").Router();
const institutionProfileController = require("../../controllers/admin/institutionProfileController");
const ensureAdmin = require("../../middleware/ensureAdmin");
const authGuard = require("../../middleware/authGuard");

router.post("/add", authGuard, ensureAdmin, institutionProfileController.updateInstitutionProfile);
router.get("/get", institutionProfileController.getInstitutionProfile);

module.exports = router