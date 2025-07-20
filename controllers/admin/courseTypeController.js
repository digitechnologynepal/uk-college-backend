const CourseType = require("../../model/courseTypeModel");
const { responseHandler } = require("../../helper/responseHandler");

// CREATE
const createCourseType = async (req, res) => {
    try {
        const { main, sub = [], description } = req.body;

        if (!main) {
            return responseHandler(res, 400, false, "Main course type is required", null);
        }

        if (!Array.isArray(sub)) {
            return responseHandler(res, 400, false, "Sub must be an array", null);
        }

        for (const item of sub) {
            if (!item.name || typeof item.name !== "string") {
                return responseHandler(res, 400, false, "Each sub type must have a valid name", null);
            }
        }

        const newCourseType = new CourseType({ main, sub, description });
        await newCourseType.save();

        responseHandler(res, 201, true, "Course type created successfully", newCourseType);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// GET ALL
const getAllCourseTypes = async (req, res) => {
    try {
        const courseTypes = await CourseType.find().sort({ createdAt: -1 });
        responseHandler(res, 200, true, "Course types fetched successfully", courseTypes);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// GET SINGLE
const getSingleCourseType = async (req, res) => {
    try {
        const { id } = req.params;
        const courseType = await CourseType.findById(id);
        if (!courseType) {
            return responseHandler(res, 404, false, "Course type not found", null);
        }
        responseHandler(res, 200, true, "Course type fetched successfully", courseType);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// UPDATE
const updateCourseType = async (req, res) => {
    try {
        const { id } = req.params;
        const { main, sub, description } = req.body;

        const courseType = await CourseType.findById(id);
        if (!courseType) {
            return responseHandler(res, 404, false, "Course type not found", null);
        }

        if (main) courseType.main = main;

        if (sub !== undefined) {
            if (!Array.isArray(sub)) {
                return responseHandler(res, 400, false, "Sub must be an array", null);
            }

            for (const item of sub) {
                if (!item.name || typeof item.name !== "string") {
                    return responseHandler(res, 400, false, "Each sub type must have a valid name", null);
                }
            }

            courseType.sub = sub;
        }

        if (description !== undefined) courseType.description = description;

        await courseType.save();
        responseHandler(res, 200, true, "Course type updated successfully", courseType);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

// DELETE
const deleteCourseType = async (req, res) => {
    try {
        const { id } = req.params;
        const courseType = await CourseType.findByIdAndDelete(id);
        if (!courseType) {
            return responseHandler(res, 404, false, "Course type not found", null);
        }

        responseHandler(res, 200, true, "Course type deleted successfully", null);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

module.exports = {
    createCourseType,
    getAllCourseTypes,
    getSingleCourseType,
    updateCourseType,
    deleteCourseType,
};
