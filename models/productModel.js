const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    title: {
        type: String,
    },
    price: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    image: {
        type: String,
    },
    rating: {
        type: Number,
    },
    count: {
        type: Number,
    }
});

//Model Creation

module.exports = mongoose.model("product",productSchema);