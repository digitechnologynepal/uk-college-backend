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
        categoryTitle: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],  
            required: true, 
        },

    },
    { timestamps: true }
)

const News = mongoose.model("News", newsSchema);
module.exports = News