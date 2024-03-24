require('dotenv').config();
const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI, {});
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.log('Connection failed: ', error);
    }
}

module.exports = connectToDatabase;