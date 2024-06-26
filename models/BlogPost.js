const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;