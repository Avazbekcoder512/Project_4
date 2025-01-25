const { checkSchema } = require('express-validator')
const multer = require('multer')
const upload = multer()
const { createDoctor, getAllDoctors, getOneDoctors, updateDoctor, deleteDoctor, searchDoctors, updatePassword } = require('../controller/doctorController')
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')
const { createDoctorSchema, updateDoctorSchema } = require('../validators/doctorValidate')
const { passwordSchema } = require('../validators/passwordValidate')


const router = require('express').Router()

router
.get('/doctor-search/:key', roleAccessMiddleware(['superAdmin', 'admin']), searchDoctors)
.post('/doctor-create', roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(createDoctorSchema), createDoctor)
.get('/doctors', roleAccessMiddleware(['superAdmin', 'admin']), getAllDoctors)
.get('/doctor/:id', roleAccessMiddleware(['superAdmin', 'admin']), getOneDoctors)
.put('/doctor/:id/update', roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(updateDoctorSchema), updateDoctor)
.put('/doctor-pasword/:id/update', roleAccessMiddleware(['superAdmin', 'admin']), checkSchema(passwordSchema), updatePassword)
.delete('/doctor/:id/delete', roleAccessMiddleware('superAdmin'), deleteDoctor)

module.exports = router