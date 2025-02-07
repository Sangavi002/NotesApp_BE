const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: {type: String, require: true},
    lastname: {type: String, require: true},
    username: {type: String, require: true},
    password: {type: String, require: true},
},{
    versionKey: false
});

const UserModel = mongoose.model("user",userSchema);

module.exports = UserModel