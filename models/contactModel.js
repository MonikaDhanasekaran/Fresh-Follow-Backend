const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    message: {
        type: String,
    }
});

//Model Creation

module.exports = mongoose.model("contact", contactSchema);