
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor'], default: 'doctor' },
});

module.exports = model('User', userSchema);
