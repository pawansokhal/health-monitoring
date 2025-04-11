const Patient = require('../models/Patient');
const mongoose = require('mongoose');

const getPatients = async (page = 1, limit = 10) => {
    try {
        return await Patient.find().skip((page - 1) * limit).limit(Number(limit));
    } catch (err) {
        throw new Error('Error fetching patients');
    }
};

const createPatient = async (patientData) => {
    try {
        const patient = await Patient.create(patientData);
        return patient;
    } catch (err) {
        throw new Error('Error creating patient');
    }
};

const updatePatient = async (id, patientData) => {
    try {
        const patient = await Patient.findByIdAndUpdate(id, patientData, { new: true });
        return patient;
    } catch (err) {
        throw new Error('Error updating patient');
    }
};

const deletePatient = async (id) => {
    try {
        return await Patient.findByIdAndDelete(id);
    } catch (err) {
        throw new Error('Error deleting patient');
    }
};

const getPatientById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid patient ID format');
        }
        const patient = await Patient.findById(id);
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    } catch (err) {
        throw new Error('Error fetching patient by ID: ' + err.message);
    }
};

module.exports = {
    getPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientById
};
