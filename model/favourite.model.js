const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'note', required: true },
    addedAt: { type: Date, default: Date.now }
}, {
    versionKey: false
});

const FavoriteModel = mongoose.model("favorite", favoriteSchema);

module.exports = FavoriteModel;
