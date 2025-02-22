const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    name: String,
    region: String,
    district: String,
    quarter: String,
    street: String,
    house: String,
    date_of_birth: String,
    gender: String,
    phoneNomber: String,
    email: String,
    service: String,
    orderNumber: Number,
    verificationCode: String,
    role: {type: String, default: 'patient'},
    analysisResults: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AnalysisResult' }]
}, { timestamps: true })

exports.patientModel = mongoose.model('Patient', patientSchema)