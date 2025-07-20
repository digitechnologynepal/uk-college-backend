const WhyChooseUs = require("../../model/whyChooseUsModal");
const { responseHandler } = require("../../helper/responseHandler");
const path = require("path");
const fs = require("fs");

const manageWhyChooseUs = async (req, res) => {
  try {
    const { mainTitle } = req.body;
    const mainImage = req.files?.mainImage ? `/uploads/${req.files.mainImage[0].filename}` : null;

    let section = await WhyChooseUs.findOne();
    if (section) {
      section.mainTitle = mainTitle || section.mainTitle;
      section.mainImage = mainImage || section.mainImage;

      if (req.files?.imageUrl) {
        const imageUrl = `/uploads/${req.files.imageUrl[0].filename}`;
        section.items.push({
          title: req.body.title,
          description: req.body.description,
          imageUrl,
        });
      }

      await section.save();
      return responseHandler(res, 200, true, "Section updated successfully", section);
    } else {
      const newSection = new WhyChooseUs({ mainTitle, mainImage, items: [] });

      if (req.files?.imageUrl) {
        const imageUrl = `/uploads/${req.files.imageUrl[0].filename}`;
        newSection.items.push({
          title: req.body.title,
          description: req.body.description,
          imageUrl,
        });
      }

      await newSection.save();
      return responseHandler(res, 201, true, "Section created successfully", newSection);
    }
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Update a specific item
const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, description } = req.body;

    const section = await WhyChooseUs.findOne();
    if (!section) {
      return responseHandler(res, 404, false, "Main section not found", null);
    }

    const itemIndex = section.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return responseHandler(res, 404, false, "Item not found", null);
    }

    const item = section.items[itemIndex];
    const uploadedImage = req.files?.imageUrl?.[0];

    if (uploadedImage) {
      // Delete old image
      if (item.imageUrl) {
        const oldImagePath = path.join(__dirname, "../../", item.imageUrl.replace(/^\/+/, ""));
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err.message);
        });
      }

      item.imageUrl = `/uploads/${uploadedImage.filename}`;
    }


    item.title = title || item.title;
    item.description = description || item.description;

    await section.save();
    return responseHandler(res, 200, true, "Item updated successfully", section);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

const getWhyChooseUs = async (req, res) => {
  try {
    const section = await WhyChooseUs.findOne();
    if (!section) {
      return responseHandler(res, 404, false, "No data found", null);
    }
    return responseHandler(res, 200, true, "Section retrieved successfully", section);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let section = await WhyChooseUs.findOne();
    if (!section) {
      return responseHandler(res, 404, false, "Main section not found", null);
    }
    section.items = section.items.filter((item) => item._id.toString() !== itemId);
    await section.save();
    return responseHandler(res, 200, true, "Item deleted successfully", section);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

module.exports = {
  manageWhyChooseUs,
  getWhyChooseUs,
  deleteItem,
  updateItem,
};