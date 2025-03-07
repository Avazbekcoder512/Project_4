const { fromBuffer } = require('file-type')

exports.createAdminSchema = {
    name: {
        isString: {
            errorMessage: "Ism string bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Ism talab qilinadi"
        }
    },
    username: {
        isString: {
            errorMessage: "Foydalanuvchi nomi string bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Foydalanuvchi talab qilinadi"
        },
        trim: {
            errorMessage: "Foydalanuvchi nomining orasida ochiq joy bo'lishi mumkin emas"
        }
    },
    password: {
        isString: {
            errorMessage: "Pareol string bo'lishi kerak"
        },
        isLength: {
            options: { min: 8 },
            errorMessage: "Parol kamida 8 ta belgidan iborat bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Parol talab qilinadi"
        },
        trim: {
            errorMessage: "Parol orasida ochiq joy bo'lishi mumkin emas"
        }
    },
    gender: {
        isString: {
            errorMessage: "Gender string bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Gender talab qilinadi"
        }
    },

    role: { isString: { errorMessage: "Role string bo'lishi kerak!" }, notEmpty: { errorMessage: "Role talab qilinadi!" } },
    email: { isEmail: { errorMessage: "Elektron pochta manzili yaroqsiz!" }, notEmpty: { errorMessage: "Elektron pochta manzili talab qilinadi!" } },

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