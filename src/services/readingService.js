const Device = require('../models/Device');
const Reading = require('../models/Reading');

async function processReading({ deviceId, timestamp, pulse, systolic, diastolic, o2sat }) {
    try {
        const device = await Device.findOne({ deviceId });
        if (!device || !device.assignedTo) {
            throw new Error('Device is not assigned to a patient');
        }

        const reading = await Reading.create({
            deviceId,
            timestamp,
            pulse,
            systolic,
            diastolic,
            o2sat,
            patient: device.assignedTo,
        });

        return reading;
    } catch (error) {
        console.error('Error processing reading:', error.message);
        throw error;
    }
}



module.exports = {
    processReading
};
