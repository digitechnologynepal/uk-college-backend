const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
    },
    { timestamps: true }
)

const News = mongoose.model("News", newsSchema);
module.exports = News