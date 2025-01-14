const { checkSchema } = require('express-validator')
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')
const { createSectionSchema, updateSectionSchema } = require('../validators/sectionValidate')
const { createSection, getSection, getOneSection, updateSection, deleteSection, searchSection } = require('../controller/sectionController')

const router = require('express').Router()

router
.post('/section-create', roleAccessMiddleware('doctor'), checkSchema(createSectionSchema), createSection)
.get('/sections', roleAccessMiddleware('doctor'), getSection)
.get('/section/:id', roleAccessMiddleware('doctor'), getOneSection)
.put('/section/:id/update', roleAccessMiddleware('doctor'), checkSchema(updateSectionSchema), updateSection)
.delete('/section/:id/delete', roleAccessMiddleware('doctor'), deleteSection)
.get('/sections/:key', roleAccessMiddleware('doctor'), searchSection)

module.exports = router