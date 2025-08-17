const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
    }
});


const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = Testimonial;
