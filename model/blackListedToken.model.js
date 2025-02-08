const mongoose = require('mongoose');

const blackListedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  blacklistedAt: { type: Date, default: Date.now }
});

const BlackListedTokenModel = mongoose.model('blackListedToken', blackListedTokenSchema);

module.exports = BlackListedTokenModel


