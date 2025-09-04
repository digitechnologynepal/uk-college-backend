const mongoose = require("mongoose");

const WhyChooseUsSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  mainImage: { type: String, required: true },

  items: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      imageUrl: { type: String, required: true },
    },
  ],
});

const WhyChooseUs = mongoose.model("WhyChooseUs", WhyChooseUsSchema);
module.exports = WhyChooseUs;