const mongoose = require('mongoose');

const projectPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    project_type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    opinion: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

const ProjectPost = mongoose.model('ProjectPost', projectPostSchema);

module.exports = ProjectPost;