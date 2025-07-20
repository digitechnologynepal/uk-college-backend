const router = require("express").Router();
const  universityController = require("../../controllers/admin/universityController");
const {upload} = require("../../middleware/upload"); 

router.post("/", upload.single('uniImg'), universityController.createUniversity);  
router.get("/", universityController.getAllUniversities);
router.get("/:id", universityController.getUniversityById);
router.put("/:id", upload.single('uniImg'), universityController.updateUniversity); 
router.delete("/:id", universityController.deleteUniversity);

module.exports = router;
