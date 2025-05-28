const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    selectedColor: {
        type: String,
        required: true
    },
    selectedSize: {
        type: String,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Update total before saving
cartSchema.pre('save', async function(next) {
    let total = 0;
    for (const item of this.items) {
        const product = await mongoose.model('Item').findById(item.item);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    this.total = total;
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("Cart", cartSchema); 