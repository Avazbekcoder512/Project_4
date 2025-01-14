const { checkSchema } = require('express-validator')
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')
const { createServiceSchema, updateServiceSchema } = require('../validators/serviceValidate')
const { createService, getAllServices, getOneService, updateService, deleteService } = require('../controller/serviceController')

const router = require('express').Router()

router
.post('/service-create', roleAccessMiddleware('admin'), checkSchema(createServiceSchema), createService)
.get('/services', roleAccessMiddleware('admin'), getAllServices)
.get('/service/:id', roleAccessMiddleware('admin'), getOneService)
.put('/service/:id/update', roleAccessMiddleware('admin'), checkSchema(updateServiceSchema), updateService)
.delete('/service/:id/delete', roleAccessMiddleware('admin'), deleteService)

module.exports = router