const { Schema, model } = require('mongoose');

const deviceSchema = new Schema({
    deviceId: { type: String, required: true, unique: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Patient' },
    assignedDate: { type: Date, default: null },
    status: { type: String, enum: ['in-use', 'available', 'maintenance'], default: 'available' },
});

module.exports = model('Device', deviceSchema);
