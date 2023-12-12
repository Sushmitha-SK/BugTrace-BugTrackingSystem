const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
});

const Developer = mongoose.model('Developer', developerSchema);

module.exports = Developer;
