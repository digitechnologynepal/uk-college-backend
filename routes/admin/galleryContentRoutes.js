const express = require("express");
const router = express.Router();
const { upload } = require("../../middleware/upload");

const galleryContentController = require("../../controllers/admin/galleryContentController");

// Create: single or multiple files
router.post("/add", upload.array("files"), galleryContentController.createGalleryContent);

router.get("/get", galleryContentController.getAllGalleryContents);

router.put("/update/:id", upload.array("files"), galleryContentController.updateGalleryContent);

router.delete("/delete/:id", galleryContentController.deleteGalleryContent);

router.delete("/album/:albumTitle", galleryContentController.deleteAlbum);

router.put("/album/update/:albumTitle", upload.array("files"), galleryContentController.updateAlbum);

module.exports = router;
