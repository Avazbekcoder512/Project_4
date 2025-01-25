const { checkSchema } = require('express-validator')
const multer = require('multer')
const upload = multer()
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')
const { createNewsSchema, updateNewsSchema } = require('../validators/newsValidate')
const { createNews, getAllNews, getOneNews, updateNews, deleteNews, searchNews } = require('../controller/newsController')

const router = require('express').Router()

router
.post('/news-create', roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(createNewsSchema), createNews)
.get('/news', roleAccessMiddleware(['superAdmin', 'admin']), getAllNews)
.get('/news/:id', roleAccessMiddleware(['superAdmin', 'admin']), getOneNews)
.put('/news/:id/update', roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(updateNewsSchema), updateNews)
.delete('/news/:id/delete', roleAccessMiddleware(['superAdmin', 'admin']), deleteNews)
.get('/news-search/:key', roleAccessMiddleware(['superAdmin', 'admin']), searchNews)

module.exports = router