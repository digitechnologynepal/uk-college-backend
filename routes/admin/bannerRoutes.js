const router = require("express").Router();
const bannerController = require("../../controllers/admin/bannerController");
const { upload } = require("../../middleware/upload"); 

router.post('/upload-banner', upload.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), bannerController.createBanner);

router.get("/", bannerController.getAllBanners);

router.put("/:id", upload.single("image"), bannerController.updateBanner);

router.delete("/:id", bannerController.softDeleteBanner);

module.exports = router;