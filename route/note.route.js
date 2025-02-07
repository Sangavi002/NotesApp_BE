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

module.exports = notesrouter;
