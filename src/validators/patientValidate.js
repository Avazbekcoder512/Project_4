exports.createPatientSchema = {
    name: { isString: { errorMessage: "F.I.Sh  string bo'lishi kerak!" }, notEmpty: { errorMessage: "F.I.Sh talab qilinadi!" } },
    date_of_birth: { isString: { errorMessage: "Tu'g'ilgan kun string bo'lishi kerak!" }, notEmpty: { errorMessage: "Tu'g'ilgan kun talab qilinadi!" } },
    gender: { isString: { errorMessage: "Gender string bo'lishi kerak!" }, notEmpty: { errorMessage: "Gender talab qilinadi!" } },
    
    email: { isEmail: { errorMessage: "Elektron pochta manzili yaroqsiz!" }, notEmpty: { errorMessage: "Elektron pochta manzili talab qilinadi!" } },

    orderNumber: { isString: { errorMessage: "Tartib raqami raqam bo'lishi kerak!" }, notEmpty: { errorMessage: "Tartib raqami talab qilinadi!" } },
}

exports.updatePateintSchema = {
    name: { isString: { errorMessage: "F.I.Sh  string bo'lishi kerak!" } },
    date_of_birth: { isString: { errorMessage: "Tu'g'ilgan kun string bo'lishi kerak!" } },
    gender: { isString: { errorMessage: "Gender string bo'lishi kerak!" } },
    
    email: { isEmail: { errorMessage: "Elektron pochta manzili yaroqsiz!" } },
}