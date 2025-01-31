const { fromBuffer } = require("file-type");

exports.createStaffSchema = {
    uz_name: { isString: { errorMessage: "Ism string bo'lishi kerak!" }, notEmpty: { errorMessage: "Ism talab qilinadi!" } },
    ru_name: { isString: { errorMessage: "Ism string bo'lishi kerak!" }, notEmpty: { errorMessage: "Ism talab qilinadi!" } },
    en_name: { isString: { errorMessage: "Ism string bo'lishi kerak!" }, notEmpty: { errorMessage: "Ism talab qilinadi!" } },

    username: { isString: { errorMessage: "Foydalanuvchi nomi string bo'lishi kerak!" }, trim: { errorMessage: "Foydalanuvchi nomining orasida ochiq joy bo'lishi mumkin emas!" } },

    password: { isString: { errorMessage: "Parol string bo'lishi kerak!" }, trim: { errorMessage: "Parol orasida ochiq joy bo'lishi mumkin emas!" }, isLength: { options: { min: 8 }, errorMessage: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" } },

    uz_position: { isString: { errorMessage: "Lavozim string bo'lishi kerak!" }, notEmpty: { errorMessage: "Lavozim talab qilinadi!" }, },
    ru_position: { isString: { errorMessage: "Lavozim string bo'lishi kerak!" }, notEmpty: { errorMessage: "Lavozim talab qilinadi!" }, },
    en_position: { isString: { errorMessage: "Lavozim string bo'lishi kerak!" }, notEmpty: { errorMessage: "Lavozim talab qilinadi!" }, },

    uz_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    ru_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    en_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    role: { isString: { errorMessage: "Role string bo'lishi kerak!" }, notEmpty: { errorMessage: "role talab qilinadi!" } },

    gender: { isString: { errorMessage: "Gender string bo'lishi kerak" }, notEmpty: { errorMessage: 'Gender talab qilinadi!' } },

    image: {
        custom: {
            options: async (value, { req }) => {
                const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg', 'image/webp'];
                if (req.file) {
                    const fileType = await fromBuffer(req.file.buffer)

                    if (!fileType || !validMimeTypes.includes(fileType.mime)) {
                        throw new Error('Image must be only JPEG, JPG, PNG, SVG, WEBP format!');
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

    uz_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    ru_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    en_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    role: { isString: { errorMessage: "Role string bo'lishi kerak!" } },

    gender: { isString: { errorMessage: "Gender string bo'lishi kerak" } },

    image: {
        custom: {
            options: async (value, { req }) => {
                const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg', 'image/webp'];
                if (req.file) {
                    const fileType = await fromBuffer(req.file.buffer)

                    if (!fileType || !validMimeTypes.includes(fileType.mime)) {
                        throw new Error('Image must be only JPEG, JPG, PNG, SVG, WEBP format!');
                    }
                }
                return true;
            },
        },
    }
}