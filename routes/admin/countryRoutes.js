const express = require("express");
const router = express.Router();
const countryController = require("../../controllers/admin/countryController");
const { upload } = require("../../middleware/upload");

// router.post("/", upload.fields([{ name: 'flag', maxCount: 1 }, { name: 'countryImage', maxCount: 1 }]), countryController.createCountry);
router.post("/", upload.fields([{ name: 'countryImage', maxCount: 1 }]), countryController.createCountry);
router.get("/", countryController.getAllCountries);
router.get("/:id", countryController.getCountryByID);
// router.put("/:id", upload.fields([{ name: 'flag', maxCount: 1 }, { name: 'countryImage', maxCount: 1 }]), countryController.updateCountry);
router.put("/:id", upload.fields([{ name: 'countryImage', maxCount: 1 }]), countryController.updateCountry);
router.delete("/:id", countryController.deleteCountryByID);
router.delete("/:id", countryController.softDeleteCountry);

module.exports = router;
