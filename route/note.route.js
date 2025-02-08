const express = require('express');
const notesrouter = express.Router();
const NotesModel = require('../model/note.model');
const auth = require('../middleware/auth.middleware'); 
const upload = require('../config/multer.config');

notesrouter.post('/notes', auth, upload.array('images', 5), async (req, res) => {
    try {
        const { title, text, userId } = req.body;
        const imagePaths = req.files ? req.files.map(file => file.path) : []; // Extract image paths

        const newNote = new NotesModel({
            title: title || '',
            text,
            userId,
            images: imagePaths 
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

        
        const newImages = req.files ? req.files.map(file => file.path) : [];

        const existingNote = await NotesModel.findOne({ _id: noteId, userId: userId });
        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }

    
        const updatedImages = [...existingNote.images, ...newImages].slice(0, 5);

        
        const updatedNote = await NotesModel.findOneAndUpdate(
            { _id: noteId, userId: userId },
            { title, text, images: updatedImages },
            { new: true }
        );

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the note' });
    }
});



module.exports = notesrouter;

