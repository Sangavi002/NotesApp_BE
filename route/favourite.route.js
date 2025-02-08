const express = require('express');
const favouriterouter = express.Router();
const FavoriteModel = require('../model/favourite.model');
const auth = require('../middleware/auth.middleware'); 

favouriterouter.post('/favorites/:noteId', auth, async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.body.userId;

        const existingFavorite = await FavoriteModel.findOne({ userId, noteId });
        if (existingFavorite) {
            return res.status(400).json({ message: 'Note is already in favorites' });
        }

        const favorite = new FavoriteModel({ userId, noteId });
        await favorite.save();

        res.status(201).json({ message: 'Note added to favorites' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark as favorite' });
    }
});


favouriterouter.delete('/favorites/:noteId', auth, async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.body.userId;

        const removedFavorite = await FavoriteModel.findOneAndDelete({ userId, noteId });
        if (!removedFavorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove from favorites' });
    }
});


favouriterouter.get('/favorites', auth, async (req, res) => {
    try {
        const userId = req.userId || req.body.userId; // Fallback to req.body.userId

        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing' });
        }

        const favorites = await FavoriteModel.find({ userId }).populate('noteId');

        res.status(200).json(favorites.map(fav => fav.noteId));
    } catch (error) {
        console.error('Error fetching favorites:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

module.exports = favouriterouter;
