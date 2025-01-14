exports.createStaffSchema = {
    uz_name: { isString: { errorMessage: "Ism string bo'lishi kerak!" }, notEmpty: { errorMessage: "Ism talab qilinadi!" } },
    ru_name: { isString: { errorMessage: "Ism string bo'lishi kerak!" }, notEmpty: { errorMessage: "Ism talab qilinadi!" } },
    en_name: { isString: { errorMessage: "Ism string bo'lishi kerak!" }, notEmpty: { errorMessage: "Ism talab qilinadi!" } },

    username: { isString: { errorMessage: "Foydalanuvchi nomi string bo'lishi kerak!" }, trim: { errorMessage: "Foydalanuvchi nomining orasida ochiq joy bo'lishi mumkin emas!" } },

    password: { isString: { errorMessage: "Parol string bo'lishi kerak!" }, trim: { errorMessage: "Parol orasida ochiq joy bo'lishi mumkin emas!" } },

    uz_position: { isString: { errorMessage: "Lavozim string bo'lishi kerak!" }, notEmpty: { errorMessage: "Lavozim talab qilinadi!" }, },
    ru_position: { isString: { errorMessage: "Lavozim string bo'lishi kerak!" }, notEmpty: { errorMessage: "Lavozim talab qilinadi!" }, },
    en_position: { isString: { errorMessage: "Lavozim string bo'lishi kerak!" }, notEmpty: { errorMessage: "Lavozim talab qilinadi!" }, },

    uz_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    ru_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    en_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    image: {
        custom: {
            options: (value, { req }) => {
                const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (req.file) {
                    if (!validMimeTypes.includes(req.file.mimetype)) {
                        throw new Error('Image must be only JPEG, PNG, GIF, WEBP format!');
                    }
                }
                return true;
            },
        },
    }
}

exports.updateStaffSchema = {
    uz_name: { isString: { errorMessage: "Ism string bo'lishi kerak!" } },
    ru_name: { isString: { errorMessage: "Ism string bo'lishi kerak!" } },
    en_name: { isString: { errorMessage: "Ism string bo'lishi kerak!" } },

    uz_position: { isString: { errorMessage: "Lavozim string bo'lishi kerak!" } },
    ru_position: { isString: { errorMessage: "Lavozim string bo'lishi kerak!" } },
    en_position: { isString: { errorMessage: "Lavozim string bo'lishi kerak!" } },

    username: { isString: { errorMessage: "Foydalanuvchi nomi string bo'lishi kerak!" }, trim: { errorMessage: "Foydalanuvchi nomining orasida ochiq joy bo'lishi mumkin emas!" } },

    password: { isString: { errorMessage: "Parol string bo'lishi kerak!" }, trim: { errorMessage: "Parol orasida ochiq joy bo'lishi mumkin emas!" } },

    uz_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    ru_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    en_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    image: {
        custom: {
            options: (value, { req }) => {
                const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (req.file) {
                    if (!validMimeTypes.includes(req.file.mimetype)) {
                        throw new Error('Image must be only JPEG, PNG, GIF, WEBP format!');
                    }
                }
                return true;
            },
        },
    }
}