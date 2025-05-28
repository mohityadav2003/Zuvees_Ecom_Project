const Rider = require('../models/rider');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create new rider (admin only)
exports.createRider = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if rider already exists
        const existingRider = await Rider.findOne({ email });
        if (existingRider) {
            return res.status(400).json({
                message: "Rider with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new rider
        const rider = new Rider({
            name,
            email,
            phone,
            password: hashedPassword
        });

        await rider.save();

        return res.status(201).json({
            message: "Rider created successfully",
            rider: {
                id: rider._id,
                name: rider.name,
                email: rider.email,
                phone: rider.phone
            }
        });
    } catch (err) {
        console.error('Create rider error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Rider login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find rider
        const rider = await Rider.findOne({ email });
        if (!rider) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Check password
        const match = await bcrypt.compare(password, rider.password);
        if (!match) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                riderId: rider._id,
                email: rider.email,
                role: 'rider'
            },
            process.env.JWTSECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            rider: {
                id: rider._id,
                name: rider.name,
                email: rider.email,
                phone: rider.phone
            }
        });
    } catch (err) {
        console.error('Rider login error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get all riders (admin only)
exports.getAllRiders = async (req, res) => {
    try {
        const riders = await Rider.find()
            .select('-password')
            .populate('activeOrders');

        return res.status(200).json(riders);
    } catch (err) {
        console.error('Get all riders error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Update rider status
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['available', 'busy', 'offline'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const rider = await Rider.findById(req.user._id);
        if (!rider) {
            return res.status(404).json({
                message: "Rider not found"
            });
        }

        rider.status = status;
        await rider.save();

        return res.status(200).json(rider);
    } catch (err) {
        console.error('Update rider status error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Update rider location
exports.updateLocation = async (req, res) => {
    try {
        const { coordinates } = req.body;

        if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({
                message: "Invalid coordinates"
            });
        }

        const rider = await Rider.findById(req.user._id);
        if (!rider) {
            return res.status(404).json({
                message: "Rider not found"
            });
        }

        rider.currentLocation.coordinates = coordinates;
        await rider.save();

        return res.status(200).json(rider);
    } catch (err) {
        console.error('Update rider location error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}; 