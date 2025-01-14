const { validationResult, matchedData } = require('express-validator')
const { serviceModel } = require('../models/serviceModel')

// Yangi xizmat yaratish
exports.createService = async (req, res) => {
    try {
        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);

        const service = await serviceModel.create({
            uz_name: data.uz_name,
            ru_name: data.ru_name,
            en_name: data.en_name,

            uz_title: data.uz_title,
            ru_title: data.ru_title,
            en_title: data.en_title,

            uz_description: data.uz_description,
            ru_description: data.ru_description,
            en_description: data.en_description
        })

        return res.status(200).send({
            message: "Yangi xizmat muvaffaqiyatli yaratildi!",
            service
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

// Barcha xizmatlarni ko'rish
exports.getAllServices = async (req, res) => {
    try {
        const services = await serviceModel.find()

        if (!services.length) {
            return res.status(404).send({
                error: "Xizmatlar mavjud emas!"
            })
        }

        return res.status(200).send({
            message: "Xizmatlar jadvali!",
            services
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

// Bitta xizmatni ko'rish
exports.getOneService = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const service = await serviceModel.findById(id)

        if (!service) {
            return res.status(404).send({
                error: "Xizmat topilmadi!"
            })
        }

        return res.status(200).send({
            message: "Xizmat!",
            service
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

// Xizmat ma'lumotlarini yangilash
exports.updateService = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const service = await serviceModel.findById(id)

        if (!service) {
            return res.status(404).send({
                error: "Xizmat topilmadi!"
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

        const updatedService = {
            uz_name: data.uz_name || service.uz_name,
            ru_name: data.ru_name || service.ru_name,
            en_name: data.en_name || service.en_name,

            uz_title: data.uz_title || service.uz_title,
            ru_title: data.ru_title || service.ru_title,
            en_title: data.en_title || service.en_title,

            uz_description: data.uz_description || service.uz_description,
            ru_description: data.ru_description || service.ru_description,
            en_description: data.en_description || service.en_description
        }

        await serviceModel.findByIdAndUpdate(id, updatedService)

        return res.status(200).send({
            message: "Xizmat ma'lumotlari muvaffaqiyatli yangilandi!",
            updatedService
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

// Xizmatni o'shirish
exports.deleteService = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const service = await serviceModel.findById(id)

        if (!service) {
            return res.status(404).send({
                error: "Xizmat topilmadi!"
            })
        }

        await serviceModel.findByIdAndDelete(id)

        return res.status(200).send({
            message: "Xizmat muvaffaqiyatli o'chirildi!"
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