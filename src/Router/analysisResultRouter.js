const { checkSchema } = require('express-validator')
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')
const { createResultSchema, updateResultSchema } = require('../validators/analysisResultValidate')
const { createAnalysisResult, getAnalysisResult, getOneAnalysisResult, updateAnalysisResult, deleteAnalysisResult, searchAnalysisResult } = require('../controller/analysisResultController')


const router = require('express').Router()

router
.post('/analysisresult-create', roleAccessMiddleware('doctor'), checkSchema(createResultSchema), createAnalysisResult)
.get('/analysisresult', roleAccessMiddleware('doctor'), getAnalysisResult)
.get('/analysisresult/:id', roleAccessMiddleware('doctor'), getOneAnalysisResult)
.put('/analysisresult/:id/update', roleAccessMiddleware('doctor'), checkSchema(updateResultSchema), updateAnalysisResult)
.delete('/analysisresult/:id/delete', roleAccessMiddleware('doctor'), deleteAnalysisResult)
.get('/analysisresult-search/:key', roleAccessMiddleware('doctor'), searchAnalysisResult)

module.exports = router