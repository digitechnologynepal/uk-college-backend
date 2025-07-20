const express = require("express");
const router = express.Router();
const applicationController = require("../../controllers/admin/applicationController");

// Route for creating a new application
router.post("/", applicationController.createApplication);

// Route for fetching all applications
router.get("/", applicationController.getApplications);

module.exports = router;
