const { patientModel } = require("../models/patientModel");
const { doctorModel } = require("../models/doctorModel");
const { validationResult, matchedData } = require("express-validator");
const { resultModel } = require("../models/analysisResultModel");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Transporter sozlash (Gmail uchun)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.User_Email,
        pass: process.env.User_Pass,
    },
});

function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

const now = new Date();
const formattedDate = formatDate(now);

// Tahlil natijasini yaratish
exports.createAnalysisResult = async (req, res) => {
    try {
        // Authorization headerdan tokenni olish
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(404).send({
                error: "Token not found",
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(404).send({
                error: "Token not provided",
            });
        }

        const decodet = jwt.verify(token, process.env.JWT_KEY);

        const userId = decodet.id;

        const doctor = await doctorModel.findById(userId);

        if (!doctor) {
            return res.status(404).send("Shifokor topilmadi!");
        }

        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);

        const patient = await patientModel.findById(data.patient);

        const result = await resultModel.create({
            patient: patient.id,
            section: data.section,
            analysisType: data.analysisType,
            analysisResult: data.analysisResult,
            diagnosis: data.diagnosis,
            recommendation: data.recommendation,
            doctorId: doctor._id,
            doctor: doctor.uz_name,
            doctorPhone: doctor.phoneNumber,
            doctorPosition: doctor.uz_position,
            createdAt: formattedDate,
        });

        await patientModel.findByIdAndUpdate(data.patient, {
            $push: { analysisResults: result.id },
        });

        const generateRandomCode = () =>
            Math.floor(100000 + Math.random() * 900000);

        const verificationCode = generateRandomCode();

        await patientModel.findByIdAndUpdate(
            data.patient,
            { verificationCode: verificationCode },
            { new: true }
        );

        // HTML email shabloni
        const mailOptions = {
            from: '"Hayat Med" <avazbekqalandarov03@gmail.com>',
            to: `${patient.email}`,
            subject: "Tasdiqlash kodi",
            html: `
                <html>
          <body style="margin: 0; padding: 0; background-color: #f6f6f6">
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f6f6f6; width: 100%; text-align: center"
    >
      <tr>
        <td height="40"></td> <!-- Tepadan bo'sh joy -->
      </tr>
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="450"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              background-color: #ffffff;
              max-width: 450px;
              width: 100%;
              padding: 30px;
              text-align: left;
              font-family: Arial, sans-serif;
              border-radius: 10px;
              box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
            "
          >
            <tr>
              <td align="center" style="padding-bottom: 15px">
                <img
                  src=" https://axhokgpxtritakejsqch.supabase.co/storage/v1/object/public/Images//logo.png"
                  alt="Logo"
                  width="180"
                  style="display: block"
                />
              </td>
            </tr>
            <tr>
              <td style="padding: 5px 15px">
                <h1
                  style="
                    font-size: 22px;
                    font-weight: bold;
                    color: black;
                    text-align: center;
                  "
                >
                  Hurmatli mijoz, tahlil natijangizni ko‘rish uchun tasdiqlash
                  kodi
                </h1>
                <p
                  style="
                    font-size: 16px;
                    color: #2d3436;
                    text-align: center;
                    font-weight: bold;
                  "
                >
                  Buyurtma raqami:
                </p>
                <table
                  role="presentation"
                  align="center"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                >
                  <tr>
                    <td align="center">
                      <p
                        style="
                          font-size: 20px;
                          background-color: #d4d4d4;
                          padding: 8px;
                          width: 160px;
                          text-align: center;
                          border-radius: 5px;
                          font-weight: bold;
                        "
                      >
                        ${patient.orderNumber}
                      </p>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    font-size: 16px;
                    color: #2d3436;
                    text-align: center;
                    font-weight: bold;
                  "
                >
                  Tasdiqlash kodi:
                </p>
                <table
                  role="presentation"
                  align="center"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                >
                  <tr>
                    <td align="center">
                      <p
                        style="
                          font-size: 20px;
                          background-color: #d4d4d4;
                          padding: 8px;
                          width: 160px;
                          text-align: center;
                          border-radius: 5px;
                          font-weight: bold;
                        "
                      >
                        ${verificationCode}
                      </p>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    font-size: 14px;
                    text-align: center;
                    margin-top: 20px;
                    color: #555;
                  "
                >
                  Bu xabar
                  <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    style="font-weight: 700; color: red; text-decoration: none"
                    >Hayat Med</a
                  >
                  tomonidan yuborildi.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td height="40"></td> <!-- Pastdan bo'sh joy -->
      </tr>
    </table>
  </body>
        </html>
            `,
        };

        // Email yuborish
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Xatolik yuz berdi:", error);
                return res.status(500).json({ message: "Xatolik yuz berdi!" });
            }
            return res.status(201).send({
                message:
                    "Tahlil natijasi muvaffaqiyatli yaratildi va emailga tasdiqlash kodi yuborldi!",
                result,
            });
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
};

