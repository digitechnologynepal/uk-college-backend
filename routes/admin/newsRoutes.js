const router = require("express").Router();

const {upload} = require("../../middleware/upload");
const newsController = require("../../controllers/admin/newsController");

// Add
router.post("/add", upload.single("newsImage"), newsController.createNews);

// Get
router.get("/all", newsController.getAllNews)

// Delete
router.delete("/delete/:id", newsController.deleteNews);

// Update
router.put("/update/:id", upload.single("newsImage"), newsController.updateNews)

// Get Single News
router.get("/get/:id", newsController.getSingleNews)

module.exports = router;
