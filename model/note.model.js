const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { 
        type: String, 
        default: () => new Date().toLocaleString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        }) 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    versionKey: false
});

const NotesModel = mongoose.model("note", noteSchema);

module.exports = NotesModel;
