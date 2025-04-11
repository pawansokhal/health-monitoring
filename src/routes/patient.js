// routes/patientRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const patientService = require('../services/patientService');
const { error } = require('console');
const router = express.Router();



// Get patients (with pagination)
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const patients = await patientService.getPatients(page, limit);
        res.json(patients);
    } catch (err) {
        next(err);
    }
});


const validatePatient = [
    body('name')
        .notEmpty().withMessage('Name is required'),

    body('age')
        .notEmpty().withMessage('Age is required')
        .isInt({ min: 10, max: 99 }).withMessage('Age must be a two-digit number between 10 and 99')
        .toInt(),
];
// Create a new patient
router.post('/', validatePatient, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const patient = await patientService.createPatient(req.body);
        res.status(201).json(patient);
    } catch (err) {
        next(err);
    }
});


const validatePatientUpdate = [
    body('name')
        .optional(),

    body('age')
        .optional()
        .isInt({ min: 10, max: 99 }).withMessage('Age must be a two-digit number between 10 and 99')
        .toInt(),
];
// Update a patient by ID
router.put('/:id', validatePatientUpdate, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const patient = await patientService.updatePatient(req.params.id, req.body);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(patient);
    } catch (err) {
        next(err);
    }
});

// Delete a patient by ID
router.delete('/:id', async (req, res, next) => {
    try {
        console.log('--req.params.id--', req.params.id)
        const patient = await patientService.deletePatient(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
