const mongoose = require("mongoose");
const Application = require("./applicationModel");

const universitySchema = mongoose.Schema(
  {
    uniName: { type: String },
    country: { type: String },
    city: { type: String },
    website: { type: String },
    uniImg: { type: String },
    appliedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  },
  { timestamps: true }
);

const University = mongoose.model("University", universitySchema);
module.exports = University;
