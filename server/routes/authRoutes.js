const express = require('express');
const router = express.Router();

const authmiddleware = require('../middlewares/authMiddleware');

const authController = require('../controllers/authController');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);
router.post('/rider/login', authController.riderLogin);

// Admin registration route (protected by secret key)
router.post('/admin/register', authController.registerAdmin);

// Router.post('/adminlogin', authmiddleware.authMiddleware, authController.adminlogin);

module.exports = router;