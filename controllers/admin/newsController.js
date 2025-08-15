const { responseHandler } = require("../../helper/responseHandler");
const News = require("../../model/newsModal");
const Category = require("../../model/categoryModel");
const fs = require("fs");
const path = require("path");

const createNews = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return responseHandler(res, 400, false, "Required fields are required", null);
    }

    const categoryDoc = await Category.findOne({ tab: "newsEvents" });
    if (!categoryDoc) return responseHandler(res, 500, false, "Category document missing", null);

    // Determine final category
    let finalCategory = category;
    if (!finalCategory) {
      const others = categoryDoc.categories.find(c => c.title === "Others");
      if (!others) return responseHandler(res, 500, false, '"Others" category missing', null);
      finalCategory = others._id;
    } else {
      const exists = categoryDoc.categories.id(finalCategory);
      if (!exists) return responseHandler(res, 400, false, "Invalid category selected", null);
    }

    const newNews = new News({
      title,
      description,
      image: req.file ? req.file.filename : null,
      category: finalCategory,
    });

    await newNews.save();

    // Populate category for response
    const populatedNews = await News.findById(newNews._id).populate('category', 'title');

    responseHandler(res, 201, true, "News created successfully", populatedNews);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};


const getAllNews = async (req, res) => {
  try {
    const news = await News.find().populate('category', 'title').sort({ createdAt: -1 });
    responseHandler(res, 200, true, "News fetched successfully", news);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const foundNews = await News.findByIdAndDelete(id);
    if (!foundNews) {
      return responseHandler(res, 404, false, "News not found", null);
    }

    // Delete the image file if it exists
    if (foundNews.image) {
      const oldImagePath = path.join(__dirname, "../../uploads", foundNews.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    responseHandler(res, 200, true, "News deleted successfully", null);
  } catch (error) {
    console.log("Error", error);
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    if (!title || !description) {
      return responseHandler(res, 400, false, "Title and description are required", null);
    }

    const newsItem = await News.findById(id);
    if (!newsItem) return responseHandler(res, 404, false, "News not found", null);

    const categoryDoc = await Category.findOne({ tab: "newsEvents" });
    if (!categoryDoc) return responseHandler(res, 500, false, "Category document missing", null);

    let finalCategory = category;
    if (!finalCategory) {
      const others = categoryDoc.categories.find(c => c.title === "Others");
      if (!others) return responseHandler(res, 500, false, '"Others" category missing', null);
      finalCategory = others._id;
    } else {
      const exists = categoryDoc.categories.id(finalCategory);
      if (!exists) return responseHandler(res, 400, false, "Invalid category selected", null);
    }

    const updateData = { title, description, category: finalCategory };

    // Delete old image if new image uploaded
    if (req.file && newsItem.image) {
      const oldImagePath = path.join(__dirname, "../../uploads", newsItem.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      updateData.image = req.file.filename;
    } else if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true }).populate('category', 'title');

    responseHandler(res, 200, true, "News updated successfully", updatedNews);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const getSingleNews = async (req, res) => {
  try {
    const { id } = req.params;
    const foundNews = await News.findById(id).populate('category', 'title');
    if (!foundNews) {
      return responseHandler(res, 404, false, "News not found", null);
    }
    // send 3 more news except this found news
    const remainingNews = await News.find({ _id: { $ne: id } }).populate('category', 'title').sort({ createdAt: -1 }).limit(3);
    responseHandler(res, 200, true, "News fetched successfully", {
      foundNews,
      remainingNews,
    });
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const getNewsWithCategories = async (req, res) => {
  try {
    const news = await News.find().populate('category', 'title');

    // Fetch the newsEvents category document
    const categoryDoc = await Category.findOne({ tab: "newsEvents" });
    const categories = categoryDoc ? categoryDoc.categories.filter(c => !c.isDeleted) : [];

    res.status(200).json({
      success: true,
      message: "News and events with categories fetched successfully",
      data: {
        categories, // newsEvents
        news
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createNews,
  getAllNews,
  deleteNews,
  updateNews,
  getSingleNews,
  getNewsWithCategories
};
