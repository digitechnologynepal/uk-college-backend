const express = require("express")
const router = express.Router();
const curriculumController = require("../../controllers/admin/curriculumController");

router.post("/create", curriculumController.createCurriculum);
router.get("/get", curriculumController.getAllCurriculums);
router.get("/get/:id", curriculumController.getCurriculumByID);
router.put("/update/:id", curriculumController.updateCurriculum);
router.delete("/delete/:id", curriculumController.deleteCurriculumByID);
router.get("/get/:id", curriculumController.getCurriculumByID);
router.get("/getByCourse/:courseId", curriculumController.getCurriculumsByCourseID);

module.exports = router;