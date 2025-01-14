const { validationResult, matchedData } = require('express-validator');
const { analysisModel } = require('../models/analysisModel');
const { sectionModel } = require('../models/sectionModel');

// Tahlil yaratish
exports.createAnalysis = async (req, res) => {
    try {
        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);

        const newAnalysis = await analysisModel.create({
            section: data.section,
            name: data.name,
            price: data.price
        })

        await sectionModel.findByIdAndUpdate(data.section, {
            $push: { analysis: newAnalysis.id }
        })

        return res.status(201).send({
            message: "Tahlil muvaffaqiyatli yaratildi!",
            newAnalysis
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

// Tahlillarni ko'rish
exports.getAnalysis = async (req, res) => {
    try {
        const analysis = await analysisModel.find()

        if (!analysis) {
            return res.status(404).send({
                error: "Tahlillar topilmadi yoki mavjud emas!"
            })
        }

        return res.status(200).send({
            message: "Tahlillar ro'yhati!",
            analysis
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

// Bitta tahlilni olish
exports.getOneAnalysis = async (req, res) => {
    try {
        const { params: { id } } = req

        // ID ni tekshirish
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const analysis = await analysisModel.findById(id)

        if (!analysis) {
            return res.status(404).send({
                error: 'Talil topilmadi!'
            })
        }

        return res.status(200).send({
            analysis
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

// Tahlilni yangilash
exports.updateAnalysis = async (req, res) => {
    try {
        const { params: { id } } = req

        // ID ni tekshirish
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const oldAnalysis = await analysisModel.findById(id)

        if (!oldAnalysis) {
            return res.status(404).send({
                error: "Tahlil topilmadi!"
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

        const analysis = {
            name: data.name || oldAnalysis.name,
            price: data.price || oldAnalysis.price
        }

        await analysisModel.findByIdAndUpdate(id, analysis)

        return res.status(201).send({
            message: "Tahli muvaffaqiyatli yangilandi!",
            analysis
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

// Tahlilni o'chirish
exports.deleteAnalysis = async (req, res) => {
    try {
        const { params: { id } } = req

        // ID ni tekshirish
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const analysis = await analysisModel.findById(id)

        if (!analysis) {
            return res.status(404).send({
                error: "Tahlil topilmadi!"
            })
        }

        await sectionModel.findByIdAndUpdate(analysis.section._id, {
            $pull: { analysis: analysis.id }
        })

        await analysisModel.findByIdAndDelete(id)

        return res.status(200).send({
            message: "Tahlil muvaffaqiyatli o'chirildi!"
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

// Tahlilni qidirish
exports.searchAnalysis = async (req, res) => {
    try {
        // req.params.key ni xavfsiz qilish uchun maxsus belgilarni qochirish
        const key = req.params.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
        const regex = new RegExp(key, 'i'); // 'i' flag bilan katta-kichik harfga sezgir emas bo'ladi

        const data = await analysisModel.find({
            $or: [
                { name: { $regex: regex } }
            ]
        });

        if (data.length === 0) {
            return res.status(404).send({
                error: "Tahlil topilmadi!"
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
