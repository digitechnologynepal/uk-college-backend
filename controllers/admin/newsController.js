const { responseHandler } = require("../../helper/responseHandler");
const News = require("../../model/newsModal");
const Category = require("../../model/categoryModel");
const fs = require("fs");
const path = require("path");

// Helper: Get final category title or fallback to "Others"
const getFinalCategoryTitle = async (categoryTitle) => {
  if (categoryTitle) return categoryTitle;

  const categoryDoc = await Category.findOne({ tab: "newsEvents" });
  if (!categoryDoc) throw new Error("News categories not found");

  const others = categoryDoc.categories.find(
    (c) => c.title?.toLowerCase() === "others"
  );
  return others?.title || "Others";
};

// Create News
const createNews = async (req, res) => {
  try {
    const { title, description, categoryTitle, tags } = req.body;
    if (!title || !description)
      return responseHandler(res, 400, false, "Title and description are required");

    // Ensure tags exist and is a non-empty array
    if (!tags || !Array.isArray(tags) || tags.length < 2)
      return responseHandler(res, 400, false, "At least two tags are required");

    const finalCategory = await getFinalCategoryTitle(categoryTitle);

    const newNews = new News({
      title,
      description,
      image: req.file ? req.file.filename : null,
      categoryTitle: finalCategory,
      tags,
    });

    await newNews.save();
    responseHandler(res, 201, true, "News created successfully", newNews);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};


const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    responseHandler(res, 200, true, "News fetched successfully", news);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};


const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const newsItem = await News.findByIdAndDelete(id);
    if (!newsItem) return responseHandler(res, 404, false, "News not found");

    // Delete image file if exists
    if (newsItem.image) {
      const oldImagePath = path.join(__dirname, "../../uploads", newsItem.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    responseHandler(res, 200, true, "News deleted successfully");
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryTitle, tags } = req.body;

    if (!title || !description)
      return responseHandler(res, 400, false, "Title and description are required");

    // Ensure tags exist and is a non-empty array
    if (!tags || !Array.isArray(tags) || tags.length < 2 )
      return responseHandler(res, 400, false, "At least two tags are required");

    const newsItem = await News.findById(id);
    if (!newsItem) return responseHandler(res, 404, false, "News not found");

    const finalCategory = await getFinalCategoryTitle(categoryTitle);

    const updateData = {
      title,
      description,
      categoryTitle: finalCategory,
      tags,
    };

    // Handle image replacement
    if (req.file) {
      if (newsItem.image) {
        const oldImagePath = path.join(__dirname, "../../uploads", newsItem.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      updateData.image = req.file.filename;
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true });
    responseHandler(res, 200, true, "News updated successfully", updatedNews);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

// Get single news with 3 latest others
const getSingleNews = async (req, res) => {
  try {
    const { id } = req.params;
    const foundNews = await News.findById(id);
    if (!foundNews) return responseHandler(res, 404, false, "News not found");

    const remainingNews = await News.find({ _id: { $ne: id } })
      .sort({ createdAt: -1 })
      .limit(3);

    responseHandler(res, 200, true, "News fetched successfully", {
      foundNews,
      remainingNews,
    });
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

module.exports = {
  createNews,
  getAllNews,
  deleteNews,
  updateNews,
  getSingleNews,
};
