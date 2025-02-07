const mongoose = require("mongoose");

const blackListedTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    }
},{
    versionKey: false
});

const BlackListedTokenModel = mongoose.model('BlacklistedToken', blackListedTokenSchema);

module.exports = BlackListedTokenModel;