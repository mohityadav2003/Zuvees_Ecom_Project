const express = require('express');
const Router = express.Router();

const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
Router.post('/create', authMiddleware.authMiddleware, orderController.createOrder);
Router.get('/my-orders', authMiddleware.authMiddleware, orderController.getUserOrders);

// Admin routes
Router.get('/all', authMiddleware.authMiddleware, authMiddleware.adminMiddleware, orderController.getAllOrders);
Router.put('/status', authMiddleware.authMiddleware, authMiddleware.adminMiddleware, orderController.updateOrderStatus);

// Rider routes
Router.get('/rider-orders', authMiddleware.authMiddleware, orderController.getRiderOrders);
Router.put('/delivery-status', authMiddleware.authMiddleware, orderController.updateDeliveryStatus);

module.exports = Router; 