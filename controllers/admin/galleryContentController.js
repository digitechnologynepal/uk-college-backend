const GalleryContent = require("../../model/galleryContentModel");
const Category = require("../../model/categoryModel");
const { responseHandler } = require("../../helper/responseHandler");
const fs = require("fs");
const path = require("path");

// Helper: Get final category title or fallback to "Others"
const getFinalCategoryTitle = async (categoryTitle) => {
    if (categoryTitle) return categoryTitle;

    const categoryDoc = await Category.findOne({ tab: "gallery" });
    if (!categoryDoc) throw new Error("Gallery categories not found");

    const others = categoryDoc.categories.find(
        (c) => c.title?.toLowerCase() === "others"
    );
    return others?.title || "Others";
};

// Create gallery content
const createGalleryContent = async (req, res) => {
    try {
        const { name, date, categoryTitle } = req.body;
        const file = req.file;

        if (!name || !file) {
            return responseHandler(res, 400, false, "Name and file are required.");
        }

        let fileType = null;
        if (file.mimetype.startsWith("image/")) {
            fileType = "image";
        } else if (file.mimetype.startsWith("video/")) {
            fileType = "video";
        } else {
            return responseHandler(res, 400, false, "Unsupported file type.");
        }

        const finalCategory = await getFinalCategoryTitle(categoryTitle);

        const doc = {
            name,
            file: file.filename,
            fileType,
            date: date ? new Date(date) : new Date(),
            categoryTitle: finalCategory,
        };

        const inserted = await GalleryContent.create(doc);
        return responseHandler(res, 200, true, "Gallery content added successfully.", inserted);
    } catch (error) {
        console.error("Error in createGalleryContent:", error);
        return responseHandler(res, 500, false, "Failed to add gallery content.");
    }
};

// Get all gallery contents
const getAllGalleryContents = async (req, res) => {
    try {
        const { type } = req.query; // type = 'image' or 'video'

        const filter = type ? { fileType: type } : {};
        const galleries = await GalleryContent.find(filter).sort({ createdAt: -1 });

        return responseHandler(res, 200, true, "Gallery media content fetched successfully.", galleries);
    } catch (error) {
        console.error("Error in getAllGalleryContents:", error);
        return responseHandler(res, 500, false, "Failed to fetch gallery content.");
    }
};

// Update gallery content
const updateGalleryContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, categoryTitle } = req.body;
        const file = req.file;

        const existing = await GalleryContent.findById(id);
        if (!existing) {
            return responseHandler(res, 404, false, "Content not found.");
        }

        // Delete old file if new one uploaded
        if (file && existing.file) {
            const oldPath = path.join(__dirname, "../../../uploads", existing.file);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        existing.name = name || existing.name;
        existing.date = date ? new Date(date) : existing.date;

        // Handle category update
        existing.categoryTitle = await getFinalCategoryTitle(categoryTitle);

        if (file) {
            existing.file = file.filename;
            if (file.mimetype.startsWith("image/")) {
                existing.fileType = "image";
            } else if (file.mimetype.startsWith("video/")) {
                existing.fileType = "video";
            } else {
                return responseHandler(res, 400, false, "Unsupported file type.");
            }
        }

        await existing.save();
        return responseHandler(res, 200, true, "Content updated successfully.", existing);
    } catch (error) {
        console.error("Error in updateGalleryContent:", error);
        return responseHandler(res, 500, false, "Failed to update content.");
    }
};

// Delete gallery content
const deleteGalleryContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await GalleryContent.findById(id);
        if (!content) {
            return responseHandler(res, 404, false, "Gallery content not found.");
        }

        // Delete file
        const filePath = path.join(__dirname, "../../uploads", content.file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await GalleryContent.findByIdAndDelete(id);
        return responseHandler(res, 200, true, "Content deleted successfully.");
    } catch (error) {
        console.error("Error in deleteGalleryContent:", error);
        return responseHandler(res, 500, false, "Failed to delete content.");
    }
};

// Get gallery with categories
const getGalleryWithCategories = async (req, res) => {
    try {
        const gallery = await GalleryContent.find().sort({ createdAt: -1 });
        const categoryDoc = await Category.findOne({ tab: "gallery" });
        const categories = categoryDoc?.categories.filter(c => !c.isDeleted) || [];

        res.status(200).json({
            success: true,
            message: "Gallery and categories fetched successfully",
            data: { categories, gallery },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createGalleryContent,
    getAllGalleryContents,
    updateGalleryContent,
    deleteGalleryContent,
    getGalleryWithCategories,
};
