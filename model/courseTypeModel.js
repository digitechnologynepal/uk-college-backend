const mongoose = require("mongoose");

const courseTypeSchema = new mongoose.Schema({
    main: {
        type: String,
        required: true,
    },
    sub: [
        {
            name: { type: String, required: true },
            description: { type: String },
        }
    ],

    description: {
        type: String,
    },
});

const CourseType = mongoose.model("CourseType", courseTypeSchema);
module.exports = CourseType;
