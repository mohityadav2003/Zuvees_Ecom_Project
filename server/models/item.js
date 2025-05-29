const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
    color: { type: String },
    size: { type: String }
}, { _id: false }); // Don't create _id for subdocuments unless needed

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    variations: [variationSchema], // Array of variations
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add a pre-save middleware to update the overall stock based on variations
itemSchema.pre('save', function(next) {
    if (this.variations && this.variations.length > 0) {
        this.stock = this.variations.reduce((total, variation) => total + variation.stock, 0);
    }
    next();
});

module.exports = mongoose.model('Item', itemSchema);