const { Schema, model } = require('mongoose');

const patientSchema = new Schema({
    name: String,
    age: Number,
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
});

module.exports = model('Patient', patientSchema);
