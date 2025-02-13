const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: 'User' },
    last_name: { type: String, default: 'User' },
    username: { type: String, default: 'Username' }
}, { timestamps: true })

exports.userModel = mongoose.model('User', userSchema)