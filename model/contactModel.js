const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
    {
        firstName: { type: String, },
        lastName: {type: String},
        email: { type: String },
        mobileNumber: { type: String },
        query: { type: String },
        preferredDestination: { type: String },
        message: { type: String },
    },
    { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
