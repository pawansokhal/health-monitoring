const request = require('supertest');
const app = require('../src/index');
const Device = require('../src/models/Device');
const Reading = require('../src/models/Reading');

jest.mock('../src/models/Device');
jest.mock('../src/models/Reading');

describe('Reading API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should process a valid reading and save it to DB', async () => {
        Device.findOne.mockResolvedValue({
            deviceId: 'device2',
            assignedTo: 'patient123',
        });

        Reading.create.mockResolvedValue({
            _id: 'reading123',
            deviceId: 'device2',
            timestamp: "1629885600",
            pulse: "75",
            systolic: "121",
            diastolic: "81",
            o2sat: "98",
            patient: 'patient123',
        });

        const res = await request(app)
            .post('/api/readings')
            .send({
                rawData: '####device2::1629885600::75::121::81::98####',
            });

        expect(res.statusCode).toBe(201);
        expect(Reading.create).toHaveBeenCalledWith({
            deviceId: 'device2',
            timestamp: "1629885600",
            pulse: "75",
            systolic: "121",
            diastolic: "81",
            o2sat: "98",
            patient: 'patient123',
        });
        expect(res.body).toHaveProperty('_id', 'reading123');
    });

    it('should return 400 for invalid format', async () => {
        const res = await request(app)
            .post('/api/readings')
            .send({
                rawData: 'invalid-data-format',
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should return error if device is not assigned to a patient', async () => {
        Device.findOne.mockResolvedValue({
            deviceId: 'device2',
            assignedTo: null,
        });

        const res = await request(app)
            .post('/api/readings')
            .send({
                rawData: '####device1::1629885600::75::121::81::98####',
            });
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'Device is not assigned to a patient');
    });
});
