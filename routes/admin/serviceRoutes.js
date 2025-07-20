const express = require("express");
const router = express.Router();
const serviceSectionController = require("../../controllers/admin/serviceController");
const {upload} = require("../../middleware/upload");

router.post("/", upload.single("image"), serviceSectionController.createServiceSection);
router.get("/", serviceSectionController.getAllServiceSections);
router.put("/:id", upload.single("image"), serviceSectionController.updateServiceSection);
router.delete("/:id", serviceSectionController.softDeleteServiceSection);
router.get("/get/:slug", serviceSectionController.getServicebySlug);

module.exports = router;
