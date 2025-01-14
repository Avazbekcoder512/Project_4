exports.createServiceSchema = {
    uz_name: { isString: { errorMessage: "Xizmat nomi string bo'lishi kerak!" }, notEmpty: { errorMessage: "Xizmat nomi talab qilinadi!" } },
    ru_name: { isString: { errorMessage: "Xizmat nomi string bo'lishi kerak!" }, notEmpty: { errorMessage: "Xizmat nomi talab qilinadi!" } },
    en_name: { isString: { errorMessage: "Xizmat nomi string bo'lishi kerak!" }, notEmpty: { errorMessage: "Xizmat nomi talab qilinadi!" } },

    uz_title: { isString: { errorMessage: "Sarlavha string bo'lishi kerak!" }, notEmpty: { errorMessage: "Sarlavha talab qilinadi!" } },
    ru_title: { isString: { errorMessage: "Sarlavha string bo'lishi kerak!" }, notEmpty: { errorMessage: "Sarlavha talab qilinadi!" } },
    en_title: { isString: { errorMessage: "Sarlavha string bo'lishi kerak!" }, notEmpty: { errorMessage: "Sarlavha talab qilinadi!" } },

    uz_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" }, isLength: { options: { min: 25, max: 250 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    ru_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" }, isLength: { options: { min: 25, max: 250 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    en_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" }, isLength: { options: { min: 25, max: 250 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, }
}

exports.updateServiceSchema = {
    uz_name: { isString: { errorMessage: "Xizmat nomi string bo'lishi kerak!" } },
    ru_name: { isString: { errorMessage: "Xizmat nomi string bo'lishi kerak!" } },
    en_name: { isString: { errorMessage: "Xizmat nomi string bo'lishi kerak!" } },

    uz_title: { isString: { errorMessage: "Sarlavha string bo'lishi kerak!" } },
    ru_title: { isString: { errorMessage: "Sarlavha string bo'lishi kerak!" } },
    en_title: { isString: { errorMessage: "Sarlavha string bo'lishi kerak!" } },

    uz_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    ru_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, },

    en_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, isLength: { options: { min: 25 }, errorMessage: "Tavsif kamida 25 ta belgidan iborat bo'lishi kerak!" }, }
}