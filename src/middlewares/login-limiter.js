const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 daqiqa
    max: 10, // Har bir IP uchun 5 ta urinish
    handler: (req, res) => {
        res.status(429).json({
            message: "Siz juda ko'p urinish qildingiz. Iltimos, 5 daqiqadan so'ng urinib ko'ring!"
        });
    }
});
