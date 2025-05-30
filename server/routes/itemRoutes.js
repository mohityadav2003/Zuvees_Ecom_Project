const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getById);

// Create item route (admin only)
router.post('/create', authenticateToken.authenticate, itemController.createItem);
router.put('/:id', authenticateToken.authenticate, authenticateToken.adminMiddleware, itemController.updateItem);

module.exports = router;