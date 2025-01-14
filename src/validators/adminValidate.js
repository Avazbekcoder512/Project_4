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

    email: { isEmail: { errorMessage: "Elektron pochta manzili yaroqsiz!" }, notEmpty: { errorMessage: "Elektron pochta manzili talab qilinadi!" } },
}