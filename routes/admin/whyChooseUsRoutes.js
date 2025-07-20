const express = require("express");
const router = express.Router();
const { upload } = require("../../middleware/upload");
const whyChooseUsController = require("../../controllers/admin/whyChooseUsController");

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "imageUrl", maxCount: 10 },
  ]),
  whyChooseUsController.manageWhyChooseUs
);
router.put(
  "/items/:itemId",
  upload.fields([{ name: "imageUrl", maxCount: 1 }]),
  whyChooseUsController.updateItem
);

router.get("/", whyChooseUsController.getWhyChooseUs);
router.delete("/items/:itemId", whyChooseUsController.deleteItem);

module.exports = router;
