const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Rider = require('../models/rider');

exports.authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized: No token provided' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user/rider from database based on role
        let user;
        if (decoded.role === 'rider') {
            user = await Rider.findById(decoded.id).select('-password');
        } else {
            user = await User.findById(decoded.id).select('-password');
        }

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(401).json({ 
            success: false,
            message: 'Invalid or expired token' 
        });
    }
};

// Admin middleware to check if user is admin
exports.adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Admin privileges required'
            });
        }
        next();
    } catch (err) {
        console.error('Admin middleware error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
  }
};

exports.authenticate  = async(req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}