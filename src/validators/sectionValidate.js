exports.createSectionSchema = {
    uz_name: { isString: { errorMessage: "Bo'lim nomi string bo'lishi kerak!" }, notEmpty: { errorMessage: "Bo'lim nomi talab qilinadi!" } },
    ru_name: { isString: { errorMessage: "Bo'lim nomi string bo'lishi kerak!" }, notEmpty: { errorMessage: "Bo'lim nomi talab qilinadi!" } },
    en_name: { isString: { errorMessage: "Bo'lim nomi string bo'lishi kerak!" }, notEmpty: { errorMessage: "Bo'lim nomi talab qilinadi!" } },

    uz_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" } },
    ru_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" } },
    en_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsif talab qilinadi!" } }
}

exports.updateSectionSchema = {
    uz_name: { isString: { errorMessage: "Bo'lim nomi string bo'lishi kerak!" } },
    ru_name: { isString: { errorMessage: "Bo'lim nomi string bo'lishi kerak!" } },
    en_name: { isString: { errorMessage: "Bo'lim nomi string bo'lishi kerak!" } },

    uz_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" } },
    ru_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" } },
    en_description: { isString: { errorMessage: "Tavsif string bo'lishi kerak!" } }
}