// Tahlil natijalarini ko'rish
exports.getAnalysisResult = async (req, res) => {
    try {
        const result = await resultModel.find().populate("doctor", "uz_name");

        if (!result || result.length == 0) {
            return res.status(404).send({
                error: "Tahlil natijalari topilmadi!",
            });
        }

        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }
        return res.status(500).send("Serverda xatolik!");
    }
};

// Bitta tahlil natijasini ko'rish
exports.getOneAnalysisResult = async (req, res) => {
    try {
        const {
            params: { id },
        } = req;

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const result = await resultModel.findById(id).populate("doctor", "uz_name");

        if (!result) {
            return res.status(404).send({
                error: "Tahlil natijasi topilmadi!",
            });
        }

        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }
        return res.status(500).send("Serverda xatolik!");
    }
};

// Tahlil natijasini yangilash
exports.updateAnalysisResult = async (req, res) => {
    try {
        // Authorization headerdan tokenni olish
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(404).send({
                error: "Token not found",
            });
        }

        const token = authHeader.split(" ")[1]; // "Bearer <token>" formatidan tokenni ajratish
        if (!token) {
            return res.status(404).send({
                error: "Token not provided",
            });
        }

        const decodet = jwt.verify(token, process.env.JWT_KEY);

        const {
            params: { id },
        } = req;

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }
        const userId = decodet.id;

        const oldResult = await resultModel.findById(id);

        if (!oldResult) {
            return res.status(404).send({
                error: "Tahlil natijasi topilmadi!",
            });
        }

        if (oldResult.doctorId.toString() !== userId) {
            return res.status(403).send({
                error: "Sizga bu tahlil natijasini o'zgartirishga ruxsat yo'q!",
            });
        }

        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);

        const patient = await patientModel.findById(oldResult.patient);

        const result = {
            section: data.section || oldResult.section,
            analysisType: data.analysisType || oldResult.analysisType,
            analysisResult: data.analysisResult || oldResult.analysisResult,
            diagnosis: data.diagnosis || oldResult.diagnosis,
            recommendation: data.recommendation || oldResult.recommendation,
            createdAt: oldResult.createdAt,
            updatedAt: formattedDate,
        };

        await resultModel.findByIdAndUpdate(id, result, { new: true });

        const generateRandomCode = () =>
            Math.floor(100000 + Math.random() * 900000);

        const verificationCode = generateRandomCode();

        await patientModel.findByIdAndUpdate(
            patient.id,
            { verificationCode: verificationCode },
            { new: true }
        );

        // HTML email shabloni
        const mailOptions = {
            from: '"Hayat Med" <avazbekqalandarov03@gmail.com>',
            to: `${patient.email}`,
            subject: "Tasdiqlash kodi",
            html: `
                        <html>
            <body style="margin: 0; padding: 0; background-color: #f6f6f6">
        <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="background-color: #f6f6f6; width: 100%; text-align: center"
        >
        <tr>
            <td height="40"></td> <!-- Tepadan bo'sh joy -->
        </tr>
        <tr>
            <td align="center">
            <table
                role="presentation"
                width="450"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                background-color: #ffffff;
                max-width: 450px;
                width: 100%;
                padding: 30px;
                text-align: left;
                font-family: Arial, sans-serif;
                border-radius: 10px;
                box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
                "
            >
                <tr>
                <td align="center" style="padding-bottom: 15px">
                    <img
                    src=" https://axhokgpxtritakejsqch.supabase.co/storage/v1/object/public/Images//logo.png"
                    alt="Logo"
                    width="180"
                    style="display: block"
                    />
                </td>
                </tr>
                <tr>
                <td style="padding: 5px 15px">
                    <h1
                    style="
                        font-size: 22px;
                        font-weight: bold;
                        color: black;
                        text-align: center;
                    "
                    >
                    Hurmatli mijoz, tahlil natijangiz yangilandi! Tahlil natijasini ko‘rish uchun tasdiqlash
                    kodi
                    </h1>
                    <p
                    style="
                        font-size: 16px;
                        color: #2d3436;
                        text-align: center;
                        font-weight: bold;
                    "
                    >
                    Buyurtma raqami:
                    </p>
                    <table
                    role="presentation"
                    align="center"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    width="100%"
                    >
                    <tr>
                        <td align="center">
                        <p
                            style="
                            font-size: 20px;
                            background-color: #d4d4d4;
                            padding: 8px;
                            width: 160px;
                            text-align: center;
                            border-radius: 5px;
                            font-weight: bold;
                            "
                        >
                            ${patient.orderNumber}
                        </p>
                        </td>
                    </tr>
                    </table>

                    <p
                    style="
                        font-size: 16px;
                        color: #2d3436;
                        text-align: center;
                        font-weight: bold;
                    "
                    >
                    Tasdiqlash kodi:
                    </p>
                    <table
                    role="presentation"
                    align="center"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    width="100%"
                    >
                    <tr>
                        <td align="center">
                        <p
                            style="
                            font-size: 20px;
                            background-color: #d4d4d4;
                            padding: 8px;
                            width: 160px;
                            text-align: center;
                            border-radius: 5px;
                            font-weight: bold;
                            "
                        >
                            ${verificationCode}
                        </p>
                        </td>
                    </tr>
                    </table>

                    <p
                    style="
                        font-size: 14px;
                        text-align: center;
                        margin-top: 20px;
                        color: #555;
                    "
                    >
                    Bu xabar
                    <a
                        href="https://www.youtube.com/"
                        target="_blank"
                        style="font-weight: 700; color: red; text-decoration: none"
                        >Hayat Med</a
                    >
                    tomonidan yuborildi.
                    </p>
                </td>
                </tr>
            </table>
            </td>
        </tr>
        <tr>
            <td height="40"></td> <!-- Pastdan bo'sh joy -->
        </tr>
        </table>
    </body>
                </html>
                    `,
        };

        // Email yuborish
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Xatolik yuz berdi:", error);
                return res.status(500).json({ message: "Xatolik yuz berdi!" });
            }
            return res.status(201).send({
                message:
                    "Tahlil natijasi muvaffaqiyatli yangilandi va emailga tasdiqlash kodi yuborldi!",
                result,
            });
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
};

// Tahlil natijasini o'chirish
exports.deleteAnalysisResult = async (req, res) => {
    try {
        const {
            params: { id },
        } = req;

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const result = await resultModel.findById(id);

        if (!result) {
            res.status(404).send({
                error: "Tahlil natijasi topilmadi!",
            });
        }

        await patientModel.findByIdAndUpdate(result.patient._id, {
            $pull: { analysisResults: result.id },
        });

        await resultModel.findByIdAndDelete(id);

        return res.status(200).send("Tahlil natijasi muvaffaqiyatli o'chirildi!");
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }

        return res.status(500).send("Serverda xatolik!");
    }
};

// Tahlil natijasini qidirish
exports.searchAnalysisResult = async (req, res) => {
    try {
        const key = req.params.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(key, "i");
        const data = await resultModel.find({
            $or: [{ analysisType: { $regex: regex } }],
        });

        if (data.length == 0) {
            return res.status(404).send({
                error: "Tahlil natijasi topilmadi!",
            });
        }

        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }

        return res.status(500).send("Serverda xatolik!");
    }
};
