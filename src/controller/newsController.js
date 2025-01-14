require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const { newsModel } = require("../models/newsModel")
const { validationResult, matchedData } = require('express-validator')

// Supabase clientni sozlash
const supabase = createClient(
    process.env.Supabase_URL,
    process.env.Supabase_KEY
)

// Yangilik yaratish
exports.createNews = async (req, res) => {
    try {
        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);

        if (!req.file) {
            return res.status(400).send({
                error: "Iltimos, rasm faylni yuklang!"
            })
        }

        const { buffer, originalname } = req.file;
        const fileName = `news/${Date.now()}-${originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('Images')
            .upload(fileName, buffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: req.file.mimetype,
            });

        const fileUrl = `${supabase.storageUrl}/object/public/Images/${fileName}`;

        const news = await newsModel.create({
            uz_title: data.uz_title,
            ru_title: data.ru_title,
            en_title: data.en_title,

            uz_description: data.uz_description,
            ru_description: data.ru_description,
            en_description: data.en_description,
            image: fileUrl
        })

        return res.status(200).send({
            message: "Yangilik muvaffaqiyatli yaratildi!",
            news
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

// Hamma yangiliklarni olish
exports.getAllNews = async (req, res) => {
    try {
        const news = await newsModel.find()

        if (!news.length) {
            return res.status(404).send({
                error: "Yangiliklar mavjud emas!"
            })
        }

        return res.status(200).send({
            message: "Yangiliklar jadvali!",
            news
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

// Bitta yangilini ko'rish
exports.getOneNews = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const news = await newsModel.findById(id)

        if (!news) {
            return res.status(404).send({
                error: "Yangilik topilmadi!"
            })
        }

        return res.status(200).send({
            message: "Yangilik!",
            news
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

// Yangilik ma'lumotlarini yangilash
exports.updateNews = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const news = await newsModel.findById(id)

        if (!news) {
            return res.status(404).send({
                error: "Yangilik topilmadi!"
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

        let fileUrl = news.image

        if (req.file) {
            try {
                if (fileUrl) {
                    const filePath = fileUrl.replace(`${supabase.storageUrl}/object/public/Images/`, '');

                    const { data: fileExists, error: checkError } = await supabase.storage
                        .from('Images')
                        .list('', { prefix: filePath });

                    if (checkError) {
                        console.error(`Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`);
                    } else if (fileExists && fileExists.length > 0) {
                        // Faylni o'chirish
                        const { error: deleteError } = await supabase.storage
                            .from('Images')
                            .remove([filePath]);

                        if (deleteError) {
                            throw new Error(`Faylni o'chirishda xatolik: ${deleteError.message}`);
                        }
                    }
                }

                const { buffer, originalname } = req.file
                const fileName = `news/${Date.now()}-${originalname}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('Images')
                    .upload(fileName, buffer, {
                        cacheControl: '3600',
                        upsert: true,
                        contentType: req.file.mimetype
                    });

                if (uploadError) {
                    throw new Error(`Fayl yuklanmadi: ${uploadError.message}`)
                }
                fileUrl = `${supabase.storageUrl}/object/public/Images/${fileName}`;
            } catch (error) {
                console.error(`Faylni yangilashda xatolik: ${error.message}`);
                throw new Error("Yangi faylni yuklash yoki eski faylni o'chirishda muammo!");
            }
        }

        const updatedNews = {
            uz_title: data.uz_title || news.uz_title,
            ru_title: data.ru_title || news.ru_title,
            en_title: data.en_title || news.en_title,

            uz_description: data.uz_description || news.uz_description,
            ru_description: data.ru_description || news.ru_description,
            en_description: data.en_description || news.en_description,
            image: fileUrl || news.image
        }

        await newsModel.findByIdAndUpdate(id, updatedNews)

        return res.status(200).send({
            message: "Yangilik ma'lumotlari muvaffaqiyatli yangilandi!",
            updatedNews
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

// Yangilini o'chirish
exports.deleteNews = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const news = await newsModel.findById(id)

        if (!news) {
            return res.status(404).send({
                error: "Yangilik topilmadi!"
            })
        }

        console.log(news);
        

        const fileUrl = news.image

        if (fileUrl) {
            const filePath = fileUrl.replace(`${supabase.storageUrl}/object/public/Images/`, '');

            const { data: fileExists, error: checkError } = await supabase.storage
            .from('Images')
            .list('', { prefix: filePath });

            if (checkError) {
                console.error(`Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`);
            } else if (fileExists && fileExists.length > 0) {
                // Faylni o'chirish
                const { error: deleteError } = await supabase.storage
                .from('Images')
                .remove([filePath]);

                if (deleteError) {
                    throw new Error(`Faylni o'chirishda xatolik: ${deleteError}`)
                }
            }
        }

        await newsModel.findByIdAndDelete(id)

        return res.status(200).send({
            message: "Yangilik muvaffaqiyatli o'chirildi!"
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

exports.searchNews = async (req, res) => {
    try {
        const data = await newsModel.find({
            $or: [
                { uz_title: { $regex: req.params.key } }
            ]
        })

        if (data.length == 0) {
            return res.status(404).send({
                message: 'Yangilik majud emas!'
            })
        }

        return res.send(data)
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