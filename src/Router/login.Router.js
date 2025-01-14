const { checkSchema } = require('express-validator')
const { login } = require('../controller/auth/login')
const { loginValidateSchema } = require('../validators/loginValidate')
const { loginLimiter } = require('../middlewares/login-limiter')

const router = require('express').Router()

router
.post('/login', checkSchema(loginValidateSchema), loginLimiter, login)

module.exports = router