const { Schema, model } = require('mongoose');

const readingSchema = new Schema({
    deviceId: String,
    timestamp: { type: Date },
    pulse: Number,
    systolic: Number,
    diastolic: Number,
    o2sat: Number,
    patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
});

module.exports = model('Reading', readingSchema);
