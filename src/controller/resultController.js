const { patientModel } = require("../models/patientModel");
const PDFDocument = require('pdfkit')
const path = require('path')
const fs = require('fs')


// Bemorga tahlil natijasini ko'rsatish
exports.getResult = async (req, res) => {
    try {
        const orderNumber = Number(req.query.orderNumber);
        const verificationCode = req.query.verificationCode

        if (isNaN(orderNumber)) {
            return res.status(400).send({
                error: "Tartib raqamni sonda kiriting!"
            });
        }

        if (!orderNumber || !verificationCode) {
            return res.status(400).send({
                error: "Iltimos, buyurtma raqami va tekshirish kodini kiriting!"
            })
        }

        const result = await patientModel.findOne({
            orderNumber: orderNumber,
            verificationCode: verificationCode
        }).populate("analysisResults")

        if (!result) {
            return res.status(404).send({
                error: "Kiritilgan buyurtma raqami yoki tekshirish kodi noto'g'ri!",
            });
        }

        return res.status(200).send({
            message: "Tahlil natijasi!",
            result: result,
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

exports.downloadResult = async (req, res) => {
    try {
        const orderNumber = Number(req.query.orderNumber);
        const verificationCode = req.query.verificationCode

        if (isNaN(orderNumber)) {
            return res.status(400).send({
                error: "Tartib raqamni sonda kiriting!"
            });
        }

        if (!orderNumber || !verificationCode) {
            return res.status(400).send({ error: "Iltimos, buyurtma raqami va tekshirish kodini kiriting!" })
        }

        const result = await patientModel.findOne({
            orderNumber: orderNumber,
            verificationCode: verificationCode
        }).populate("analysisResults");

        if (!result) {
            return res.status(404).send({ error: "Kiritilgan buyurtma raqami yoki tekshirish kodi noto'g'ri!" });
        }

        const doc = new PDFDocument();
        const fileName = 'tahlil_natijasi.pdf'

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename: ${fileName}`)

        doc.pipe(res)

        const imagePath = path.join(__dirname, "../public/images/logo.png");

        // Har bir yangi sahifani yaratish uchun umumiy funksiya
        const createPage = () => {
            const imageHeight = 50; // Rasm balandligi
            const imageWidth = 150; // Rasm kengligi
            const marginTop = 10; // Yuqori chet bo'shligi

            // Sahifaning yuqorisiga rasm joylash
            doc.image(imagePath, doc.page.width / 2 - imageWidth / 2, marginTop, {
                width: imageWidth,
                height: imageHeight,
            });

            // Rasm ostidan kontent boshlash
            doc.moveDown(2); // 2 qator pastga
        };

        // Birinchi sahifani yaratish
        createPage();

        doc.fillColor("#004080").fontSize(20).text('Tahlil Natijasi', { align: "center" })

        doc.fillColor("#000000").fontSize(16).text(`\nF.I.SH: ${result.name}`, { align: 'left' });
        doc.text(`Tug'ilgan sana: ${result.date_of_birth}`);
        doc.text(`Jinsi: ${result.gender}`);
        doc.moveDown()

        doc.fillColor("#004080").fontSize(18).text('Tahlillar:', { align: 'center' })

        const fontPath = path.join(__dirname, '../public/fonts/Roboto-VariableFont_wdth,wght.ttf');

        const pageHeight = doc.page.height;
        const usableHeight = pageHeight - 80; // Rasmni e'tiborga olib, foydalaniladigan balandlik
        let yPosition = doc.y; // Hozirgi vertikal pozitsiya

        result.analysisResults.forEach(analysis => {
            const textHeight = 140; // Har bir tahlil uchun taxminiy balandlik

            // Agar matn sahifaga sig‘masa, yangi sahifa qo‘shish
            if (yPosition + textHeight > usableHeight) {
                doc.addPage();
                yPosition = doc.y; // Yangi sahifa boshlanishi
            }

            doc.fillColor("#000000").font(fontPath).fontSize(16).text(`\nBo'lim: ${analysis.section}`);
            doc.text(`Tahlil: ${analysis.analysisType}`);
            doc.text(`Natija: ${analysis.analysisResult}`);
            doc.text(`Tashxis: ${analysis.diagnosis}`);
            doc.text(`Maslahat: ${analysis.recommendation}`);
            doc.text(`Shifokor: ${analysis.doctor}`);
            doc.text(`Lavozimi: ${analysis.doctorPosition}`);
            doc.text(`Shifokorning telefon raqami: ${analysis.doctorPhone}`);
            doc.text(`Tahlil sanasi: ${analysis.createdAt}`);
            
            doc.moveDown();

            // Chiziq chizish
            doc.moveTo(50, doc.y) // Chiziq boshlanish nuqtasi
                .lineTo(doc.page.width - 50, doc.y) // Chiziq tugash nuqtasi
                .stroke("#000000"); // Qora rangda chiziq chizish

            doc.moveDown()
            yPosition = doc.y;
        })

        doc.end()

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