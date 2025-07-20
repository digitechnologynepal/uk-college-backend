const mongoose = require("mongoose");

const curriculumItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
});

const curriculumSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    curriculumTitle: {
        type: String,
    },
    curriculum: [curriculumItemSchema],
});

module.exports = mongoose.model("Curriculum", curriculumSchema);
