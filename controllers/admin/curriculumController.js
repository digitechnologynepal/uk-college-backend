const Curriculum = require("../../model/curriculumModel")
const Course = require("../../model/courseModel")
const { responseHandler } = require("../../helper/responseHandler");

const createCurriculum = async (req, res) => {
    console.log("Received body:", req.body);
    try {
        const { course, curriculumTitle, curriculum } = req.body;

        // Validate course
        if (!course) {
            return res.status(400).json({ error: "Course ID is required." });
        }

        // Validate curriculum items
        if (!Array.isArray(curriculum) || curriculum.length === 0) {
            return res.status(400).json({ error: "At least one curriculum item is required." });
        }

        for (const item of curriculum) {
            if (!item.name || item.name.trim() === "") {
                return res.status(400).json({ error: "Each curriculum item must have a name." });
            }
        }

        const newCurriculum = new Curriculum({
            course,
            curriculumTitle,
            curriculum,
        });

        await newCurriculum.save();
        res.status(201).json({
            success: true,
            message: "Curriculum created successfully",
            data: newCurriculum,
        });

    } catch (error) {
        console.error("Error adding curriculum:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllCurriculums = async (req, res) => {
    try {
        const curriculums = await Curriculum.find()
            .populate("course", "title");

        res.status(200).json({
            success: true,
            result: curriculums,
        });
    } catch (error) {
        console.error("Error fetching curriculums:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getCurriculumByID = async (req, res) => {
    try {
        const { id } = req.params;
        const curriculum = await Curriculum.findById(id);
        if (!curriculum) return responseHandler(res, 404, false, "Curriculum not found", null);
        responseHandler(res, 200, true, "Curriculum fetched successfully", curriculum);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
}

const getCurriculumsByCourseID = async (req, res) => {
    const courseId = req.params.courseId;

    try {
        // Fetch curriculum with courseID
        const curriculum = await Curriculum.find({ course: courseId });

        if (!curriculum.length) {
            return res.json({
                success: false,
                message: "No curriculum found for this course",
            });
        }

        res.json({
            success: true,
            message: "Curriculum fetched successfully",
            curriculum: curriculum,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const updateCurriculum = async (req, res) => {
    try {
        const { id } = req.params;
        const { curriculumTitle, curriculum } = req.body;

        if (!Array.isArray(curriculum) || curriculum.length === 0) {
            return res.status(400).json({ success: false, message: "Curriculum must contain at least one item." });
        }

        for (const item of curriculum) {
            if (!item.name || item.name.trim() === "") {
                return res.status(400).json({ success: false, message: "Each curriculum item must have a name." });
            }
        }

        const updatedCurriculum = await Curriculum.findByIdAndUpdate(
            id,
            {
                curriculumTitle,
                curriculum, 
            },
            { new: true, runValidators: true }
        );

        if (!updatedCurriculum) {
            return res.status(404).json({ success: false, message: "Curriculum not found." });
        }

        res.status(200).json({
            success: true,
            message: "Curriculum updated successfully",
            data: updatedCurriculum,
        });
    } catch (error) {
        console.error("Error updating curriculum:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


//Delete curriculum BY ID
const deleteCurriculumByID = async (req, res) => {
    try {
        const { id } = req.params;

        const curriculum = await Curriculum.findByIdAndDelete(id);
        if (!curriculum) {
            return responseHandler(res, 404, false, "Curriculum not found", null);
        }
        responseHandler(res, 200, true, "Curriculum deleted successfully", null);
    } catch (error) {
        responseHandler(res, 500, false, "Server error", error.message);
    }
};

module.exports = {
    createCurriculum,
    getAllCurriculums,
    getCurriculumByID,
    updateCurriculum,
    deleteCurriculumByID,
    getCurriculumsByCourseID
}
