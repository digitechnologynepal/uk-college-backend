const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Module 1", "Module 2"],
    required: true,
  },
  durationWeeks: {
    type: Number,
    required: true,
  },
  durationHours: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: {
    type: [String],
    enum: ["Class 11", "Class 12"],
    required: true,
  },
  modules: {
    type: [moduleSchema],
    required: true,
  },
  image: { type: String, required: true },
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
