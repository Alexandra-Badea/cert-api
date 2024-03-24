const fs = require('fs');
const path = require('path');
const ProjectPost = require('../models/ProjectPost');

exports.getAllProjectsPosts = async (req, res) => {
    try {
        const projectType = req.params.projectType;
        const projectPosts = await ProjectPost.find({ project_type: projectType });
        res.json(projectPosts);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.getProjectPostsById = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projectPost = await ProjectPost.findById(projectId);
        if (!projectPost) {
            return res.status(404).json({ message: 'Project post not found' });
        }
        return res.json(projectPost);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.createProjectPost = async (req, res) => {
    try {
        const {
            title,
            project_type,
            location,
            start_date,
            end_date,
            description,
            opinion
        } = req.body;

        const sanitizedTitle = title.trim();
        const sanitizedProjectType = project_type.trim();
        const sanitizedLocation = location.trim();
        const sanitizedStartDate = start_date.trim();
        const sanitizedEndDate = end_date.trim();
        const sanitizedDescription = description.trim();
        const sanitizedOpinion = opinion.trim();

        if (!sanitizedTitle || !sanitizedProjectType || !sanitizedLocation || !sanitizedStartDate || !sanitizedEndDate || !sanitizedDescription || !sanitizedOpinion) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const dateFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!sanitizedStartDate.match(dateFormat) || !sanitizedEndDate.match(dateFormat)) {
            return res.status(400).json({ message: 'Date format must be YYYY-MM-DD' });
        }

        if (sanitizedEndDate < sanitizedStartDate) {
            return res.status(400).json({ message: 'End date cannot be before start date' });
        }

        const images = req.files['images'].map(file => file.filename);

        const newProjectPost = new ProjectPost({
            title: sanitizedTitle,
            project_type: sanitizedProjectType,
            location: sanitizedLocation,
            start_date: sanitizedStartDate,
            end_date: sanitizedEndDate,
            images,
            description: sanitizedDescription,
            opinion: sanitizedOpinion
        });

        await newProjectPost.save();
        return res.status(201).json({ message: 'Project post created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteProjectPost = async (req, res) => {
    try {
        const projectId = req.params.id;
        const projectPostToDelete = await ProjectPost.findById(projectId);

        if (!projectPostToDelete) {
            return res.status(404).json({ message: 'Project post not found' });
        }

        projectPostToDelete.images.forEach(image => {
            const imagePath = path.join(__dirname, '..', 'uploads', 'images', image);
            fs.unlinkSync(imagePath);
        })

        await ProjectPost.deleteOne({ _id: projectId });

        return res.status(200).json({ message: 'Project post deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.removeImageBlogPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const imageToRemove = req.body.imageToRemove;

        const projectPost = await ProjectPost.findById(postId);

        if (!projectPost) {
            return res.status(400).json({ message: 'Project post not found' });
        }

        projectPost.images = projectPost.images.filter(image => image !== imageToRemove);

        await projectPost.save();

        const imagePath = path.join(__dirname, '..', 'uploads', 'images', imageToRemove);
        fs.unlinkSync(imagePath);

        return res.status(200).json({ message: 'Image removed from post successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.editProjectPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, project_type, location, start_date, end_date, description, opinion } = req.body;

        const sanitizedTitle = title.trim();
        const sanitizedProjectType = project_type.trim();
        const sanitizedLocation = location.trim();
        const sanitizedStartDate = start_date.trim();
        const sanitizedEndDate = end_date.trim();
        const sanitizedDescription = description.trim();
        const sanitizedOpinion = opinion.trim();

        if (!sanitizedTitle || !sanitizedProjectType || !sanitizedLocation || !sanitizedStartDate || !sanitizedEndDate || !sanitizedDescription || !sanitizedOpinion) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const dateFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!sanitizedStartDate.match(dateFormat) || !sanitizedEndDate.match(dateFormat)) {
            return res.status(400).json({ message: 'Date format must be YYYY-MM-DD' });
        }

        if (sanitizedEndDate < sanitizedStartDate) {
            return res.status(400).json({ message: 'End date cannot be before start date' });
        }

        let newImages = [];
        if (req.files && req.files['images']) {
            newImages = req.files['images'].map(file => file.filename);
        }

        const projectPost = await ProjectPost.findById(postId);

        if (!projectPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const updatedImages = [...projectPost.images, ...newImages];

        await ProjectPost.findByIdAndUpdate(postId, {
            title: sanitizedTitle,
            project_type: sanitizedProjectType,
            location: sanitizedLocation,
            start_date: sanitizedStartDate,
            end_date: sanitizedEndDate,
            images: updatedImages,
            description: sanitizedDescription,
            opinion: sanitizedOpinion
        });

        return res.status(200).json({ message: 'Project post edited successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
} 