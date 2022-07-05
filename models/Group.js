const mongoose = require('mongoose');
const {UserSchema} = require("./User");
const groupSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String
    },
    website: {
        type: String
    },
    date:{
        type:Date
    },
    bio: {
        type: String
    },
    size: {
        type: Number
    },
    currsize: {
        type: Number 
    },
    done: {
        type: Boolean,
        default: false
    },
    participants: []
})

module.exports = Group = mongoose.model('group', groupSchema);