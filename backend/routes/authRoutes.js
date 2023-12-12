const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateUser = require('../middleware/authMiddleware'); // Import the authentication middleware

// User registration
router.post('/register', authController.registerUser);

// User login
router.post('/login', authController.loginUser);

// Get all user details (Admin only)
router.get('/users', authenticateUser, authController.getAllUsers);

// Get user details by ID (including password for logged-in user or Admin)
router.get('/users/:id', authenticateUser, authController.getUserDetailsByID);

// Update user details by ID (Admin only)
// router.put('/users/:id', authenticateUser, authController.updateUserDetailsByID);
// router.put('/users/:id', authenticateUser, authController.updateUserDetails);
router.post('/users/:id', authenticateUser, authController.updateUserDetails);


// Delete user by ID (Admin only)
router.delete('/users/:id', authenticateUser, authController.deleteUser);



module.exports = router;
