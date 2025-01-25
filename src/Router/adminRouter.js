const { createAdmin, getAllAdmin, deleteAdmin } = require('../controller/adminController')
const { checkSchema } = require('express-validator')
const { createAdminSchema} = require('../validators/adminValidate')
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')


const router = require('express').Router()

router
.post('/admin-create', roleAccessMiddleware('superAdmin'), checkSchema(createAdminSchema), createAdmin)
.get('/admins', roleAccessMiddleware('admin'), getAllAdmin)
.delete('/admin/:id/delete', roleAccessMiddleware('superAdmin'), deleteAdmin);

module.exports = router