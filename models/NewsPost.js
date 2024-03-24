const mongoose = require('mongoose');

const newsPostSchema = new mongoose.Schema({
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
    url: {
        type: String,
        required: true
    },
    pdfFile: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

const NewsPost = mongoose.model('NewsPost', newsPostSchema);

module.exports = NewsPost;