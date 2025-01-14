const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema({
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    name: String,
    price: Number
}, { timestamps: true })

exports.analysisModel = mongoose.model('Analysis', analysisSchema)