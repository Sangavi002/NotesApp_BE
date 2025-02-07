const express = require('express');
const notesrouter = express.Router();
const NotesModel = require('../model/note.model');
const auth = require('../middleware/auth.middleware'); 

// Create note route with authentication
notesrouter.post('/notes', auth, async (req, res) => {
    try {
        const { text, userId } = req.body; 
        const note = new NotesModel({ text, userId }); 
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save note' });
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

notesrouter.get('/notes/:id', auth, async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await NotesModel.findOne({ _id: noteId, userId: req.body.userId });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the note' });
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


notesrouter.put('/notes/:id', auth, async (req, res) => {
    try {
        const noteId = req.params.id;
        const { text } = req.body;

        const updatedNote = await NotesModel.findOneAndUpdate(
            { _id: noteId, userId: req.body.userId },
            { text },
            { new: true } 
        );

        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the note' });
    }
});


module.exports = notesrouter;

