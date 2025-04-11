require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// Sample users to be seeded
const users = [
    {
        name: 'Admin User',
        username: 'admin',
        password: '1234',
        role: 'admin',
    },
    {
        name: 'Doctor 1',
        username: 'doctor',
        password: '1234',
        role: 'doctor',
    }
];


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in the .env file");
    process.exit(1);
}

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Hash passwords for all users before saving
        for (let i = 0; i < users.length; i++) {
            const hashedPassword = await bcrypt.hash(users[i].password, 10);
            users[i].password = hashedPassword;
        }

        await User.deleteMany({});
        await User.insertMany(users);
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
