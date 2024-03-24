const fs = require('fs');
const path = require('path');
const NewsPost = require('../models/NewsPost');

exports.getAllNewsPosts = async (req, res) => {
    try {
        const newsPosts = await NewsPost.find();
        return res.json(newsPosts);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.getNewsPostById = async (req, res) => {
    try {
        const newsId = req.params.id;

        const newsPost = await NewsPost.findById(newsId);
        if (!newsPost) {
            return res.status(404).json({ message: 'News post not found' });
        }
        return res.json(newsPost);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.createNewsPost = async (req, res) => {
    try {
        const {
            title,
            project_type,
            location,
            start_date,
            end_date,
            description,
            url
        } = req.body;

        const sanitizedTitle = title.trim();
        const sanitizedProjectType = project_type.trim();
        const sanitizedLocation = location.trim();
        const sanitizedStartDate = start_date.trim();
        const sanitizedEndDate = end_date.trim();
        const sanitizedDescription = description.trim();
        const sanitizedUrl = url.trim();

        if (!sanitizedTitle || !sanitizedProjectType || !sanitizedLocation || !sanitizedStartDate || !sanitizedEndDate || !sanitizedDescription || !sanitizedUrl) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const dateFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!sanitizedStartDate.match(dateFormat) || !sanitizedEndDate.match(dateFormat)) {
            return res.status(400).json({ message: 'Date format must be YYYY-MM-DD' });
        }

        if (sanitizedEndDate < sanitizedStartDate) {
            return res.status(400).json({ message: 'End date cannot be before start date' });
        }

        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!sanitizedUrl.match(urlPattern)) {
            return res.status(400).json({ message: 'URL format is not valid' })
        }

        const images = req.files['images'].map(file => file.filename);

        const pdfFile = req.files['pdfFile'][0].filename;

        const newNewsPost = new NewsPost({
            title: sanitizedTitle,
            project_type: sanitizedProjectType,
            location: sanitizedLocation,
            start_date: sanitizedStartDate,
            end_date: sanitizedEndDate,
            images,
            description: sanitizedDescription,
            url: sanitizedUrl,
            pdfFile
        });

        await newNewsPost.save();
        return res.status(201).json({ message: 'News post created successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteNewsPost = async (req, res) => {
    try {
        const newsId = req.params.id;

        const newsPostToDelete = await NewsPost.findById({ _id: newsId });

        if (!newsPostToDelete) {
            return res.status(404).json({ message: 'News post not found' });
        }

        newsPostToDelete.images.forEach(image => {
            const imagePath = path.join(__dirname, '..', 'uploads', 'images', image);
            fs.unlinkSync(imagePath);
        })

        const pdfPath = path.join(__dirname, '..', 'uploads', 'files', newsPostToDelete.pdfFile);
        fs.unlinkSync(pdfPath);

        await NewsPost.deleteOne({ _id: newsId });

        return res.status(200).json({ message: 'News post deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.removeImageNewsPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const imageToRemove = req.body.imageToRemove;

        const newsPost = await NewsPost.findById(postId);

        if (!newsPost) {
            return res.status(400).json({ message: 'Blog post not found' });
        }

        newsPost.images = newsPost.images.filter(image => image !== imageToRemove);

        await newsPost.save();

        const imagePath = path.join(__dirname, '..', 'uploads', 'images', imageToRemove);
        fs.unlinkSync(imagePath);

        return res.status(200).json({ message: 'Image removed from post successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.editNewsPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, project_type, location, start_date, end_date, description, url } = req.body;

        const sanitizedTitle = title.trim();
        const sanitizedProjectType = project_type.trim();
        const sanitizedLocation = location.trim();
        const sanitizedStartDate = start_date.trim();
        const sanitizedEndDate = end_date.trim();
        const sanitizedDescription = description.trim();
        const sanitizedUrl = url.trim();

        if (!sanitizedTitle || !sanitizedProjectType || !sanitizedLocation || !sanitizedStartDate || !sanitizedEndDate || !sanitizedDescription || !sanitizedUrl) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const dateFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!sanitizedStartDate.match(dateFormat) || !sanitizedEndDate.match(dateFormat)) {
            return res.status(400).json({ message: 'Date format must be YYYY-MM-DD' });
        }

        if (sanitizedEndDate < sanitizedStartDate) {
            return res.status(400).json({ message: 'End date cannot be before start date' });
        }

        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!sanitizedUrl.match(urlPattern)) {
            return res.status(400).json({ message: 'URL format is not valid' })
        }

        let newImages = [];
        if (req.files && req.files['images']) {
            newImages = req.files['images'].map(file => file.filename);
        }

        let newPdf = null;
        if (req.files && req.files['pdfFile']) {
            newPdf = req.files['pdfFile'][0].filename;
        }

        const newsPost = await NewsPost.findById(postId);

        if (!newsPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const updatedImages = [...newsPost.images, ...newImages];

        if (newPdf && newsPost.pdfFile) {
            const pdfPath = path.join(__dirname, '..', 'uploads', 'files', newsPost.pdfFile);
            fs.unlinkSync(pdfPath);
        }

        await NewsPost.findByIdAndUpdate(postId,
            {
                title: sanitizedTitle,
                project_type: sanitizedProjectType,
                location: sanitizedLocation,
                start_date: sanitizedStartDate,
                end_date: sanitizedEndDate,
                images: updatedImages,
                description: sanitizedLocation,
                url: sanitizedUrl,
                pdfFile: newPdf
            }
        );

        return res.status(200).json({ message: 'News post edited successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}