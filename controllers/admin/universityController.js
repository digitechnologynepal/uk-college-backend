const University = require("../../model/universityModel");
const { responseHandler } = require("../../helper/responseHandler");
const path = require("path");
const fs = require("fs");

const createUniversity = async (req, res) => {
  try {
    const { uniName, country, city, website } = req.body;
    const uniImg = req.file ? req.file.filename : null;

    if (!uniName || !country || !city || !website || !uniImg) {
      return responseHandler(res, 400, false, "All fields are required", null);
    }

    const newUniversity = new University({
      uniName,
      country,
      city,
      website,
      uniImg,
    });

    await newUniversity.save();
    responseHandler(res, 201, true, "University created successfully", newUniversity);
  } catch (error) {
    console.log("Error in createUniversity:", error);
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find().select("-appliedStudents");
    responseHandler(res, 200, true, "Universities fetched successfully", universities);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};


const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;
    const university = await University.findById(id).populate("appliedStudents");

    if (!university) {
      return responseHandler(res, 404, false, "University not found", null);
    }

    responseHandler(res, 200, true, "University fetched successfully", university);
  } catch (error) {
    console.log("Error in getUniversityById:", error);
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const updateUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const { uniName, country, city, website } = req.body;

    const existingUniversity = await University.findById(id);
    if (!existingUniversity) {
      return responseHandler(res, 404, false, "University not found", null);
    }

    const updateData = {};
    if (uniName) updateData.uniName = uniName;
    if (country) updateData.country = country;
    if (city) updateData.city = city;
    if (website) updateData.website = website;

    if (req.file) {
      const newImage = req.file.filename;
      updateData.uniImg = newImage;

      if (existingUniversity.uniImg) {
        const oldImagePath = path.join(__dirname, "../../uploads", existingUniversity.uniImg);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedUniversity = await University.findByIdAndUpdate(id, updateData, { new: true });

    responseHandler(res, 200, true, "University updated successfully", updatedUniversity);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};


const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    const university = await University.findByIdAndDelete(id);

    if (!university) {
      return responseHandler(res, 404, false, "University not found", null);
    }

    if (university.uniImg) {
      const imagePath = path.join(__dirname, "../../uploads", university.uniImg);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); 
      }
    }

    responseHandler(res, 200, true, "University deleted successfully", null);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

module.exports = {
  createUniversity,
  getAllUniversities,
  getUniversityById,
  updateUniversity,
  deleteUniversity,
};
