require('dotenv').config();
const Authentication = require('../models/Authentication');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const sanitizedEmail = email.trim();
        const sanitizedPassword = password.trim();

        if (!sanitizedEmail || !sanitizedPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const administrator = await Authentication.findOne({ email: email });

        if (!administrator) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, administrator.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = {
            email: email
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 3600 * 1000),
            path: '/'
        })

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'An error occured' });
    }
}