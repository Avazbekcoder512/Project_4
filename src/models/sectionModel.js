const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    uz_name: String,
    ru_name: String,
    en_name: String,
    uz_description: String,
    ru_description: String,
    en_description: String,
    analysis: [{ type: mongoose.Schema.Types.ObjectId, ref: "Analysis" }]
}, { timestamps: true });

exports.sectionModel = mongoose.model('Section', sectionSchema);