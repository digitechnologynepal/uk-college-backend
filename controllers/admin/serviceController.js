const fs = require("fs");
const path = require("path");
const ServiceSection = require("../../model/serviceModel");
const { responseHandler } = require("../../helper/responseHandler");
const slugify = require("slugify");

const createServiceSection = async (req, res) => {
    try {
      const { title, description, descriptionImage, quote } = req.body;
      const image = req.file ? req.file.filename : null; 
      console.log(descriptionImage);
  
      if (!title || !description || !image || !descriptionImage) {
        return responseHandler(res, 400, false, "All fields are required", null);
      }
  
      const newServiceSection = new ServiceSection({
        title,
        slug: slugify(title, { lower: true }),
        quote,
        description,
        image,
        descriptionImage
      });
  
      await newServiceSection.save();
      responseHandler(res, 201, true, "Service section created successfully", newServiceSection);
    } catch (error) {
      console.log(error);
      responseHandler(res, 500, false, "Server error", error.message);
    }
  };
  

const getAllServiceSections = async (req, res) => {
  try {
    const serviceSections = await ServiceSection.find({ isDeleted: false });
    responseHandler(res, 200, true, "Service sections fetched successfully", serviceSections);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const getServicebySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const service = await ServiceSection.findOne({ slug: slug });
    console.log(service)
    if (!service) {
      return responseHandler(res, 404, false, "Service section not found");
    }
    responseHandler(res, 200, true, "Service section fetched successfully", service);
  } catch (error) {
    console.log(error);
    responseHandler(res, 500, false, "Server error", error.message);
  }
}

const updateServiceSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, descriptionImage, quote } = req.body;

    const existingServiceSection = await ServiceSection.findById(id);
    if (!existingServiceSection) {
      return responseHandler(res, 404, false, "Service section not found", null);
    }
    // if there is no slug in existing data then create slug

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (descriptionImage) updateData.descriptionImage = descriptionImage;
    if (quote) updateData.quote = quote;
    if (!existingServiceSection.slug) {
      updateData.slug = slugify(title, { lower: true, strict: true });
    }

    if (req.file) {
      const newImage = req.file.filename;
      updateData.image = newImage;

      const oldImagePath = path.join(__dirname, "../uploads", existingServiceSection.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedServiceSection = await ServiceSection.findByIdAndUpdate(id, updateData, { new: true });

    responseHandler(res, 200, true, "Service section updated successfully", updatedServiceSection);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const softDeleteServiceSection = async (req, res) => {
  try {
    const { id } = req.params;

    const serviceSection = await ServiceSection.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!serviceSection) {
      return responseHandler(res, 404, false, "Service section not found", null);
    }

    responseHandler(res, 200, true, "Service section deleted successfully", null);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

module.exports = {
  createServiceSection,
  getAllServiceSections,
  updateServiceSection,
  softDeleteServiceSection,
  getServicebySlug
};
