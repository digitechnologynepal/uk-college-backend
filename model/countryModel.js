const mongoose = require("mongoose");

const countrySchema = mongoose.Schema(
  {
    name: String,
    // flag: String,
    country: String,
    countryImage: String,
    description: String,
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);
const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
// const mongoose = require("mongoose");

// const subPointSchema = new mongoose.Schema({
//   subHeading: { type: String },
//   description: { type: String },
// }, { _id: false });

// const questionSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   type: {
//     type: String,
//     enum: ["paragraph", "structured"],
//     required: true
//   },
//   answer: { type: String, default: "" },
//   subPoint: [subPointSchema],
// }, { _id: false })

// const countrySchema = mongoose.Schema(
//   {
//     name: String,
//     flag: String,
//     countryImage: String,
//     questions: [questionSchema],
//     isDeleted: { type: Boolean, default: false }
//   },
//   { timestamps: true }
// );
// const Country = mongoose.model("Country", countrySchema);

// module.exports = Country;