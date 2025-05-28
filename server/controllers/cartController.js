const Cart = require('../models/cart');
const Item = require('../models/item');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.item');
        
        if (!cart) {
            return res.status(200).json({
                items: [],
                total: 0
            });
        }

        return res.status(200).json(cart);
    } catch (err) {
        console.error('Get cart error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { itemId, quantity, color, size } = req.body;

        // Validate input
        if (!itemId || !quantity || !color || !size) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        // Check if item exists and has the selected variant
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        // Find the variant
        const variant = item.variants.find(v => v.color === color);
        if (!variant) {
            return res.status(400).json({
                message: "Selected color not available"
            });
        }

        // Check if size is available
        const sizeVariant = variant.sizes.find(s => s.size === size);
        if (!sizeVariant || sizeVariant.stock < quantity) {
            return res.status(400).json({
                message: "Selected size not available or insufficient stock"
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.item.toString() === itemId && 
                   item.selectedColor === color && 
                   item.selectedSize === size
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                item: itemId,
                quantity,
                selectedColor: color,
                selectedSize: size
            });
        }

        await cart.save();
        return res.status(200).json(cart);
    } catch (err) {
        console.error('Add to cart error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity, color, size } = req.body;

        if (!itemId || !quantity || !color || !size) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.item.toString() === itemId && 
                   item.selectedColor === color && 
                   item.selectedSize === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found in cart"
            });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        return res.status(200).json(cart);
    } catch (err) {
        console.error('Update cart error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId, color, size } = req.body;

        if (!itemId || !color || !size) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => !(item.item.toString() === itemId && 
                     item.selectedColor === color && 
                     item.selectedSize === size)
        );

        await cart.save();
        return res.status(200).json(cart);
    } catch (err) {
        console.error('Remove from cart error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}; 