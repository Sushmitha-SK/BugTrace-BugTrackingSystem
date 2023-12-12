const BugTicket = require('../models/BugTicket');
const User = require('../models/User');
const Developer = require('../models/Developer');
const Project = require('../models/Project'); // Add this line to import the Project model
const Comment = require('../models/Comment'); // Import your Comment model
const { default: mongoose } = require('mongoose');

const createBugTicket = async (req, res) => {
    const { title, description, projectId, priority, status, assignedTo } = req.body;

    try {
        const userId = req.user.id;
        const createdByUser = await User.findById(userId);

        if (!createdByUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const newBugTicket = new BugTicket({
            title,
            description,
            projectId,
            priority,
            status,
            assignedTo,
            createdBy: createdByUser._id,
            project: project._id,
            lastUpdatedBy: { id: createdByUser._id, username: createdByUser.username },
            lastUpdatedAt: new Date(),
        });

        await newBugTicket.save();

        // Update the project's bugTickets array with the new bug ticket's ID
        project.bugTickets.push(newBugTicket._id);

        // Save the updated project with the new bug ticket reference
        await project.save();

        return res.status(201).json({ message: 'Bug ticket created successfully', bugTicket: newBugTicket });
    } catch (error) {
        console.error('Error creating bug ticket:', error);
        return res.status(500).json({ message: 'Error creating bug ticket' });
    }
};


/**************************IORIGINAL************************************* */
// const getAllBugTickets = async (req, res) => {
//     try {
//         // Retrieve all bug tickets from the database
//         const bugTickets = await BugTicket.find()
//             .populate('createdBy', 'username')
//             .populate('project', '_id name')
//             .populate({
//                 path: 'comments',
//                 populate: { path: 'createdBy', select: 'username' },
//             });


//         return res.status(200).json({ bugTickets });
//     } catch (error) {
//         console.error('Error getting bug tickets:', error);
//         return res.status(500).json({ message: 'Error getting bug tickets' });
//     }
// };

/************************************ORIGINAL END*********************************************** */
const getAllBugTickets = async (req, res) => {
    try {
        // Retrieve all bug tickets from the database
        const bugTickets = await BugTicket.find()
            .populate('createdBy', 'username')
            .populate({
                path: 'project',
                select: '_id name projectManager', // Include the projectManager field
            })
            .populate({
                path: 'comments',
                populate: { path: 'createdBy', select: 'username' },
            });

        return res.status(200).json({ bugTickets });
    } catch (error) {
        console.error('Error getting bug tickets:', error);
        return res.status(500).json({ message: 'Error getting bug tickets' });
    }
};


// Get a single bug ticket by ID along with its comments
const getBugTicketById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the bug ticket by ID and populate the createdBy field with only the username field
        const bugTicket = await BugTicket.findById(id)
            .populate('createdBy', 'username')
            .populate({
                path: 'comments',
                populate: { path: 'createdBy', select: 'username' },
            });

        if (!bugTicket) {
            return res.status(404).json({ message: 'Bug ticket not found' });
        }

        return res.status(200).json({ bugTicket });
    } catch (error) {
        console.error('Error getting bug ticket:', error);
        return res.status(500).json({ message: 'Error getting bug ticket' });
    }
};

// Update a BugTicket (excluding summary and description)
const updateBugTicket = async (req, res) => {
    // Check if req.user is defined
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status, priority, assignedTo } = req.body;

    try {
        // Find the bug ticket by ID
        const bugTicket = await BugTicket.findById(id);

        if (!bugTicket) {
            return res.status(404).json({ message: 'Bug ticket not found' });
        }

        console.log('DETAILS', id, status, priority, assignedTo)
        console.log('Logged-in User:', req.user);

        // Ensure that only the allowed fields are updated
        bugTicket.status = status || bugTicket.status;
        bugTicket.priority = priority || bugTicket.priority;
        bugTicket.assignedTo = assignedTo || bugTicket.assignedTo;

        // Update the lastUpdatedBy and lastUpdatedAt fields
        bugTicket.lastUpdatedBy = {
            id: req.user.id,
            username: req.user.username,
        };
        bugTicket.lastUpdatedAt = new Date();

        // Save the updated bug ticket
        await bugTicket.save();

        return res.status(200).json({ message: 'Bug ticket updated successfully', bugTicket });
    } catch (error) {
        console.error('Error updating bug ticket:', error);
        return res.status(500).json({ message: 'Error updating bug ticket' });
    }
};

