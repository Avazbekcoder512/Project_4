require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const { staffModel } = require('../models/staffModel')
const { validationResult, matchedData } = require('express-validator')
const bcrypt = require('bcrypt')

// Supabase clientni sozlash
const supabase = createClient(
    process.env.Supabase_URL,
    process.env.Supabase_KEY
)

// Xodim yaratish
exports.createStaff = async (req, res) => {
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

        // Rasm hajmini tekshirish (maksimal 2 MB)
        const maxFileSize = 2 * 1024 * 1024; // 2 MB
        if (req.file.size > maxFileSize) {
            return res.status(400).send({
                error: "Rasm hajmi 2 MB dan oshmasligi kerak!",
            });
        }

        const { buffer, originalname } = req.file;
        const fileName = `staff/${Date.now()}-${originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("Images")
            .upload(fileName, buffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: req.file.mimetype,
            });

        if (uploadError) {
            throw new Error(`Fayl yuklanmadi: ${uploadError.message}`);
        }

        const fileUrl = `${supabase.storageUrl}/object/public/Images/${fileName}`;

        if (data.password.length < 8) {
            return res.status(400).send({
                error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!"
            })
        }

        // Parolni hashlash
        const passwordHash = await bcrypt.hash(data.password, 10)
        delete data.password

        const staff = await staffModel.create({
            uz_name: data.uz_name,
            ru_name: data.ru_name,
            en_name: data.en_name,

            username: data.username,
            password: passwordHash,
            role: data.role,

            uz_position: data.uz_position,
            ru_position: data.ru_position,
            en_position: data.en_position,

            uz_description: data.uz_description,
            ru_description: data.ru_description,
            en_description: data.en_description,
            image: fileUrl
        })

        return res.status(200).send({
            message: "Xodim muvaffaqiyatli yaratildi!",
            staff
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

// Barcha xodimlarni ko'rish
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await staffModel.find()

        if (!staff.length) {
            return res.status(404).send({
                error: "Xodimlar mavjud emas!"
            })
        }

        return res.status(200).send({
            message: "Xodimlar jadvali!",
            staff
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

// Bitta xodimni olish
exports.getOneStaff = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const staff = await staffModel.findById(id)

        if (!staff) {
            return res.status(404).send({
                error: "Xodim topilmadi!"
            })
        }

        return res.status(200).send({
            message: "Xodim!",
            staff
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

// Xodim ma'lumotlarini yangilash
exports.updateStaff = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const staff = await staffModel.findById(id)

        if (!staff) {
            return res.status(404).send({
                error: "Xodim topilmadi!"
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

        let fileUrl = staff.image

        if (req.file) {
            try {
                // Rasm hajmini tekshirish (maksimal 2 MB)
                const maxFileSize = 2 * 1024 * 1024; // 2 MB
                if (req.file.size > maxFileSize) {
                    return res.status(400).send({
                        error: "Rasm hajmi 2 MB dan oshmasligi kerak!",
                    });
                }

                if (fileUrl) {
                    const filePath = fileUrl.replace(`${supabase.storageUrl}/object/public/Images/`, '');

                    const { data: fileExists, error: checkError } = await supabase.storage
                        .from('Images')
                        .list('', { prefix: filePath });

                    if (checkError) {
                        console.error(`Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`);
                    } else if (fileExists && fileExists.length > 0) {
                        // Faylni o‘chirish
                        const { error: deleteError } = await supabase
                            .storage
                            .from('Images')
                            .remove([filePath]);

                        if (deleteError) {
                            throw new Error(`Faylni o'chirishda xatolik: ${deleteError.message}`);
                        }
                    }
                }

                const { buffer, originalname } = req.file
                const fileName = `staff/${Date.now()}-${originalname}`;
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('Images')
                    .upload(fileName, buffer, {
                        cacheControl: '3600',
                        upsert: true,
                        contentType: req.file.mimetype,
                    });

                if (uploadError) {
                    throw new Error(`Fayl yuklanmadi: ${uploadError.message}`);
                }
                fileUrl = `${supabase.storageUrl}/object/public/Images/${fileName}`;
            } catch (err) {
                console.error(`Faylni yangilashda xatolik: ${err.message}`);
                throw new Error("Yangi faylni yuklash yoki eski faylni o‘chirishda muammo!");
            }
        }

        // Parolni hashlash
        const passwordHash = await bcrypt.hash(data.password, 10)
        delete data.password

        const updatedStaff = {
            uz_name: data.uz_name || staff.uz_name,
            ru_name: data.ru_name || staff.ru_name,
            en_name: data.en_name || staff.en_name,

            username: data.username || staff.username,
            role: data.role || staff.role,

            uz_position: data.uz_position || staff.uz_position,
            ru_position: data.ru_position || staff.ru_position,
            en_position: data.en_position || staff.en_position,

            uz_description: data.uz_description || staff.uz_description,
            ru_description: data.ru_description || staff.ru_description,
            en_description: data.en_description || staff.en_description,
            image: fileUrl || staff.image
        }

        await staffModel.findByIdAndUpdate(id, updatedStaff)

        return res.status(200).send({
            message: "Xodim ma'lumotlari muvaffaqiyatli yangilandi!",
            staff
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

// Xodimning parolini yangilash
exports.updateStaffPassword = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const staff = await staffModel.findById(id)

        if (!staff) {
            return res.status(404).send({
                error: "Xodim topilmadi!"
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

        // Parolni hashlash
        const passwordHash = await bcrypt.hash(data.password, 10)
        delete data.password

        const updatePassword = {
            password: passwordHash
        }

        await staffModel.findByIdAndUpdate(id, updatePassword, { new: true })

        return res.status(201).send({
            message: 'Parol muvaffaqiyatli yangilandi!'
        })
    } catch (error) {
        console.log(error);
        if (error.message) {
            return res.status(400).send({
                error: error.message
            })
        }
        return res.status(500).send('Serverda xatolik!')
    }
}

// Xodimni o'chirish
exports.deleteStaff = async (req, res) => {
    try {
        const { params: { id } } = req

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!"
            })
        }

        const staff = await staffModel.findById(id)

        if (!staff) {
            return res.status(404).send({
                error: "Xodim topilmadi!"
            })
        }

        const fileUrl = staff.image

        if (fileUrl) {
            const filePath = fileUrl.replace(`${supabase.storageUrl}/object/public/Images/`, '');

            const { data: fileExists, error: checkError } = await supabase.storage
                .from('Images')
                .list('', { prefix: filePath });

            if (checkError) {
                console.error(`Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`);
            } else if (fileExists && fileExists.length > 0) {
                // Faylni o‘chirish
                const { error: deleteError } = await supabase
                    .storage
                    .from('Images')
                    .remove([filePath]);

                if (deleteError) {
                    throw new Error(`Faylni o'chirishda xatolik: ${deleteError.message}`);
                }
            }
        }

        await staffModel.findByIdAndDelete(id)

        return res.status(200).send({
            message: "Xodim muvaffaqiyatli o'chirildi!"
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

exports.searchStaff = async (req, res) => {
    try {
        const data = await staffModel.find(
            {
                "$or": [
                    { uz_name: { $regex: req.params.key } },
                    { ru_name: { $regex: req.params.key } },
                    { en_name: { $regex: req.params.key } },
                    { uz_position: { $regex: req.params.key } },
                    { ru_position: { $regex: req.params.key } },
                    { en_position: { $regex: req.params.key } }
                ]
            }
        )

        if (data.length == 0) {
            return res.status(404).send({
                message: "Xodim mavjud emas!"
            })
        }

        return res.status(200).send({
            staff: data
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