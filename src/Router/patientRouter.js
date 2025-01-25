const { checkSchema } = require('express-validator')
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')
const { createPatientSchema, updatePateintSchema } = require('../validators/patientValidate')
const { createPatient, getAllPatients, getOnePatient, updatedPateint, deletePatient, searchPatient } = require('../controller/patientController')

const router = require('express').Router()

router
.get('/patient-search/:key', roleAccessMiddleware(['doctor', 'registrator']), searchPatient) 
.post('/patient-create', roleAccessMiddleware(['doctor', 'registrator']), checkSchema(createPatientSchema), createPatient)
.get('/patients', roleAccessMiddleware(['doctor', 'registrator']),  getAllPatients)
.get('/patient/:id', roleAccessMiddleware('doctor'), getOnePatient)
.put('/patient/:id/update', roleAccessMiddleware('doctor'), checkSchema(updatePateintSchema), updatedPateint)
.delete('/patient/:id/delete', roleAccessMiddleware('superAdmin'), deletePatient)

module.exports = router