//Get All Bugs Logged By Tester 
const getAllBugsLoggedByTester = async (req, res) => {
    const { testerId } = req.params;

    try {
        // Find the user by testerId to make sure the tester exists
        const tester = await User.findById(testerId);

        if (!tester) {
            return res.status(404).json({ message: 'Tester not found' });
        }

        // Query the BugTicket model to find bug tickets created by the tester
        const bugTickets = await BugTicket.find({ createdBy: testerId });

        return res.status(200).json({ bugTickets });
    } catch (error) {
        console.error('Error getting bug tickets by tester:', error);
        return res.status(500).json({ message: 'Error getting bug tickets by tester' });
    }
};

const getAllBugsAssignedToDeveloper = async (req, res) => {
    const { developerId } = req.params;

    try {
        // Find the user by developerID to make sure the developer exists
        const developer = await User.findById(developerId);

        if (!developer) {
            return res.status(404).json({ message: 'Developer not found' });
        }

        // Query the BugTicket model to find bug tickets assigned to the developer and populate the 'comments' field
        const bugTickets = await BugTicket.find({ assignedTo: developerId })
            .populate({
                path: 'createdBy',
                select: 'id username',
            })
            .populate({
                path: 'project',
                select: 'id name',
            })
            .populate({
                path: 'comments', // Populate the comments field to retrieve the whole comment data
                populate: {
                    path: 'createdBy',
                    select: 'id username',
                },
            });

        return res.status(200).json({ bugTickets });
    } catch (error) {
        console.error('Error getting bug tickets by developer:', error);
        return res.status(500).json({ message: 'Error getting bug tickets of developer' });
    }
};


const getBugsByProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        // Find all bug tickets that belong to the specified project
        const bugTickets = await BugTicket.find({ project: projectId })
            .populate('createdBy', 'username')
            .populate({
                path: 'comments',
                populate: { path: 'createdBy', select: 'username' },
            });

        return res.status(200).json({ bugTickets });
    } catch (error) {
        console.error('Error getting bugs by project:', error);
        return res.status(500).json({ message: 'Error getting bugs by project' });
    }
};



// const getBugsByProjectManager = async (req, res) => {
//     const { managerId } = req.params;
//     console.log('managerid', managerId)

//     try {
//         // Find the user by managerId to make sure the manager exists
//         const manager = await User.findById(managerId);
//         console.log('manager:', manager);

//         if (!manager) {
//             return res.status(404).json({ message: 'Manager not found' });
//         }


//         // Query the BugTicket model to find bug tickets
//         const bugTickets = await BugTicket.find({ 'project.projectManager': managerId });
//         console.log('bugTickets', bugTickets)

//         return res.status(200).json({ bugTickets });
//     } catch (error) {
//         console.error('Error getting bug tickets belonging to manager:', error);
//         return res.status(500).json({ message: 'Error getting bug tickets belonging to manager' });
//     }
// };

/**********************************************New Below***************************************** */
// Get bug tickets by project manager
const getBugsByProjectManager = async (req, res) => {
    const { managerId } = req.params;

    try {
        // Find the user by managerId to make sure the manager exists
        const manager = await User.findById(managerId);

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        // Query the BugTicket model to find bug tickets where the project's projectManager is the managerId
        const bugTickets = await BugTicket.find({ 'project.projectManager': managerId })
            .populate('createdBy', 'username')
            .populate({
                path: 'comments',
                populate: { path: 'createdBy', select: 'username' },
            });

        return res.status(200).json({ bugTickets });
    } catch (error) {
        console.error('Error getting bug tickets belonging to manager:', error);
        return res.status(500).json({ message: 'Error getting bug tickets belonging to manager' });
    }
};






// Create a new comment on a bug ticket
const createComment = async (req, res) => {
    const { id } = req.params; // ID of the bug ticket where the comment will be added
    const { text } = req.body; // Text of the comment

    try {
        // Find the bug ticket by ID
        const bugTicket = await BugTicket.findById(id);

        if (!bugTicket) {
            return res.status(404).json({ message: 'Bug ticket not found' });
        }

        // Create a new Comment document
        const newComment = new Comment({
            text,
            createdBy: req.user.id, // Assuming you have user authentication in your application
        });

        // Save the new comment
        await newComment.save();

        // Update the lastUpdatedBy and lastUpdatedAt fields for the bug ticket
        bugTicket.lastUpdatedBy = {
            id: req.user.id, // Set the user's ID
            username: req.user.username, // Set the user's username
        };
        bugTicket.lastUpdatedAt = new Date();

        // Push the comment's ID to the bug ticket's comments array
        bugTicket.comments.push(newComment._id);

        // Save the updated bug ticket with the new comment
        await bugTicket.save();

        // Populate the createdBy field of the new comment with the username
        await newComment.populate('createdBy', 'username');

        return res.status(201).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ message: 'Error creating comment' });
    }
};


