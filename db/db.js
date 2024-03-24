require('dotenv').config();
const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {});
    } catch (error) {
        return res.status(500).json({ message: 'Error' });
    }
}

module.exports = connectToDatabase;