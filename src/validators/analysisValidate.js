exports.createAnalysisSchema = {
    section: { notEmpty: { errorMessage: "Bo'lim idsi talab qilinadi!" } },
    name: { isString: { errorMessage: "Tahli nomi sting bolishi kerak!" }, notEmpty: { errorMessage: "Tahli nomi talab qilinadi!" } },
    price: { isInt: { errorMessage: "Narxi raqm bo'lishi kerak!" }, notEmpty: { errorMessage: "Narx talab qilinadi!" } }
}

exports.updateAnalysisSchema = {
    name: { isString: { errorMessage: "Tahlil nomi sting bolishi kerak!" } },
    price: { isInt: { errorMessage: "Narxi raqam bo'lishi kerak!" } }
}