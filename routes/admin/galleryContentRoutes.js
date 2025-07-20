const express = require("express");
const router = express.Router();
const { upload } = require("../../middleware/upload"); // should support mixed files (images/videos)

const galleryContentController = require("../../controllers/admin/galleryContentController");

router.post(
    "/add",
    upload.single("file"),
    galleryContentController.createGalleryContent
);

router.get("/get", galleryContentController.getAllGalleryContents);

router.put(
    "/update/:id",
    upload.single("file"),
    galleryContentController.updateGalleryContent
);

// Delete a single media entry
router.delete("/delete/:id", galleryContentController.deleteGalleryContent);

module.exports = router;
