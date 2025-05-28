const express = require('express');
const Router = express.Router();

const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

// All cart routes require authentication
Router.use(authMiddleware.authMiddleware);

// Get user's cart
Router.get('/', cartController.getCart);

// Add item to cart
Router.post('/add', cartController.addToCart);

// Update cart item quantity
Router.put('/update', cartController.updateCartItem);

// Remove item from cart
Router.delete('/remove', cartController.removeFromCart);

module.exports = Router; 