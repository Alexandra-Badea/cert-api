require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service: 'yahoo',
    secure: true, // only for 465
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    },
    debug: false,
    logger: true
});

exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const sanitizedName = name.trim();
        const sanitizedEmail = email.trim();
        const sanitizedSubject = subject.trim();
        const sanitizedMessage = message.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!sanitizedName || !sanitizedEmail || !sanitizedSubject || !sanitizedMessage || !emailRegex.test(sanitizedEmail)) {
            return res.status(400).json({ message: 'Please provide valid data for all fields.' });
        }

        const receivedEmailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: process.env.EMAIL_ADDRESS,
            subject: sanitizedSubject,
            text: `From: ${sanitizedName} <${sanitizedEmail}>\n\n${sanitizedMessage}`
        };

        transporter.sendMail(receivedEmailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email' });
            } else {
                const confirmationEmailOptions = {
                    from: process.env.EMAIL_ADDRESS,
                    to: sanitizedEmail,
                    subject: 'Acknowledgement: We Received Your Message',
                    text: `
                        Dear ${sanitizedName}
        
                        Thank you for contacting us! We have received your message and will get back to you as soon as possible.

                        Best Regards,
                        CERT Team
                    `
                };

                transporter.sendMail(confirmationEmailOptions, (error, info) => {
                    if (error) {
                        return res.status(500).json({ message: 'Server error' });
                    } else {
                        return res.status(200).json({ message: 'Email sent successfully' });
                    }
                });
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}