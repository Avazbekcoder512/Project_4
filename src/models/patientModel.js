const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    chatId: Number,
    name: { type: String, default: 'User' },
    username: { type: String, default: 'Username' },
    step: Number,
    language: String,
    region: String,
    district: String,
    quarter: String,
    address: String,
    date_of_birth: String,
    gender: String,
    phoneNumber: String,
    email: String,
    service: String,
    orderNumber: Number,
    verificationCode: String,
    role: {type: String, default: 'patient'},
    analysisResults: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AnalysisResult' }]
}, { timestamps: true })

exports.patientModel = mongoose.model('Patient', patientSchema)