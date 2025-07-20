const router = require("express").Router();
const clientController = require("../../controllers/admin/clientController");
const { upload } = require("../../middleware/upload");

// Create a new client (with image upload)
router.post("/", upload.single("image"), clientController.createClient);
router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getClientById);
router.put("/:id", upload.single("image"), clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

module.exports = router;