//Bug Statistics
const getBugStatisticsByProject = async (req, res) => {
    try {
        const bugStatistics = await BugTicket.aggregate([
            {
                $project: {
                    project: 1,
                    createdAt: 1,
                    resolvedAt: 1,
                },
            },
            {
                $group: {
                    _id: {
                        project: '$project',
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' },
                    },
                    bugsRaised: { $sum: 1 },
                    bugsFixed: {
                        $sum: {
                            $cond: [{ $gte: ['$resolvedAt', '$createdAt'] }, 1, 0],
                        },
                    },
                },
            },
            {
                $addFields: {
                    monthName: {
                        $let: {
                            vars: {
                                monthsInString: [
                                    '',
                                    'January', 'February', 'March', 'April',
                                    'May', 'June', 'July', 'August',
                                    'September', 'October', 'November', 'December',
                                ],
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', '$_id.month'],
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'projects', // Adjust to your project model name if it's different
                    localField: '_id.project',
                    foreignField: '_id',
                    as: 'projectDetails',
                },
            },
            {
                $unwind: '$projectDetails',
            },
            {
                $group: {
                    _id: '$_id.project',
                    projectName: { $first: '$projectDetails.name' },
                    bugStats: {
                        $push: {
                            month: '$monthName',
                            year: '$_id.year',
                            bugsRaised: '$bugsRaised',
                            bugsFixed: '$bugsFixed',
                        },
                    },
                },
            },
        ]);

        return res.status(200).json({ bugStatistics });
    } catch (error) {
        console.error('Error getting bug statistics:', error);
        return res.status(500).json({ message: 'Error getting bug statistics' });
    }
};


//Get Bug Statistics of each project

const getBugStatusPercentageByProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Retrieve bug tickets for the given project
        const bugTickets = await BugTicket.find({ project: projectId });

        if (bugTickets.length === 0) {
            return res.status(404).json({ message: 'No bug tickets found for this project' });
        }

        // Calculate the count of each bug status
        const statusCounts = bugTickets.reduce((acc, bugTicket) => {
            acc[bugTicket.status] = (acc[bugTicket.status] || 0) + 1;
            return acc;
        }, {});

        // Calculate percentages
        const totalBugs = bugTickets.length;
        const statusPercentages = {};
        for (const status in statusCounts) {
            statusPercentages[status] = ((statusCounts[status] / totalBugs) * 100).toFixed(2);
        }

        return res.status(200).json({ bugStatusPercentages: statusPercentages });
    } catch (error) {
        console.error('Error getting bug status percentage:', error);
        return res.status(500).json({ message: 'Error getting bug status percentage' });
    }
};


//Get Bug Statistics of All Projects

const getBugStatusPercentageAllProjects = async (req, res) => {
    try {
        // Retrieve all projects
        const projects = await Project.find();

        const bugStatusPercentageAllProjects = [];

        // Loop through each project and calculate the bug status percentages
        for (const project of projects) {
            const bugTickets = await BugTicket.find({ project: project._id });

            if (bugTickets.length > 0) {
                const statusCounts = bugTickets.reduce((acc, bugTicket) => {
                    acc[bugTicket.status] = (acc[bugTicket.status] || 0) + 1;
                    return acc;
                }, {});

                const totalBugs = bugTickets.length;
                const statusPercentages = {};
                for (const status in statusCounts) {
                    statusPercentages[status] = ((statusCounts[status] / totalBugs) * 100).toFixed(2);
                }

                bugStatusPercentageAllProjects.push({
                    project: project.name,
                    bugStatusPercentages: statusPercentages,
                });
            }
        }

        return res.status(200).json({ bugStatusPercentageAllProjects });
    } catch (error) {
        console.error('Error getting bug status percentage for all projects:', error);
        return res.status(500).json({ message: 'Error getting bug status percentage for all projects' });
    }
};




module.exports = {
    createBugTicket,
    getAllBugTickets,
    getBugTicketById,
    updateBugTicket,
    getAllBugsLoggedByTester,
    getAllBugsAssignedToDeveloper,
    getBugsByProject,
    // getBugsByProjectManager,
    getBugsByProjectManager,
    createComment,
    getBugStatisticsByProject,
    getBugStatusPercentageByProject,
    getBugStatusPercentageAllProjects
};
