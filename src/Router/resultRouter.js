const { getResult, downloadResult } = require('../controller/resultController')
const { limiter } = require('../middlewares/limiter')
const router = require('express',).Router()

router
.get('/result', limiter, getResult)
.get('/download-result', limiter, downloadResult)

module.exports = router