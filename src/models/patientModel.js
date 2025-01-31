const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    name: String,
    date_of_birth: String,
    gender: String,
    email: String,
    orderNumber: Number,
    verificationCode: String,
    analysisResults: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AnalysisResult' }]
}, { timestamps: true })

exports.patientModel = mongoose.model('Patient', patientSchema)