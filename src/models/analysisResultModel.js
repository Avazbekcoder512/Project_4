const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    section: String,
    analysisType: String,
    analysisResult: String,
    diagnosis: String,
    recommendation: String,
    doctorId: { type: mongoose.Schema.Types.ObjectId },
    doctor: String,
    doctorPhone: String,
    doctorPosition: String,
    createdAt: String,
    updatedAt: String
});

exports.resultModel = mongoose.model('AnalysisResult', resultSchema);