const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    gender: String,
    email: String,
    role: String
}, {timestamps: true})

exports.adminModel = mongoose.model('Admin', adminSchema)