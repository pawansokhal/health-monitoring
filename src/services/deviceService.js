const Device = require('../models/Device');
const Patient = require('../models/Patient');

async function createDevice(deviceData) {
    try {
        const device = await Device.create(deviceData);
        return device;
    } catch (error) {
        throw new Error('Error creating device: ' + error.message);
    }
}

async function assignDeviceToPatient(deviceId, patientId) {
    try {
        const device = await Device.findOneAndUpdate(
            { deviceId },
            { assignedTo: patientId, status: "in-use" },
            { new: true }
        );
        if (!device) {
            throw new Error('Device not found');
        }

        await Patient.findByIdAndUpdate(patientId, {
            device: device._id
        });
        return device;
    } catch (error) {
        throw new Error('Error assigning device: ' + error.message);
    }
}

async function getDeviceByDeviceId(deviceId) {
    try {
        return await Device.findOne({ deviceId });
    } catch (error) {
        throw new Error('Error fetching device details: ' + error.message);
    }
}



async function processReading(rawData) {
    const match = rawData.match(/####(.*?)::(.*?)::(.*?)::(.*?)::(.*?)::(.*?)####/);
    if (!match) {
        throw new Error('Invalid format');
    }

    const [_, deviceId, timestamp, pulse, systolic, diastolic, o2sat] = match;
    // Validate timestamp (ensure it's a valid number and a reasonable UNIX timestamp)
    const timestampNumber = Number(timestamp);
    if (isNaN(timestampNumber) || timestampNumber <= 0) {
        throw new Error('Invalid timestamp');
    }

    // Validate pulse (should not be negative and must be a number)
    const pulseNumber = Number(pulse);
    if (isNaN(pulseNumber) || pulseNumber < 0) {
        throw new Error('Invalid pulse value');
    }

    // Validate systolic (should be positive and reasonable)
    const systolicNumber = Number(systolic);
    if (isNaN(systolicNumber) || systolicNumber <= 0) {
        throw new Error('Invalid systolic value');
    }

    // Validate diastolic (should be positive and reasonable)
    const diastolicNumber = Number(diastolic);
    if (isNaN(diastolicNumber) || diastolicNumber <= 0) {
        throw new Error('Invalid diastolic value');
    }

    // Validate O2 Saturation (should be between 0 and 100)
    const o2satNumber = Number(o2sat);
    if (isNaN(o2satNumber) || o2satNumber < 0 || o2satNumber > 100) {
        throw new Error('Invalid O2 saturation value');
    }

    // Fetch the device to check if it's assigned to a patient
    const device = await Device.findOne({ deviceId });
    if (!device || !device.assignedTo) {
        throw new Error('Device is not assigned to a patient');
    }

    console.log({
        deviceId,
        timestamp: timestampNumber,
        pulse: pulseNumber,
        systolic: systolicNumber,
        diastolic: diastolicNumber,
        o2sat: o2satNumber,
        patient: device.assignedTo,
    })

    const reading = await Reading.create({
        deviceId,
        timestamp: timestampNumber,
        pulse: pulseNumber,
        systolic: systolicNumber,
        diastolic: diastolicNumber,
        o2sat: o2satNumber,
        patient: device.assignedTo,
    });

    return reading;
}



module.exports = {
    createDevice,
    assignDeviceToPatient,
    getDeviceByDeviceId,
    processReading
};
