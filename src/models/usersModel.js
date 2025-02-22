const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    chatId: Number,
    name: { type: String, default: 'User' },
    username: { type: String, default: 'Username' },
    language: String,
    region: String,
    district: String,
    quarter: String,
    street: String,
    house: String,
    date_of_birth: String,
    gender: String,
    phoneNumber: String,
    email: String,
    service: String,
    role: {type: String, default: 'user'},
}, { timestamps: true })

exports.userModel = mongoose.model('User', userSchema)