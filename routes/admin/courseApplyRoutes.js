const express = require("express");
const router = express.Router();
const { createApplyCourse, getApplications } = require("../../controllers/admin/courseApplyController");

// Route to submit a course application
router.post("/apply", createApplyCourse);

// Route to fetch all course applications
router.get("/applications", getApplications);

module.exports = router;
