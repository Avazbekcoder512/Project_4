const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const newsSchema = new mongoose.Schema({
    uz_title: String,
    ru_title: String,
    en_title: String,

    uz_description: String,
    ru_description: String,
    en_description: String,
    image: String
}, {timestamps: true})

newsSchema.plugin(mongoosePaginate)

exports.newsModel = mongoose.model('News', newsSchema)