const express = require('express');
const ReadingService = require('../services/readingService');
const { error } = require('console');
const router = express.Router();


// POST route to process a device reading
router.post('/', async (req, res, next) => {
    try {
        const { rawData } = req.body;
        const parsed = parseRawData(rawData);
        if (!parsed) {
            console.error('Invalid format.');
            return res.status(400).json({ error: 'Invalid format.' });
        }
        const { deviceId, timestamp, pulse, systolic, diastolic, o2sat } = parsed;
        const timestampNumber = Number(timestamp);
        if (isNaN(timestampNumber) || timestampNumber <= 0) {
            console.error('Invalid timestamp:', timestamp);
            return res.status(400).json({ error: 'Invalid timestamp' });
        }

        const pulseNumber = Number(pulse);
        if (isNaN(pulseNumber) || pulseNumber < 0) {
            console.error('Invalid pulse value:', pulse);
            return res.status(400).json({ error: 'Invalid pulse value' });
        }

        const systolicNumber = Number(systolic);
        if (isNaN(systolicNumber) || systolicNumber <= 0) {
            console.error('Invalid systolic value:', systolic);
            return res.status(400).json({ error: 'Invalid systolic value' });
        }

        const diastolicNumber = Number(diastolic);
        if (isNaN(diastolicNumber) || diastolicNumber <= 0) {
            return res.status(400).json({ error: 'Invalid diastolic value' });
        }

        const o2satNumber = Number(o2sat);
        if (isNaN(o2satNumber) || o2satNumber < 0 || o2satNumber > 100) {
            return res.status(400).json({ error: 'Invalid O2 saturation value' });
        }
        const reading = await ReadingService.processReading({ deviceId, timestamp, pulse, systolic, diastolic, o2sat });
        res.status(201).json(reading);
    } catch (err) {
        next(err);
    }
});


function parseRawData(rawData) {
    const match = rawData.match(/####(.*?)::(.*?)::(.*?)::(.*?)::(.*?)::(.*?)####/);
    if (!match) return null;

    const [_, deviceId, timestamp, pulse, systolic, diastolic, o2sat] = match;
    return { deviceId, timestamp, pulse, systolic, diastolic, o2sat };
}

module.exports = router;
