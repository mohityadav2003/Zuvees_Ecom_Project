const Order = require('../models/order');
const Cart = require('../models/cart');
const Rider = require('../models/rider');

// Create order from cart
exports.createOrder = async (req, res) => {
    try {
        const { customerInfo } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.item');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        // Create order items from cart items
        const orderItems = cart.items.map(item => ({
            item: item.item._id,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
            price: item.item.price
        }));

        // Create new order
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            total: cart.total,
            customerInfo
        });

        await order.save();

        // Clear the cart
        cart.items = [];
        cart.total = 0;
        await cart.save();

        return res.status(201).json(order);
    } catch (err) {
        console.error('Create order error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.item')
            .populate('rider', 'name phone')
            .sort({ created_at: -1 });

        return res.status(200).json(orders);
    } catch (err) {
        console.error('Get user orders error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.item')
            .populate('rider', 'name phone')
            .populate('user', 'email')
            .sort({ created_at: -1 });

        return res.status(200).json(orders);
    } catch (err) {
        console.error('Get all orders error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status, riderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // If status is being changed to shipped, assign a rider
        if (status === 'shipped' && riderId) {
            const rider = await Rider.findById(riderId);
            if (!rider) {
                return res.status(404).json({
                    message: "Rider not found"
                });
            }

            order.rider = riderId;
            rider.activeOrders.push(orderId);
            await rider.save();
        }

        order.status = status;
        await order.save();

        return res.status(200).json(order);
    } catch (err) {
        console.error('Update order status error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get rider's assigned orders
exports.getRiderOrders = async (req, res) => {
    try {
        const orders = await Order.find({ rider: req.user._id })
            .populate('items.item')
            .sort({ created_at: -1 });

        return res.status(200).json(orders);
    } catch (err) {
        console.error('Get rider orders error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Update order delivery status (rider only)
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.rider.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized to update this order"
            });
        }

        if (!['delivered', 'undelivered'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        order.status = status;
        await order.save();

        // Update rider's active orders
        const rider = await Rider.findById(req.user._id);
        rider.activeOrders = rider.activeOrders.filter(
            order => order.toString() !== orderId
        );
        await rider.save();

        return res.status(200).json(order);
    } catch (err) {
        console.error('Update delivery status error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}; 