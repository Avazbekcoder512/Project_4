const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
    section: String,
    analysisType: String,
    analysisResult: String,
    diagnosis: String,
    recommendation: String,
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'}
}, {timestamps: true});

exports.resultModel = mongoose.model('AnalysisResult', resultSchema);