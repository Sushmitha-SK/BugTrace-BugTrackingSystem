const mongoose = require('mongoose');

const bugTicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['New', 'Open', 'In Progress', 'Resolved', 'Reopen', 'Closed'],
        default: 'New',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Crtical'],
        default: 'Medium',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer', //Reference to the Developer Model
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdatedBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
        },
        username: {
            type: String,
        },
    },
    lastUpdatedAt: {
        type: Date,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],

});

const BugTicket = mongoose.model('BugTicket', bugTicketSchema);
module.exports = BugTicket;