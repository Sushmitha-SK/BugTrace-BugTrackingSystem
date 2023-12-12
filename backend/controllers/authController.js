const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Developer = require('../models/Developer');
const Project = require('../models/Project'); // Add this line to import the Project model

const JWT_SECRET = process.env.JWT_SECRET || 'ABCDE123';

//Helper function to generate JWT token
// const generateToken = (userId) => {
//     return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
// };
const generateToken = (userId) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set');
    }
    // return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
};



//Route 1: User registration
const registerUser = async (req, res) => {
    const { fullname, username, email, password, role, projectId } = req.body;

    try {
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            fullname,
            username,
            email,
            password: hashedPassword,
            role,
            projects: [projectId], // Assign the provided project ID to the user's projects field
        });

        if (role === 'Developer') {
            const newDeveloper = await Developer.create({
                user: user._id,
                skills: ['JavaScript', 'React', 'Node.js'],
            })
        }

        // Add the user to the assignedUsers field in the Project model
        await Project.findByIdAndUpdate(
            projectId,
            { $addToSet: { assignedUsers: user._id } }, // Use $addToSet to avoid duplicate entries
            { new: true }
        );

        const token = generateToken(user._id);
        return res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Error registering user' });
    }
};


//Route 2: User Login
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username or email
        const user = await User.findOne({ $or: [{ username }, { email: username }] });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the provided password matches the hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate a JWT token for the user
        const token = generateToken(user._id);
        return res.status(200).json({ message: 'Login successful', role: user.role, id: user._id, token });


    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Error logging in user' });

    }
}

//Route 3: Get all users

/************************************** */
// const getAllUsers = async (req, res) => {
//     try {
//         if (req.user.role !== 'Admin') {
//             return res.status(403).json({ message: 'Access denied. Only Admins can access this data.' });
//         }

//         let users;
//         if (req.user.role === 'Admin') {
//             users = await User.find({}, 'username email role password');
//         } else {
//             users = await User.find({}, 'username email role');
//         }

//         return res.status(200).json({ users });
//     } catch (error) {
//         console.error('Error getting user details:', error);
//         return res.status(500).json({ message: 'Error getting user details' });
//     }
// };
/************************************************************ */

//Route 3: Get all users

// const getAllUsers = async (req, res) => {
//     try {
//         if (req.user.role !== 'Admin') {
//             return res.status(403).json({ message: 'Access denied. Only Admins can access this data.' });
//         }

//         let users;
//         if (req.user.role === 'Admin') {
//             users = await User.find({}, 'fullname username email role password');
//         } else {
//             users = await User.find({}, 'fullname username email role');
//         }

//         return res.status(200).json({ users });
//     } catch (error) {
//         console.error('Error getting user details:', error);
//         return res.status(500).json({ message: 'Error getting user details' });
//     }
// };

const getAllUsers = async (req, res) => {
    try {
        let users = await User.find({}, 'fullname username email role');
        return res.status(200).json({ users });
    } catch (error) {
        console.error('Error getting user details:', error);
        return res.status(500).json({ message: 'Error getting user details' });
    }
};


/*********************************************************** */

//Route 4: Get user details by ID
const getUserDetailsByID = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Include password if the user is the logged-in user or if the role is Admin
        if (req.user.role === 'Admin' || req.user.id === id) {
            return res.status(200).json({ user });
        } else {
            // Omit password for other users
            return res.status(200).json({ user: { _id: user._id, username: user.username, email: user.email, role: user.role, fullname: user.fullname } });
        }
    } catch (error) {
        console.error('Error getting user details:', error);
        return res.status(500).json({ message: 'Error getting user details' });
    }
};

// const updateUserDetails = async (req, res) => {
//     const { id } = req.params;
//     const { fullname, email, password } = req.body;
//     console.log('User Details Backend', id, fullname, email, password)

//     try {
//         // Check if the user exists
//         const user = await User.findById(id);
//         console.log('User', user)
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Ensure that only the authenticated user or an admin can update the details
//         if (req.user.role !== 'Admin' && req.user.id !== id) {
//             return res.status(403).json({ message: 'Access denied. You are not authorized to update this user.' });
//         }

//         // Update user details
//         if (fullname) {
//             user.fullname = fullname;
//         }
//         if (email) {
//             user.email = email;
//         }
//         if (password) {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             user.password = hashedPassword;
//         }

//         await user.save();

//         return res.status(200).json({ message: 'User details updated successfully' });
//     } catch (error) {
//         console.error('Error updating user details:', error);
//         return res.status(500).json({ message: 'Error updating user details' });
//     }
// }




const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { fullname, email, password } = req.body;
    console.log('User Details Backend', id, fullname, email, password)

    try {
        // Check if the user exists
        const user = await User.findById(id);
        console.log('User', user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure that only the authenticated user or an admin can update the details
        if (!(req.user.role === 'Admin' || req.user.id === id)) {
            return res.status(403).json({ message: 'Access denied. You are not authorized to update this user.' });
        }

        // Update user details
        if (fullname) {
            user.fullname = fullname;
        }
        if (email) {
            user.email = email;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error('Error updating user details:', error);
        return res.status(500).json({ message: 'Error updating user details' });
    }
}


// Route 6: Delete a user by ID
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Allow Admin and the user to delete their account
        if (req.user.role !== 'Admin' && req.user.id !== id) {
            return res.status(403).json({ message: 'Access denied. You are not authorized to delete this user.' });
        }

        // Delete the user
        await User.findByIdAndDelete(id);

        // Remove the user from assignedUsers in all projects they were assigned to
        await Project.updateMany({}, { $pull: { assignedUsers: id } });

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Error deleting user' });
    }
};



module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserDetailsByID,
    updateUserDetails,
    deleteUser
};

