const jwt = require('jsonwebtoken');
const User = require('../models/User');

// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'ABCDE123';

// Middleware to authenticate user requests using JWT tokens
const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token and decode the user ID
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user by the decoded user ID
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach the user object to the request for later use
        req.user = user;

        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateUser;
