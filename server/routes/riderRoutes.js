const express = require('express');
const Router = express.Router();

const riderController = require('../controllers/riderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
Router.post('/login', riderController.login);

// Protected routes (require rider authentication)
Router.put('/status', authMiddleware.authMiddleware, riderController.updateStatus);
Router.put('/location', authMiddleware.authMiddleware, riderController.updateLocation);

// Admin routes
Router.post('/create', authMiddleware.authMiddleware, authMiddleware.adminMiddleware, riderController.createRider);
Router.get('/all', authMiddleware.authMiddleware, authMiddleware.adminMiddleware, riderController.getAllRiders);
Router.put('/:id', authMiddleware.authMiddleware, authMiddleware.adminMiddleware, riderController.updateRider);

module.exports = Router; 