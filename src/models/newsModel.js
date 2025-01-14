const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    uz_title: String,
    ru_title: String,
    en_title: String,

    uz_description: String,
    ru_description: String,
    en_description: String,
    image: String
}, {timestamps: true})

exports.newsModel = mongoose.model('News', newsSchema)