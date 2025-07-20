const mongoose = require("mongoose");
const enrollSchema = mongoose.Schema(
    {
      name: String,
      email: String,
      mobileNumber: String,
      testPrepCourse: String,
    },
    { timestamps: true }
  );
  const Enroll = mongoose.model("Enroll", enrollSchema);
    module.exports = Enroll;