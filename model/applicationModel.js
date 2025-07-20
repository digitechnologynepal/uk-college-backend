const mongoose = require("mongoose");
const applicationSchema = mongoose.Schema(
    {
      name: String,
      email: String,
      mobileNumber: String,
      queries: String,
      country: String,
      university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
      message: String,
    },
    { timestamps: true }
  );
  const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
