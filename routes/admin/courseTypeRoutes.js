const router = require("express").Router();
const {
    createCourseType,
    getAllCourseTypes,
    getSingleCourseType,
    updateCourseType,
    deleteCourseType,
} = require("../../controllers/admin/courseTypeController");

// Create Course Type
router.post("/add", createCourseType);

// Get all Course Types
router.get("/all", getAllCourseTypes);

// Get single Course Type by ID
router.get("/get/:id", getSingleCourseType);

// Update Course Type by ID
router.put("/update/:id", updateCourseType);

// Delete Course Type by ID
router.delete("/delete/:id", deleteCourseType);

module.exports = router;
