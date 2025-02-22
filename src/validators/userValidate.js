exports.updateUserSchema = {
    orderNumber: {
        isInt: { errorMessage: "Tartib raqami son bo'lishi kerak!" },
        notEmpty: { errorMessage: "Tartib raqami talab qilinadi!" },
    }
}