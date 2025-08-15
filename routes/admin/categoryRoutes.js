const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  updateCategory,
  softDeleteCategory
} = require("../../controllers/admin/categoryController");

router.get("/:tab/get", getCategories);
router.post("/:tab/add", addCategory);
router.put("/:tab/update", updateCategory);
router.delete("/:tab/soft-delete", softDeleteCategory);

module.exports = router;
