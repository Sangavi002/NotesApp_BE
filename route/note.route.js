const express = require('express');
const notesrouter = express.Router();
const NotesModel = require('../model/note.model');
const auth = require('../middleware/auth.middleware'); 
const upload = require('../config/multer.config');

const axios = require('axios');
const formData = require('form-data');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'djk6xqfah',
    api_key: '836965336523849',
    api_secret: '2w7pZc1TEhR4FxlCdRjkJSD60M8'
});

notesrouter.post('/notes', auth, async (req, res) => {
    try {
        const { title, text, userId } = req.body;

        const newNote = new NotesModel({
            title: title || '',
            text,
            userId, 
        });

        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create the note' });
    }
});



notesrouter.get('/notes', auth, async (req, res) => {
    try {
        const notes = await NotesModel.find({ userId: req.body.userId }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

notesrouter.delete('/notes/:id', auth, async (req, res) => {
    try {
        const noteId = req.params.id;
        const deletedNote = await NotesModel.findOneAndDelete({ _id: noteId, userId: req.body.userId });

        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the note' });
    }
});

notesrouter.put('/notes/:id', auth, upload.array('images', 5), async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, text, userId, existingImages = [] } = req.body; // ✅ existingImages from request

        const newImages = [];

        // Upload Image to Cloudinary
        const uploadImage = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) {
                            console.error('Upload Error:', error);
                            return reject(error);
                        }
                        resolve(result.secure_url); // Store secure URL
                    }
                );
                uploadStream.end(fileBuffer); // Start upload
            });
        };

        // Upload New Images
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const imageUrl = await uploadImage(file.buffer);
                newImages.push(imageUrl);
            }
        }

        // Find the existing note
        const existingNote = await NotesModel.findOne({ _id: noteId, userId });
        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }

        // Filter existing images: Keep only those present in the request
        const filteredExistingImages = existingNote.images.filter(img => existingImages.includes(img));

        // Merge filtered existing images with new images (limit to 5)
        const updatedImages = [...filteredExistingImages, ...newImages].slice(0, 5);

        // ✅ Update the note with title, text, and updated images
        const updatedNote = await NotesModel.findOneAndUpdate(
            { _id: noteId, userId },
            { title, text, images: updatedImages },
            { new: true } // Return the updated note
        );

        res.status(200).json({ message: 'Note updated successfully', updatedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the note' });
    }
});



module.exports = notesrouter;

