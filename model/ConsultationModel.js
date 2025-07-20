const mongoose = require("mongoose");
const consultationSchema = mongoose.Schema(
    {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
      queries: String,
      destination: String,
      message: String,
    },
    { timestamps: true }
  );
  const Consultation = mongoose.model("Consultation", consultationSchema);
    module.exports = Consultation;