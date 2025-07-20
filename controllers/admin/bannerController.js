const Banner = require("../../model/bannerModel");
const { responseHandler } = require("../../helper/responseHandler");
const path = require("path");
const fs = require("fs");

// Create a new banner with both desktop and mobile images
const createBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    const desktopImage = req.files?.desktopImage ? req.files.desktopImage[0].filename : null;
    const mobileImage = req.files?.mobileImage ? req.files.mobileImage[0].filename : null;

    if (!title || !description || !desktopImage || !mobileImage) {
      return responseHandler(res, 400, false, "All fields (desktop and mobile images) are required", null);
    }

    const newBanner = new Banner({
      desktopImage,
      mobileImage,
      title,
      description,
    });

    await newBanner.save();
    responseHandler(res, 201, true, "Banner created successfully", newBanner);
  } catch (error) {
    console.log("Error in createBanner:", error);
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

// Get all active banners (where isDeleted is false)
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isDeleted: false });
    responseHandler(res, 200, true, "Banners fetched successfully", banners);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

// Update a banner by ID with desktop and mobile images
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Find the existing banner
    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return responseHandler(res, 404, false, "Banner not found", null);
    }

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    // Handle image replacement
    if (req.files) {
      if (req.files.desktopImage) {
        const newDesktopImage = req.files.desktopImage[0].filename;
        updateData.desktopImage = newDesktopImage;

        // Delete the old desktop image file from the server
        if (existingBanner.desktopImage) {
          const oldDesktopImagePath = path.join(__dirname, "../../uploads", existingBanner.desktopImage);
          if (fs.existsSync(oldDesktopImagePath)) {
            fs.unlinkSync(oldDesktopImagePath); // Delete the old image
          }
        }
      }

      if (req.files.mobileImage) {
        const newMobileImage = req.files.mobileImage[0].filename;
        updateData.mobileImage = newMobileImage;

        // Delete the old mobile image file from the server
        if (existingBanner.mobileImage) {
          const oldMobileImagePath = path.join(__dirname, "../../uploads", existingBanner.mobileImage);
          if (fs.existsSync(oldMobileImagePath)) {
            fs.unlinkSync(oldMobileImagePath); // Delete the old image
          }
        }
      }
    }

    // Update the banner in the database
    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });

    responseHandler(res, 200, true, "Banner updated successfully", updatedBanner);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

// Soft delete a banner (set isDeleted to true)
const softDeleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!banner) {
      return responseHandler(res, 404, false, "Banner not found", null);
    }

    responseHandler(res, 200, true, "Banner deleted successfully", null);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  updateBanner,
  softDeleteBanner,
};
