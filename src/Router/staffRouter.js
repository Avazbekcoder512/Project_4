const { checkSchema } = require('express-validator')
const multer = require('multer')
const upload = multer()
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')
const { createStaffSchema, updateStaffSchema } = require('../validators/staffValidate')
const { createStaff, getAllStaff, getOneStaff, updateStaff, deleteStaff, searchStaff, updateStaffPassword } = require('../controller/staffController')
const { passwordSchema } = require('../validators/passwordValidate')

const router = require('express').Router()

router
.get('/staff-search/:key', roleAccessMiddleware(['superAdmin', 'admin']), searchStaff)
.post('/staff-create', roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(createStaffSchema), createStaff)
.get('/staff', roleAccessMiddleware(['superAdmin', 'admin']), getAllStaff)
.get('/one-staff/:id', roleAccessMiddleware(['superAdmin', 'admin']), getOneStaff)
.put('/staff/:id/update', roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(updateStaffSchema), updateStaff)
.delete('/staff/:id/delete', roleAccessMiddleware('superAdmin'), deleteStaff)
.put('/staffpassword/:id/update', roleAccessMiddleware(['superAdmin', 'admin']), checkSchema(passwordSchema), updateStaffPassword)

module.exports = router