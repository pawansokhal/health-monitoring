const request = require('supertest');
const app = require('../src/index');

describe('Auth API', () => {
    // it('should register a new user', async () => {
    //     const res = await request(app).post('/api/auth/register').send({
    //         username: 'admin',
    //         password: '1234',
    //         role: 'admin',
    //     });
    //     expect(res.statusCode).toEqual(201);
    //     expect(res.body).toHaveProperty('_id');
    // });

    it('should log in and return a JWT', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: '1234',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});