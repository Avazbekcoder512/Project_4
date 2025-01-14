const { getResult, downloadResult } = require('../controller/resultController')
const router = require('express',).Router()

router
.get('/result', getResult)
.get('/download-result', downloadResult)

module.exports = router