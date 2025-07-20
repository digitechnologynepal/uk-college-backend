const router = require("express").Router();
const mottoController = require("../../controllers/admin/mottoController");
const ensureAdmin = require("../../middleware/ensureAdmin");
const authGuard = require("../../middleware/authGuard");
const {upload} = require("../../middleware/upload"); 

router.post("/add", upload.fields([
  { name: 'missionIcon', maxCount: 1 },
  { name: 'visionIcon', maxCount: 1 }
]), mottoController.addOrUpdateMottoContent);

router.get("/", mottoController.getMottoContent);

module.exports = router;
