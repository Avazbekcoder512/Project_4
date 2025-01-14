exports.passwordSchema = {
    password: { isString: { errorMessage: "Parol string bo'lishi kerak!" }, isLength: { options: { min: 8 }, errorMessage: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!" }, trim: { errorMessage: "Parol orasida ochiq joy bo'lishi mumkin emas!" } },
}