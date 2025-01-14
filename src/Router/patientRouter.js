const { checkSchema } = require('express-validator')
const { roleAccessMiddleware } = require('../middlewares/role-access-middleware')
const { createPatientSchema, updatePateintSchema } = require('../validators/patientValidate')
const { createPatient, getAllPatients, getOnePatient, updatedPateint, deletePatient, searchPatient } = require('../controller/patientController')

const router = require('express').Router()

router
.get('/patient-search/:key', roleAccessMiddleware(['doctor', 'Registrator']), searchPatient) 
.post('/patient-create', roleAccessMiddleware(['doctor', 'Registrator']), checkSchema(createPatientSchema), createPatient)
.get('/patients', roleAccessMiddleware(['doctor', 'Registrator']),  getAllPatients)
.get('/patient/:id', roleAccessMiddleware('doctor'), getOnePatient)
.put('/patient/:id/update', roleAccessMiddleware('doctor'), checkSchema(updatePateintSchema), updatedPateint)
.delete('/patient/:id/delete', roleAccessMiddleware('doctor'), deletePatient)

module.exports = router