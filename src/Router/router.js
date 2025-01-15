const { jwtAccessMiddleware } = require('../middlewares/jwt-access-middleware')
const adminRouter = require('./adminRouter')
const loginRouter = require('./login.Router')
const doctorRouter = require('./doctorRouter')
const staffRouter = require('./staffRouter')
const serviceRouter = require('./serviceRouter')
const newsRouter = require('./newsRouter')
const patientRouter = require('./patientRouter')
const analysisRouter = require('./analysisRouter')
const sectionRouter = require('./sectionRouter')
const analysisResultRouter = require('./analysisResultRouter')
const resultRouter = require('./resultRouter')

exports.appRouter = (app) => {
    app.use('/', resultRouter)
    
    app.use('/', loginRouter)
    app.use('/', jwtAccessMiddleware, adminRouter)
    app.use('/', jwtAccessMiddleware, doctorRouter)
    app.use('/', jwtAccessMiddleware, staffRouter)
    app.use('/', jwtAccessMiddleware, serviceRouter)
    app.use('/', jwtAccessMiddleware, newsRouter)
    app.use('/', jwtAccessMiddleware, patientRouter)
    app.use('/', jwtAccessMiddleware, analysisRouter)
    app.use('/', jwtAccessMiddleware, sectionRouter)
    app.use('/', jwtAccessMiddleware, analysisResultRouter)

    app.use((req, res) => {
        return res.status(404).send({
            error: "Page not found"
        })
    })
}

