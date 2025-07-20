const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    mainTitle: { type: String, required: true },
    mainImage: { type: String, required: true },
    mainDescription: { type: String, required: true },

    items: [
        {
            name: { type: String, required: true },
            image: { type: String, required: true },
        },
    ],
});

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
