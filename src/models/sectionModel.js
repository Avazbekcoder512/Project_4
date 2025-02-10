const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const sectionSchema = new mongoose.Schema({
    uz_name: String,
    ru_name: String,
    en_name: String,
    uz_description: String,
    ru_description: String,
    en_description: String,
    analysis: [{ type: mongoose.Schema.Types.ObjectId, ref: "Analysis" }]
}, { timestamps: true });

sectionSchema.plugin(mongoosePaginate)

exports.sectionModel = mongoose.model('Section', sectionSchema);