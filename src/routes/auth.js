const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const { loginUser } = require('../services/authService');
const { body, validationResult } = require('express-validator');
const { error } = require('console');


// router.post('/register', async (req, res, next) => {
//     try {
//         const { username, password, role } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({ username, password: hashedPassword, role });
//         res.status(201).json(user);
//     } catch (err) {
//         next(err);
//     }
// });

router.post('/login',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {

            const { username, password } = req.body;
            const result = await loginUser(username, password);
            if (!result) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            res.json({ token: result.token });
        } catch (err) {
            next(err);
        }
    });

module.exports = router;
