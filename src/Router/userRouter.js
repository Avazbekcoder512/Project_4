const { checkSchema } = require('express-validator')
const { getAllUsers, getOneUser, updateUser, deleteUser } = require('../controller/userController')
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')
const { updateUserSchema } = require('../validators/userValidate')

const router = require('express').Router()

router
.get('/users', roleAccessMiddleware(['doctor', 'registrator']), getAllUsers)
.get('/user/:id', roleAccessMiddleware(['doctor', 'registrator']), getOneUser)
.put('/user/:id/update', roleAccessMiddleware(['doctor', 'register']), checkSchema(updateUserSchema), updateUser)
.delete('/user/:id/delete', roleAccessMiddleware(['doctor']), deleteUser)


module.exports = router