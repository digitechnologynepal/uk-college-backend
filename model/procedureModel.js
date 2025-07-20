const mongoose = require("mongoose");

const procedureSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    }
})

const Procedure = mongoose.model("Procedure", procedureSchema);
module.exports = Procedure;