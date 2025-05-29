const User = require('../models/user');
const Item = require('../models/item');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.item');

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // The user's cart is directly on the user object now
        const cartItems = user.cart || [];

        // Calculate total
        let total = 0;
        for (const cartItem of cartItems) {
            // Ensure item details are populated and stock exists for the selected variant
            if (cartItem.item && cartItem.item.variations) {
                const selectedVariant = cartItem.item.variations.find(v => 
                    v.color === cartItem.color && v.size === cartItem.size
                );
                if (selectedVariant) {
                     total += cartItem.item.price * cartItem.quantity;
                }
            }
        }

        return res.status(200).json({
            items: cartItems,
            total: total
        });
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
        const userId = req.user._id;

        // Validate input
        if (!itemId || !quantity || !color || !size) {
            return res.status(400).json({
                message: "Please provide all required fields: itemId, quantity, color, size"
            });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        // Find the selected variant in the item's variations
        const selectedVariant = item.variations.find(v => v.color === color && v.size === size);
        if (!selectedVariant) {
             return res.status(400).json({
                 message: "Selected variation (color/size) not available for this item"
             });
        }

        // Check stock for the selected variant
        if (selectedVariant.stock < quantity) {
            return res.status(400).json({
                message: `Insufficient stock for selected variation. Available: ${selectedVariant.stock}`
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if item with same variation already exists in cart
        const existingItemIndex = user.cart.findIndex(
            cartItem => cartItem.item.toString() === itemId && 
                        cartItem.color === color && 
                        cartItem.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            user.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item with variation to cart
            user.cart.push({
                item: itemId,
                quantity: quantity,
                color: color,
                size: size
            });
        }

        await user.save();
        // Populate the cart items before sending the response
        await user.populate('cart.item');
        return res.status(200).json({ items: user.cart });
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
        const userId = req.user._id;

        if (!itemId || !quantity || !color || !size) {
            return res.status(400).json({
                message: "Please provide all required fields: itemId, quantity, color, size"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const itemIndex = user.cart.findIndex(
             cartItem => cartItem.item.toString() === itemId && 
                         cartItem.color === color && 
                         cartItem.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item with this variation not found in cart"
            });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            user.cart.splice(itemIndex, 1);
        } else {
            // Update quantity
            // Optional: Check stock here against the item model if needed
            user.cart[itemIndex].quantity = quantity;
        }

        await user.save();
        // Populate the cart items before calculating total
        await user.populate('cart.item');

        // Recalculate total after updating quantity
        let total = 0;
        for (const cartItem of user.cart) {
            if (cartItem.item && cartItem.item.variations) {
                const selectedVariant = cartItem.item.variations.find(v => 
                    v.color === cartItem.color && v.size === cartItem.size
                );
                if (selectedVariant) {
                     total += cartItem.item.price * cartItem.quantity;
                }
            }
        }

        return res.status(200).json({ items: user.cart, total: total });
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
        const { itemId, color, size } = req.params; // Get from URL parameters
        const userId = req.user._id;

        if (!itemId || !color || !size) {
            return res.status(400).json({
                message: "Please provide all required fields in URL parameters: itemId, color, size"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Filter out the item with the matching variation
        const initialCartLength = user.cart.length;
        user.cart = user.cart.filter(
             cartItem => !(cartItem.item.toString() === itemId && 
                           cartItem.color === color && 
                           cartItem.size === size)
        );

        if (user.cart.length === initialCartLength) {
             // If length didn't change, item was not found
             return res.status(404).json({ message: "Item with this variation not found in cart" });
        }

        await user.save();
        // Populate the cart items before sending the response
        await user.populate('cart.item');
        return res.status(200).json({ items: user.cart });
    } catch (err) {
        console.error('Remove from cart error:', err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}; 