const { addUser } = require('../controller/userController')

const router = require('express').Router()

router
.post('/adduser', addUser)


module.exports = router