const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.jwtAccessMiddleware = function (req, res, next) {
    try {
        // Authorization headerdan tokenni olish
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(404).send({
                error: 'Token not found',
            });
        }

        // "Bearer <token>" formatidan tokenni ajratib olish
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(404).send({
                error: 'Token not provided',
            });
        }

        // Tokenni tekshirish va foydalanuvchi ma'lumotlarini olish
        const user = jwt.verify(token, process.env.JWT_KEY);
      

        next(); // Keyingi middleware yoki marshrutga o‘tish
    } catch (error) {
        // Token muddati tugagan holatni qayta ishlash
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
                error: 'Token muddati tugagan. Iltimos, qayta kirish qiling!',
            });
        }

        // Token bilan bog‘liq boshqa xatoliklar
        if (error.message) {
            return res.status(400).send({
                error: error.message,
            });
        }

        return res.status(500).send("Serverda xatolik!");
    }
};
