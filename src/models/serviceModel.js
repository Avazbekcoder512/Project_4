const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    uz_name: String,
    ru_name: String,
    en_name: String,

    uz_title: String,
    ru_title: String,
    en_title: String,

    uz_description: String,
    ru_description: String,
    en_description: String,
}, {timestamps: true})

exports.serviceModel = mongoose.model('Service', serviceSchema)