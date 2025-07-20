const mongoose = require("mongoose");
const courseApplySchema = mongoose.Schema(
    {
      fullName:String,
      email: String,
      phoneNumber: String,
      testPrep: String,
    },
    { timestamps: true }
  );
  const Consultation = mongoose.model("CourseApply", courseApplySchema);
    module.exports = Consultation;