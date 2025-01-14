const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    gender: String,
    email: String,
    role: {type: String, default: 'admin'}
}, {timestamps: true})

exports.adminModel = mongoose.model('Admin', adminSchema)