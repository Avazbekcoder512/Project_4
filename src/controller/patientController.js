require('dotenv').config()
const { validationResult, matchedData } = require('express-validator')
const { patientModel } = require('../models/patientModel')
const { resultModel } = require('../models/analysisResultModel')

// Bemor yaratish
exports.createPatient = async (req, res) => {
    try {

        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = req.body

        const condidat = await patientModel.findOne({ orderNumber: data.orderNumber })

        if (condidat) {
            return res.status(400).send({
                error: "Bunday tartib raqamli bemor allaqachon ro'yhatdan o'tgan!"
            })
        }

        const checkEmail = await patientModel.findOne({email: data.email})

        if (checkEmail) {
            return res.status(400).send({
                error: "Bunday emailga ega bemor allaqachon ro'yhatdan o'tgan!"
            }) 
        }

        const patient = await patientModel.create({
            name: data.name,
            date_of_birth: data.date_of_birth,
            email: data.email,
            gender: data.gender,
            orderNumber: data.orderNumber,

            analysisResults: []
        })

        return res.status(201).send({
            message: "Bemor muvaffaqiyatli yaratildi!",
            patient
        })

    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }
        return res.status(500).send("Serverda xatolik!");
    }
}

// Hamma bemorlarni ko'rish
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await patientModel.find()
        
        if (!patients || patients.length == 0) {
            return res.status(404).send({
                error: "Bemorlar mavjud emas!"
            })
        }

        return res.status(200).send({
            message: "Bemorlar ro'yxati!",
            patients
        })
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }
        return res.status(500).send("Serverda xatolik!");
    }
}

// Bitta bemorni ko'rish
exports.getOnePatient = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const patient = await patientModel.findById(id).populate({
            path: 'analysisResults',
            populate: {
                path: 'doctor',
                model: 'Doctor'
            }
        })

        if (!patient) {
            return res.status(404).send({
                error: "Bemor topilmadi!"
            })
        }

        return res.status(200).send({
            message: "Bemor ma'lumotlari!",
            patient
        })

    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }
        return res.status(500).send("Serverda xatolik!");
    }
}

// Bemor ma'lumotlarini yangilash
exports.updatedPateint = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const patient = await patientModel.findById(id)

        if (!patient) {
            return res.status(404).send({
                error: "Bemor topilmadi!"
            })
        }

        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);

        const checkEmail = await patientModel.findOne({email: data.email})

        if (checkEmail) {
            return res.status(400).send({
                error: "Bunday emailga ega bemor allaqachon ro'yhatdan o'tgan!"
            }) 
        }

        const updatedPateint = {
            name: data.name || patient.name,
            date_of_birth: data.date_of_birth || patient.date_of_birth,
            gender: data.gender || patient.gender,
            email: data.email || patient.email
        }

        await patientModel.findByIdAndUpdate(id, updatedPateint)

        return res.status(200).send({
            message: "Bemor ma'lumotlari muvaffaqiyatli yangilandi!",
            updatedPateint
        })

    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }
        return res.status(500).send("Serverda xatolik!");
    }
}

// Be'morni o'chirish
exports.deletePatient = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const patient = await patientModel.findById(id)

        if (!patient) {
            return res.status(404).send({
                error: "Bemor topilmadi!"
            })
        }

        await resultModel.deleteMany({ patient: id })

        await patientModel.findByIdAndDelete(id)

        return res.status(200).send({
            message: "Bemor muvaffaqiyatli o'chirildi!"
        })

    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }
        return res.status(500).send("Serverda xatolik!");
    }
}

// Bemorni qidirish
exports.searchPatient = async (req, res) => {
    try {
        const data = await patientModel.find(
            {
                "$or": [
                    { orderNumber: { $regex: req.params.key } },
                ]
            }
        )

        if (data.length == 0) {
            return res.status(404).send({
                error: "Bemor topilmadi!"
            })
        }

        return res.status(200).send(data)

    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }
        return res.status(500).send("Serverda xatolik!");
    }
}