const mongoose = require("mongoose");

const bannerSchema = mongoose.Schema(
  {
    desktopImage: String, 
    mobileImage: String,  
    title: String,
    description: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
