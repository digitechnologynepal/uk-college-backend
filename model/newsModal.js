const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
    {
        title: {
            type: String,

        },
        description: {
            type: String,
        },
        image: [
            {
                type: String,
            }
        ]
    },
    { timestamps: true }
)

const News = mongoose.model("News", newsSchema);
module.exports = News