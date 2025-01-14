exports.createResultSchema = {
    patient: { notEmpty: { errorMessage: "Bemor talab qilinadi!" } },
    section: { isString: { errorMessage: "Bo'lim nomi string bo'lishi kerak!" }, notEmpty: { errorMessage: "Bo'lim talab qilinadi!" } },
    analysisType: { isString: { errorMessage: "Tahlil turi string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tahlil turi talab qilinadi!" } },
    analysisResult: { isString: { errorMessage: "Tahlil natijasi string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tahlil natijasi talab qilinadi!" } },
    diagnosis: { isString: { errorMessage: "Tashxis string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tashxis talab qilinadi!" } },
    recommendation: { isString: { errorMessage: "Tavsiya string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tavsiya talab etiladi!" } }
}

exports.updateResultSchema = {
    section: { isString: { errorMessage: "Bo'lim nomi string bo'lishi kerak!" } },
    analysisType: { isString: { errorMessage: "Tahlil turi string bo'lishi kerak!" } },
    analysisResult: { isString: { errorMessage: "Tahlil natijasi string bo'lishi kerak!" } },
    diagnosis: { isString: { errorMessage: "Tashxis string bo'lishi kerak!" } },
    recommendation: { isString: { errorMessage: "Tavsiya string bo'lishi kerak!" } }
}