const { checkSchema } = require('express-validator')
const { createAnalysis, getAnalysis, getOneAnalysis, updateAnalysis, deleteAnalysis, searchAnalysis } = require('../controller/analysisController')
const { createAnalysisSchema, updateAnalysisSchema } = require('../validators/analysisValidate')
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')


const router = require('express').Router()

router
.post('/analysis-create', roleAccessMiddleware('doctor'), checkSchema(createAnalysisSchema), createAnalysis)
.get('/analysis', roleAccessMiddleware('doctor'), getAnalysis)
.get('/analysis/:id', roleAccessMiddleware('doctor'), getOneAnalysis)
.put('/analysis/:id/update', roleAccessMiddleware('doctor'), checkSchema(updateAnalysisSchema), updateAnalysis)
.delete('/analysis/:id/delete', roleAccessMiddleware('doctor'), deleteAnalysis)
.get('/analysis-search/:key', roleAccessMiddleware('doctor'), searchAnalysis)


module.exports = router