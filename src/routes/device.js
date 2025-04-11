const express = require('express');
const { body, validationResult } = require('express-validator');
const DeviceService = require('../services/deviceService');
const PatientService = require('../services/patientService');
const { error } = require('console');
const router = express.Router();

// Validation middleware for creating a device
const validateDevice = [
    body('deviceId').notEmpty().withMessage('Device ID is required')
];

// POST route to create a new device
router.post('/', validateDevice, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const deviceData = await DeviceService.getDeviceByDeviceId(req.body.deviceId);
        if (deviceData) {
            throw new Error("Device id already exists");
        }
        const device = await DeviceService.createDevice(req.body);
        res.status(201).json(device);
    } catch (err) {
        next(err);
    }
});

// Validation middleware for assigning a device to a patient
const validateAssignDevice = [
    body('deviceId').notEmpty().withMessage('Device ID is required'),
    body('patientId').notEmpty().withMessage('Patient ID is required')
];

// POST route to assign a device to a patient
router.post('/assign', validateAssignDevice, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { deviceId, patientId } = req.body;

    try {
        const deviceData = await DeviceService.getDeviceByDeviceId(deviceId);
        if (!deviceData) {
            return res.status(404).json({ error: 'Device not found' });
        }
        if (deviceData.status !== 'available') {
            return res.status(400).json({ error: 'Device is not available for assignment' });
        }
        if (deviceData.assignedTo) {
            return res.status(400).json({ error: 'Device is already assigned to another patient' });
        }
        const patientData = await PatientService.getPatientById(patientId);
        if (!patientData) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        if (patientData.device) {
            return res.status(400).json({ error: 'Patient already has a device assigned' });
        }
        const updatedDevice = await DeviceService.assignDeviceToPatient(deviceId, patientId);

        res.status(200).json(updatedDevice);
    } catch (err) {
        next(err);
    }
});



// POST route to process a device reading
router.post('/reading', async (req, res, next) => {
    try {
        const { rawData } = req.body;
        const reading = await DeviceService.processReading(rawData);
        res.status(201).json(reading);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
