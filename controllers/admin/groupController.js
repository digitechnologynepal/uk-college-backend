const Group = require("../../model/groupModel");
const { responseHandler } = require("../../helper/responseHandler");
const fs = require("fs");
const path = require("path");

// Create or update Group main info + optionally add one item
const manageGroup = async (req, res) => {
  try {
    const { mainTitle, mainDescription } = req.body;
    const newMainImage = req.files?.mainImage?.[0];
    const mainImagePath = newMainImage ? `/uploads/${newMainImage.filename}` : null;

    // Try to find existing group
    let group = await Group.findOne();

    if (group) {
      group.mainTitle = mainTitle || group.mainTitle;
      group.mainDescription = mainDescription || group.mainDescription;

      // Replace image file if new image uploaded
      if (mainImagePath) {
        if (group.mainImage) {
          const oldPath = path.join(__dirname, "../", group.mainImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        group.mainImage = mainImagePath;
      }

      await group.save();
      return responseHandler(res, 200, true, "Group updated successfully", group);
    } else {
      const newGroup = new Group({
        mainTitle,
        mainDescription,
        mainImage: mainImagePath,
        items: [],
      });

      await newGroup.save();
      return responseHandler(res, 201, true, "Group created successfully", newGroup);
    }
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

const createGroupItem = async (req, res) => {
  try {
    const { name } = req.body;
    const imageFile = req.files?.image?.[0];
    if (!name || !imageFile) {
      return responseHandler(res, 400, false, "Name and image are required");
    }

    const image = `/uploads/${imageFile.filename}`;
    const group = await Group.findById(req.params.groupId);
    if (!group) return responseHandler(res, 404, false, "Group not found");

    group.items.push({ name, image });
    await group.save();
    return responseHandler(res, 200, true, "Item added", group);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

const updateGroupItem = async (req, res) => {
  try {
    const { name } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) return responseHandler(res, 404, false, "Group not found");

    const item = group.items.id(req.params.itemId);
    if (!item) return responseHandler(res, 404, false, "Item not found");

    if (name) item.name = name;

    const imageFile = req.files?.image?.[0];
    if (imageFile) {
      // delete old file
      const oldImagePath = path.join(__dirname, "../", item.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      item.image = `/uploads/${imageFile.filename}`;
    }

    await group.save();
    return responseHandler(res, 200, true, "Item updated", group);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Get all groups (unchanged)
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, result: groups });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// Delete group and all associated images (unchanged)
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return responseHandler(res, 404, false, "Group not found.");
    }

    // Delete main image
    const mainImagePath = path.join(__dirname, "../../../uploads", group.mainImage.replace("/uploads/", ""));
    if (fs.existsSync(mainImagePath)) {
      fs.unlinkSync(mainImagePath);
    }

    // Delete all item images
    group.items.forEach((item) => {
      const itemImagePath = path.join(__dirname, "../../../uploads", item.image.replace("/uploads/", ""));
      if (fs.existsSync(itemImagePath)) {
        fs.unlinkSync(itemImagePath);
      }
    });

    await Group.findByIdAndDelete(id);
    return responseHandler(res, 200, true, "Group deleted successfully.");
  } catch (error) {
    console.error("Error in deleteGroup:", error);
    return responseHandler(res, 500, false, "Failed to delete group.");
  }
};

// Delete single item by item ID inside the group
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let group = await Group.findOne();
    if (!group) {
      return responseHandler(res, 404, false, "Group not found", null);
    }
    group.items = group.items.filter((item) => item._id.toString() !== itemId);
    await group.save();
    return responseHandler(res, 200, true, "Item deleted successfully", group);
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

module.exports = {
  manageGroup,
  getAllGroups,
  deleteGroup,
  deleteItem,
  createGroupItem,
  updateGroupItem
};
