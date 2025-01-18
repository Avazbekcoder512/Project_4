const { checkSchema } = require('express-validator')
const { login } = require('../controller/auth/login')
const { loginValidateSchema } = require('../validators/loginValidate')
const { limiter } = require('../middlewares/limiter')

const router = require('express').Router()

router
.post('/login', checkSchema(loginValidateSchema), limiter, login)

module.exports = router