const mongoose = require("mongoose");

const mottoSchema = mongoose.Schema(
  {
    motoTitle: {
      type: String,
    },
    mission: {
      text: {
        type: String,
      },
      icon: {
        type: String, 
      },
    },
    vision: {
      text: {
        type: String,
      },
      icon: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Motto = mongoose.model("Motto", mottoSchema);
module.exports = Motto;
