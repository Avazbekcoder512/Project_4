const { validationResult, matchedData } = require('express-validator');
const { sectionModel } = require('../models/sectionModel');
const { analysisModel } = require('../models/analysisModel')

// Bo'lim yaratish
exports.createSection = async (req, res) => {
    try {
        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);

        const section = await sectionModel.create({
            uz_name: data.uz_name,
            ru_name: data.ru_name,
            en_name: data.en_name,

            uz_description: data.uz_description,
            ru_description: data.ru_description,
            en_description: data.en_description,

            analysis: []
        })

        return res.status(201).send({
            message: "Bo'lim muvaffaqiyatli yaratildi!",
            section
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

// Hamma bo'limlarni ko'rish
exports.getSection = async (req, res) => {
    try {
        const sections = await sectionModel.find().populate("analysis")

        if (!sections) {
            return res.status(404).send({
                error: "Bo'lim topilmadi!"
            })
        }

        return res.status(200).send({
            message: "Bo'limlar ro'yhati!",
            sections
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

// Bitta bo'limni olish
exports.getOneSection = async (req, res) => {
    try {
        const { params: { id } } = req

        // ID ni tekshirish
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const section = await sectionModel.findById(id).populate('analysis')

        if (!section) {
            return res.status(404).send({
                error: "Bo'lim topilmadi!"
            })
        }

        return res.status(200).send({
            section
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

// Bo'limni yangilash
exports.updateSection = async (req, res) => {
    try {
        const { params: { id } } = req

        // ID ni tekshirish
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const oldSection = await sectionModel.findById(id)

        if (!oldSection) {
            return res.status(404).send({
                error: "Section topilmadi!"
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

        const section = {
            uz_name: data.uz_name || oldSection.uz_name,
            ru_name: data.ru_name || oldSection.ru_name,
            en_name: data.en_name || oldSection.en_name,

            uz_description: data.uz_description || oldSection.uz_description,
            ru_description: data.ru_description || oldSection.ru_description,
            en_description: data.en_description || oldSection.en_description
        }

        await sectionModel.findByIdAndUpdate(id, section)

        return res.status(201).send({
            message: "Bo'lim muvaffaqiyatli yangilandi!",
            section
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

// Bo'limni o'chirish
exports.deleteSection = async (req, res) => {
    try {
        const { params: { id } } = req

        // ID ni tekshirish
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const section = await sectionModel.findById(id)

        if (!section) {
            return res.status(404).send({
                error: "Bo'lim topilmadi!"
            })
        }

        await analysisModel.deleteMany({ section: id })

        await sectionModel.findByIdAndDelete(id)

        return res.status(200).send({
            message: "Bo'lim muvaffaqiyatli o'chirildi!"
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

// Bo'limni qidirish
exports.searchSection = async (req, res) => {
    try {
        const key = req.params.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
        const regex = new RegExp(key, 'i');
        const data = await sectionModel.find({
            $or: [
                { uz_name: { $regex: regex } }
            ]
        }).populate('analysis')

        if (data.length == 0) {
            return res.status(404).send({
                message: "Bo'lim mavjud emas!"
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