const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    chatId: Number,
    name: { type: String, default: 'User' },
    username: { type: String, default: 'Username' },
    language: String,
    province: String,
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
    role: {type: String, default: 'user'},
    analysisResults: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AnalysisResult' }]
}, { timestamps: true })

exports.userModel = mongoose.model('User', userSchema)