const { responseHandler } = require("../../helper/responseHandler");
const News = require("../../model/newsModal");

const createNews = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!title || !description) {
      return responseHandler(res, 400, false, "All fields are required", null);
    }
    if (!req.file) {
      return responseHandler(res, 400, false, "Please upload an image", null);
    }

    const newNews = new News({
      title,
      description,
      image,
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
    const foundNews = await News.findByIdAndDelete(id);
    if (!foundNews) {
      return responseHandler(res, 404, false, "News not found", null);
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
    const { title, description } = req.body;
    if (req.file) {
      const newImage = req.file.filename;
      const updatedNews = await News.findByIdAndUpdate(
        id,
        { title, description, image: newImage },
        { new: true }
      );
      if (!updatedNews) {
        return responseHandler(res, 404, false, "News not found", null);
      }
      return responseHandler(
        res,
        200,
        true,
        "News updated successfully",
        updatedNews
      );
    } else {
      const updatedNews = await News.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
      if (!updatedNews) {
        return responseHandler(res, 404, false, "News not found", null);
      }
      return responseHandler(
        res,
        200,
        true,
        "News updated successfully",
        updatedNews
      );
    }
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const getSingleNews = async (req, res) => {
  try {
    const { id } = req.params;
    const foundNews = await News.findById(id);
    if (!foundNews) {
      return responseHandler(res, 404, false, "News not found", null);
    }
    // send 3 more news except this found news
    const remainingNews = await News.find({ _id: { $ne: id } }).sort({ createdAt: -1 }).limit(3);
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
