const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'offline'],
        default: 'available'
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    activeOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Index for geospatial queries
riderSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model("Rider", riderSchema); 