const express = require('express');
const notesrouter = express.Router();
const NotesModel = require('../model/note.model');
const auth = require('../middleware/auth.middleware'); 
const upload = require('../config/multer.config');

const axios = require('axios');
const formData = require('form-data');

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
        const { title, text, userId } = req.body;

        const newImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const form = new formData();
                form.append('image', file.buffer.toString('base64'));

                const response = await axios.post(
                    `https://api.imgbb.com/1/upload?key=48d30aa1480ac6273b614753126532e5`, // Replace with your actual API key
                    form,
                    { headers: form.getHeaders() }
                );

                newImages.push(response.data.data.url);
            }
        }

        const existingNote = await NotesModel.findOne({ _id: noteId, userId });
        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }

        const updatedImages = [...newImages].slice(0, 5);

        const updatedNote = await NotesModel.findOneAndUpdate(
            { _id: noteId, userId },
            { title, text, images: updatedImages },
            { new: true }
        );

        res.status(200).json({ 
            message: 'Note updated successfully', 
            updatedNote 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the note' });
    }
});

module.exports = notesrouter;

