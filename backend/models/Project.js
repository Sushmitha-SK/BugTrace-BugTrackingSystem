const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    projectManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a 'User' model for project managers
    },
    assignedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    bugTickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BugTicket',
        },
    ],
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
