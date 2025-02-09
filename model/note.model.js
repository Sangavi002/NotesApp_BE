const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    title: { type: String },
    text: { type: String, required: true },
    images: [{ type: String }],
    createdAt: { 
        type: String, 
        default: () => new Date().toLocaleString('en-GB', { 
            timeZone: 'Asia/Kolkata', 
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
