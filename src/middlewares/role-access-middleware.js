const jwt = require('jsonwebtoken');
require('dotenv').config();

// Role asosida ruxsatni tekshiruvchi middleware
exports.roleAccessMiddleware = function (roles) {
    return async function (req, res, next) {
        try {
            // Authorization headerdan tokenni olish
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.status(404).send({
                    error: 'Token not found',
                });
            }

            const token = authHeader.split(' ')[1]; // "Bearer <token>" formatidan tokenni ajratish
            if (!token) {
                return res.status(404).send({
                    error: 'Token not provided',
                });
            }

            // Tokenni tekshirish va role ni olish
            const { role } = jwt.verify(token, process.env.JWT_KEY);

            // Role massivida mavjudligini tekshirish
            if (!roles.includes(role)) {
                return res.status(403).send({
                    error: "Sizga ruxsat yo'q",
                });
            }

            next(); // Keyingi middlewarega o‘tish
        } catch (error) {
            console.log(error);

            if (error.message) {
                return res.status(400).send({
                    error: error.message,
                });
            }

            return res.status(500).send('Serverda xatolik!');
        }
    };
};
