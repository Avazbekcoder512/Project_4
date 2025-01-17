const { patientModel } = require("../models/patientModel");
const { doctorModel } = require('../models/doctorModel')
const { validationResult, matchedData } = require('express-validator')
const { resultModel } = require("../models/analysisResultModel");
const nodemailer = require('nodemailer')
require('dotenv').config()
const jwt = require('jsonwebtoken')

// Transporter sozlash (Gmail uchun)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.User_Email,
        pass: process.env.User_Pass
    },
});

function formatDate(date) {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}, ${hours}:${String(minutes).padStart(
        2,
        "0"
    )}`;
}
const now = new Date();
const formattedDate = formatDate(now);

// Tahlil natijasini yaratish
exports.createAnalysisResult = async (req, res) => {
    try {
        // Authorization headerdan tokenni olish
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(404).send({
                error: 'Token not found',
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(404).send({
                error: 'Token not provided',
            });
        }

        const decodet = jwt.verify(token, process.env.JWT_KEY)

        const userId = decodet.id

        const doctor = await doctorModel.findById(userId)

        if (!doctor) {
            return res.status(404).send('Shifokor topilmadi!')
        }

        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);

        const patient = await patientModel.findById(data.patient)

        const result = await resultModel.create({
            patient: patient.id,
            section: data.section,
            analysisType: data.analysisType,
            analysisResult: data.analysisResult,
            diagnosis: data.diagnosis,
            recommendation: data.recommendation,
            doctor: doctor.uz_name,
            doctorPhone: doctor.phoneNumber,
            doctorPosition: doctor.uz_position,
            createdAt: formattedDate
        })

        await patientModel.findByIdAndUpdate(data.patient, {
            $push: { analysisResults: result.id }
        })

        const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000);

        const verificationCode = generateRandomCode()

        await patientModel.findByIdAndUpdate(data.patient, { verificationCode: verificationCode }, { new: true })

        // HTML email shabloni
        const mailOptions = {
            from: '"Hayat Med" <avazbekqalandarov03@gmail.com>',
            to: `${patient.email}`,
            subject: "Tasdiqlash kodi",
            html: `
                <html>
        <head>
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #6c5ce7, #0984e3);
                    color: #fff;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0;
                }

                .container {
                    max-width: 600px;
                    width: 100%;
                    background: #fff;
                    border-radius: 20px;
                    padding: 50px;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }

                .container:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 25px 40px rgba(0, 0, 0, 0.2);
                }

                h1 {
                    font-size: 3em;
                    font-weight: 700;
                    color: black;
                    margin-bottom: 30px;
                    letter-spacing: 1px;
                }

                p {
                    font-size: 1.6em; /* Kattalashgan matn */
                    line-height: 1.8;
                    color: #2d3436;
                    margin: 15px 0;
                }

                p strong {
                    color: #0984e3;
                    font-weight: bold;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .container {
                        padding: 25px; /* Telefon uchun bo‘shliqlarni kichraytirish */
                    }

                    h1 {
                        font-size: 2.4em; /* Telefon uchun sarlavhani kichraytirish */
                    }

                    p {
                        font-size: 1.4em; /* Telefon uchun matnni kichraytirish */
                    }
                }

                @media (max-width: 480px) {
                    .container {
                        padding: 20px; /* Yana kichik telefonlar uchun bo‘shliq */
                    }

                    h1 {
                        font-size: 2.2em; /* H1 kichraytirish */
                    }

                    p {
                        font-size: 1.3em; /* P matnini yana kichraytirish */
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Tahlil natijangizni ko'rish uchun tasdiqlash kodi</h1>
                <p><strong>Buyurtma raqami:</strong> ${patient.orderNumber}</p>
                <p><strong>Tasdiqlash kodi:</strong> ${verificationCode}</p>
            </div>
        </body>
        </html>
            `,
        };

        // Email yuborish
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Xatolik yuz berdi:', error);
                return res.status(500).json({ message: 'Xatolik yuz berdi!' });
            }
            return res.status(201).send({
                message: "Tahlil natijasi muvaffaqiyatli yaratildi va emailga tasdiqlash kodi yuborldi!",
                result
            })
        });
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

// Tahlil natijalarini ko'rish
exports.getAnalysisResult = async (req, res) => {
    try {
        const result = await resultModel.find().populate('doctor', 'uz_name')

        if (!result || result.length == 0) {
            return res.status(404).send({
                error: "Tahlil natijalari topilmadi!"
            })
        }

        return res.status(200).send(result)
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

// Bitta tahlil natijasini ko'rish
exports.getOneAnalysisResult = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const result = await resultModel.findById(id).populate('doctor', 'uz_name')

        if (!result) {
            return res.status(404).send({
                error: "Tahlil natijasi topilmadi!"
            })
        }

        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message
            })
        }
        return res.status(500).send("Serverda xatolik!")
    }
}

// Tahlil natijasini yangilash
exports.updateAnalysisResult = async (req, res) => {
    try {
        // Authorization headerdan tokenni olish
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(404).send({
                error: 'Token not found',
            });
        }

        const token = authHeader.split(' ')[1]; // "Bearer <token>" formatidan tokenni ajratish
        if (!token) {
            return res.status(404).send({
                error: 'Token not provided',
            });
        }

        const decodet = jwt.verify(token, process.env.JWT_KEY)

        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const userId = decodet.id

        const checkDoctor = await resultModel.findOne({ _id: id, doctorId: userId })

        if (!checkDoctor) {
            return res.status(403).send({
                error: "Sizga bu tahlil natijasini o'zgartirishga ruxsat yo'q!"
            })
        }

        const oldResult = await resultModel.findById(id)

        if (!oldResult) {
            return res.status(404).send({
                error: "Tahlil natijasi topilmadi!"
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

        const patient = await patientModel.findById(oldResult.patient)

        const result = {
            section: data.section || oldResult.section,
            analysisType: data.analysisType || oldResult.analysisType,
            analysisResult: data.analysisResult || oldResult.analysisResult,
            diagnosis: data.diagnosis || oldResult.diagnosis,
            recommendation: data.recommendation || oldResult.recommendation,
            createdAt: oldResult.createdAt,
            updatedAt: formattedDate
        }

        await resultModel.findByIdAndUpdate(id, result, { new: true })

        const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000);

        const verificationCode = generateRandomCode()

        await patientModel.findByIdAndUpdate(patient.id, { verificationCode: verificationCode }, { new: true })

        // HTML email shabloni
        const mailOptions = {
            from: '"Hayat Med" <avazbekqalandarov03@gmail.com>',
            to: `${patient.email}`,
            subject: "Tasdiqlash kodi",
            html: `
                        <html>
                <head>
                    <style>
                        * {
                            box-sizing: border-box;
                            margin: 0;
                            padding: 0;
                        }
        
                        body {
                            font-family: 'Poppins', sans-serif;
                            background: linear-gradient(135deg, #6c5ce7, #0984e3);
                            color: #fff;
                            height: 100vh;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin: 0;
                        }
        
                        .container {
                            max-width: 600px;
                            width: 100%;
                            background: #fff;
                            border-radius: 20px;
                            padding: 50px;
                            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                            text-align: center;
                            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                        }
        
                        .container:hover {
                            transform: translateY(-10px);
                            box-shadow: 0 25px 40px rgba(0, 0, 0, 0.2);
                        }
        
                        h1 {
                            font-size: 3em;
                            font-weight: 700;
                            color: #0984e3;
                            margin-bottom: 30px;
                            letter-spacing: 1px;
                        }
        
                        p {
                            font-size: 1.6em; /* Kattalashgan matn */
                            line-height: 1.8;
                            color: #2d3436;
                            margin: 15px 0;
                        }
        
                        p strong {
                            color: #0984e3;
                            font-weight: bold;
                        }
        
                        /* Responsive */
                        @media (max-width: 768px) {
                            .container {
                                padding: 25px; /* Telefon uchun bo‘shliqlarni kichraytirish */
                            }
        
                            h1 {
                                font-size: 2.4em; /* Telefon uchun sarlavhani kichraytirish */
                            }
        
                            p {
                                font-size: 1.4em; /* Telefon uchun matnni kichraytirish */
                            }
                        }
        
                        @media (max-width: 480px) {
                            .container {
                                padding: 20px; /* Yana kichik telefonlar uchun bo‘shliq */
                            }
        
                            h1 {
                                font-size: 2.2em; /* H1 kichraytirish */
                            }
        
                            p {
                                font-size: 1.3em; /* P matnini yana kichraytirish */
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Tahlil natijangiz yangilandi!</h1>
                        <p><strong>Tahlil natijangizni ko'rish uchun tasdiqlash kodi</strong></p>
                        <p><strong>Buyurtma raqami:</strong> ${patient.orderNumber}</p>
                        <p><strong>Tasdiqlash kodi:</strong> ${verificationCode}</p>
                    </div>
                </body>
                </html>
                    `,
        };

        // Email yuborish
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Xatolik yuz berdi:', error);
                return res.status(500).json({ message: 'Xatolik yuz berdi!' });
            }
            return res.status(201).send({
                message: "Tahlil natijasi muvaffaqiyatli yangilandi va emailga tasdiqlash kodi yuborldi!",
                result
            })
        });
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message
            })
        }

        return res.status(500).send("Serverda xatolik!")
    }
}

// Tahlil natijasini o'chirish
exports.deleteAnalysisResult = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const result = await resultModel.findById(id)

        if (!result) {
            res.status(404).send({
                error: "Tahlil natijasi topilmadi!"
            })
        }

        await patientModel.findByIdAndUpdate(result.patient._id, {
            $pull: { analysisResults: result.id }
        })

        await resultModel.findByIdAndDelete(id)

        return res.status(200).send("Tahlil natijasi muvaffaqiyatli o'chirildi!")
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message
            })
        }

        return res.status(500).send("Serverda xatolik!")
    }
}

// Tahlil natijasini qidirish
exports.searchAnalysisResult = async (req, res) => {
    try {
        const data = await resultModel.find({
            $or: [
                { analysisType: { $regex: req.params.key } }
            ]
        })

        if (data.length == 0) {
            return res.status(404).send({
                error: "Tahlil natijasi topilmadi!"
            })
        }

        return res.status(200).send(data)
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message
            })
        }

        return res.status(500).send("Serverda xatolik!")
    }
}