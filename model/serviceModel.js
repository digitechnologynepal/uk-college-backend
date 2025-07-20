const mongoose = require("mongoose");
const slugify = require("slugify");

const serviceSectionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    quote: { type: String, required: false },
    description: { type: String, required: true },
    image: { type: String, required: true },
    descriptionImage: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

serviceSectionSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
    const existingService = await this.constructor.findOne({ slug: this.slug });
    if (existingService) {
      return next(new Error("Slug must be unique"));
    }
  }
  next();
});

const ServiceSection = mongoose.model("Service", serviceSectionSchema);

module.exports = ServiceSection;
