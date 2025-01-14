const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema({
    uz_name: String,
    ru_name: String,
    en_name: String,

    username: String,
    password: String,

    uz_position: String,
    ru_position: String,
    en_position: String,
    
    uz_description: String,
    ru_description: String,
    en_description: String,
    image: String,
    role: {type: String, default: 'staff' }
}, {timestamps: true})

exports.staffModel = mongoose.model('Staff', staffSchema)