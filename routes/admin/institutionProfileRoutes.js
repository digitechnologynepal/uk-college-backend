const router = require("express").Router();
const institutionProfileController = require("../../controllers/admin/institutionProfileController");
const ensureAdmin = require("../../middleware/ensureAdmin");
const authGuard = require("../../middleware/authGuard");
const {uploadPDF} = require("../../middleware/upload");

router.post(
    "/add",
    authGuard,
    ensureAdmin,
    uploadPDF.single("brochure"),
    institutionProfileController.updateInstitutionProfile);
router.get("/get", institutionProfileController.getInstitutionProfile);

module.exports = router