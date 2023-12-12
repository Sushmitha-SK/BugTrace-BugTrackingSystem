const Project = require('../models/Project'); // Import the Project model
const User = require('../models/User'); // Import the User model


// Create a new project
const createProject = async (req, res) => {
    const { name, description, projectManager } = req.body;

    try {
        // Create a new project document
        const newProject = new Project({
            name,
            description,
            projectManager,
            // Add any other fields as needed
        });

        // Save the new project to the database
        await newProject.save();

        return res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ message: 'Error creating project' });
    }
};

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        // Retrieve all projects from the database
        // const projects = await Project.find();
        const projects = await Project.find().populate('projectManager', 'username');

        return res.status(200).json({ projects });
    } catch (error) {
        console.error('Error getting projects:', error);
        return res.status(500).json({ message: 'Error getting projects' });
    }
};

// Get all projects
// const getAllProjects = async (req, res) => {
//     try {
//         const projects = await Project.find().populate('projectManager', 'username email'); // Change the fields as needed

//         return res.status(200).json({ projects });
//     } catch (error) {
//         console.error('Error getting projects:', error);
//         return res.status(500).json({ message: 'Error getting projects' });
//     }
// };



// Get users under a specific project manager

const getUsersUnderProjectManager = async (req, res) => {
    const { projectManagerId } = req.params; // Assuming you pass the project manager's ID as a URL parameter

    try {
        const projects = await Project.find({ projectManager: projectManagerId });

        const userIds = projects.reduce((userIds, project) => {
            return userIds.concat(project.assignedUsers);
        }, []);

        // Populate the 'projects' field for each user
        const users = await User.find({ _id: { $in: userIds } }).populate('projects');

        return res.status(200).json({ users });
    } catch (error) {
        console.error('Error getting users under project manager:', error);
        return res.status(500).json({ message: 'Error getting users under project manager', error: error.message });
    }
};

// Assign a project to a user
const assignProjectToUser = async (req, res) => {
    const { projectId, userId } = req.params;

    try {
        // Find the project by ID
        const project = await Project.findById(projectId);

        // Find the user by ID
        const user = await User.findById(userId);

        if (!project || !user) {
            return res.status(404).json({ message: 'Project or user not found' });
        }

        // Assign the user to the project
        project.assignedUsers.push(userId);
        await project.save();

        // Update the user's projects field
        user.projects.push(projectId);
        await user.save();

        return res.status(200).json({ message: 'Project assigned to user successfully' });
    } catch (error) {
        console.error('Error assigning project to user:', error);
        return res.status(500).json({ message: 'Error assigning project to user', error: error.message });
    }
};

// Get IDs and usernames of assignedUsers for a specific project
const getUsersAssignedToProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        // Find the project by ID
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Find the users with the assignedUser IDs
        const users = await User.find({ _id: { $in: project.assignedUsers } });

        // Extract and return _id, username, and role from the users
        const userIdsAndUsernamesAndRoles = users.map(user => ({
            _id: user._id,
            username: user.username,
            role: user.role // Assuming 'role' is a field in the User model
        }));

        return res.status(200).json({ users: userIdsAndUsernamesAndRoles });
    } catch (error) {
        console.error('Error getting data for assignedUsers for project:', error);
        return res.status(500).json({ message: 'Error getting data for assignedUsers for project', error: error.message });
    }
};

// Update a project
// const updateProject = async (req, res) => {
//     const { projectId } = req.params;
//     const updateFields = req.body;

//     try {
//         // Find the project by ID
//         const project = await Project.findById(projectId);

//         if (!project) {
//             return res.status(404).json({ message: 'Project not found' });
//         }

//         // Update project fields
//         Object.assign(project, updateFields);

//         // Save the updated project to the database
//         await project.save();

//         return res.status(200).json({ message: 'Project updated successfully', project });
//     } catch (error) {
//         console.error('Error updating project:', error);
//         return res.status(500).json({ message: 'Error updating project', error: error.message });
//     }
// };
// const updateProject = async (req, res) => {
//     const { projectId } = req.params;
//     const updateFields = req.body;

//     try {
//         // Find the project by ID
//         const project = await Project.findById(projectId);

//         if (!project) {
//             return res.status(404).json({ message: 'Project not found' });
//         }

//         if (updateFields.name) {
//             // If the name is being updated, set the 'name' field of the project
//             project.name = updateFields.name;
//         }
//         if (updateFields.description) {
//             // If the description is being updated, set the 'description' field of the project
//             project.description = updateFields.description;
//         }


//         // Check if the 'projectManager' field exists in the request body
//         if (updateFields.projectManager) {
//             // If the project manager is being updated, set the 'projectManager' field of the project
//             project.projectManager = updateFields.projectManager;
//         }


//         // Update other project fields if needed
//         // ...

//         // Save the updated project to the database
//         await project.save();

//         return res.status(200).json({ message: 'Project updated successfully', project });
//     } catch (error) {
//         console.error('Error updating project:', error);
//         return res.status(500).json({ message: 'Error updating project', error: error.message });
//     }
// };


const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const updateFields = req.body;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update project fields
        Object.assign(project, updateFields);

        if (updateFields.name) {
            // If the name is being updated, set the 'name' field of the project
            project.name = updateFields.name;
        }

        if (updateFields.description) {
            // If the description is being updated, set the 'description' field of the project
            project.description = updateFields.description;
        }

        // If the project manager ID is being updated
        if (updateFields.projectManager) {
            project.projectManager = updateFields.projectManager;

            // Include the project manager ID in assignedUsers
            if (!project.assignedUsers.includes(updateFields.projectManager)) {
                project.assignedUsers.push(updateFields.projectManager);
            }
        }



        await project.save();

        return res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};



module.exports = {
    createProject,
    getAllProjects,
    getUsersUnderProjectManager,
    assignProjectToUser,
    getUsersAssignedToProject,
    updateProject
};

