const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    chatId: Number,
    first_name: { type: String, default: 'User' },
    last_name: { type: String, default: 'User' },
    username: { type: String, default: 'Username' },
    language: String,
}, { timestamps: true })

exports.userModel = mongoose.model('User', userSchema)