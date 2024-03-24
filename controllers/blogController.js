const fs = require('fs');
const path = require('path');
const BlogPost = require('../models/BlogPost');

exports.getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find();
        return res.json(blogPosts);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.getBlogPostsById = async (req, res) => {
    try {
        const postId = req.params.id;

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        return res.json(blogPost);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.createBlogPost = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        const sanitizedTitle = title.trim();
        const sanitizedContent = content.trim();
        const sanitizedAuthor = author.trim();

        if (!sanitizedTitle || !sanitizedContent || !sanitizedAuthor) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const images = req.files['images'].map(file => file.filename);

        const newBlogPost = new BlogPost({
            title: sanitizedTitle,
            images,
            content: sanitizedContent,
            author: sanitizedAuthor
        });

        await newBlogPost.save();
        return res.status(201).json({ message: 'Blog post created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteBlogPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const blogPostToDelete = await BlogPost.findById(postId);

        if (!blogPostToDelete) {
            return res.status(400).json({ message: 'Blog post not found' });
        }

        blogPostToDelete.images.forEach(image => {
            const imagePath = path.join(__dirname, '..', 'uploads', 'images', image);
            fs.unlinkSync(imagePath);
        })

        await BlogPost.deleteOne({ _id: postId });

        return res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.removeImageBlogPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const imageToRemove = req.body.imageToRemove;

        const blogPost = await BlogPost.findById(postId);

        if (!blogPost) {
            return res.status(400).json({ message: 'Blog post not found' });
        }

        blogPost.images = blogPost.images.filter(image => image !== imageToRemove);

        await blogPost.save();

        const imagePath = path.join(__dirname, '..', 'uploads', 'images', imageToRemove);
        fs.unlinkSync(imagePath);

        return res.status(200).json({ message: 'Image removed from post successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.editBlogPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content, author } = req.body;

        const sanitizedTitle = title.trim();
        const sanitizedContent = content.trim();
        const sanitizedAuthor = author.trim();

        if (!sanitizedTitle || !sanitizedContent || !sanitizedAuthor) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        let newImages = [];
        if (req.files && req.files['images']) {
            newImages = req.files['images'].map(file => file.filename);
        }

        const blogPost = await BlogPost.findById(postId);

        if (!blogPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const updatedImages = [...blogPost.images, ...newImages];

        await BlogPost.findByIdAndUpdate(postId, {
            title: sanitizedTitle,
            images: updatedImages,
            content: sanitizedContent,
            author: sanitizedAuthor
        });

        return res.status(200).json({ message: 'Blog post edited successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}