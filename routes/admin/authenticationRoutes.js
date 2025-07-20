const router = require("express").Router();
const authenticationController = require("../../controllers/admin/authenticationController");

router.post("/login", authenticationController.loginUser);

router.get("/getAdmin/:id", authenticationController.getAdminById)

module.exports = router