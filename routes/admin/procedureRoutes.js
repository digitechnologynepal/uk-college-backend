const express = require("express");
const router = express.Router();
const procedureController = require("../../controllers/admin/procedureController");

router.post("/add", procedureController.addProcedure);
router.get("/get", procedureController.getProcedures);
router.put("/update/:id", procedureController.updateProcedure);
router.delete("/delete/:id", procedureController.deleteProcedure);

module.exports = router;
