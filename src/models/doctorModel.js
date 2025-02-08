const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const doctorSchema = new mongoose.Schema({
    uz_name: String,
    ru_name: String,
    en_name: String,
    
    username: String,
    password: String,
    
    uz_experience: String,
    ru_experience: String,
    en_experience: String,

    uz_position: String,
    ru_position: String,
    en_position: String,

    uz_category: String,
    ru_category: String,
    en_category: String,

    uz_description: String,
    ru_description: String,
    en_description: String,
    phoneNumber: String,
    gender: String,
    image: String,  
    role: {type: String, default: 'doctor'}
}, {timestamps: true})

doctorSchema.plugin(mongoosePaginate)

exports.doctorModel = mongoose.model('Doctor', doctorSchema)