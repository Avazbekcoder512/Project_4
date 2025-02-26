const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.roleAccessMiddleware = function (roles) {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.status(404).send({
                    error: 'Token not found',
                });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(404).send({
                    error: 'Token not provided',
                });
            }

            const { role } = jwt.verify(token, process.env.JWT_KEY);

            if (!roles.includes(role)) {
                return res.status(403).send({
                    error: "Sizga ruxsat yo'q",
                });
            }

            next();
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
