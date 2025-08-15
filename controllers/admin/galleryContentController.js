const GalleryContent = require("../../model/galleryContentModel");
const Category = require("../../model/categoryModel");
const { responseHandler } = require("../../helper/responseHandler");
const fs = require("fs");
const path = require("path");

const createGalleryContent = async (req, res) => {
    try {
        const { name, date } = req.body;
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

        const doc = {
            name,
            file: file.filename,
            fileType,
            date: date ? new Date(date) : new Date(),
        };

        const inserted = await GalleryContent.create(doc);
        return responseHandler(res, 200, true, "Gallery content added successfully.", inserted);
    } catch (error) {
        console.error("Error in createGalleryContent:", error);
        return responseHandler(res, 500, false, "Failed to add gallery content.");
    }
};

const getAllGalleryContents = async (req, res) => {
    try {
        const { type } = req.query; // type can be 'image' or 'video'

        const filter = type ? { fileType: type } : {};

        const galleries = await GalleryContent.find(filter).sort({ createdAt: -1 });
        return responseHandler(res, 200, true, "Gallery media content fetched successfully.", galleries);
    } catch (error) {
        console.error("Error in getAllGalleryContents:", error);
        return responseHandler(res, 500, false, "Failed to fetch gallery content.");
    }
};


const updateGalleryContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date } = req.body;
        const file = req.file;

        const existing = await GalleryContent.findById(id);
        if (!existing) {
            return responseHandler(res, 404, false, "Content not found.");
        }

        // Delete old file if a new one is uploaded
        if (file && existing.file) {
            const oldPath = path.join(__dirname, "../../../uploads", existing.file);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        existing.name = name || existing.name;
        existing.date = date ? new Date(date) : existing.date;

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


const deleteGalleryContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await GalleryContent.findById(id);
        if (!content) {
            return responseHandler(res, 404, false, "Gallery content not found.");
        }

        // Delete image file
        const filePath = path.join(__dirname, "../../../uploads", content.file);
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

module.exports = {
    createGalleryContent,
    getAllGalleryContents,
    updateGalleryContent,
    deleteGalleryContent,
};
