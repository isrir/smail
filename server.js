// server.js

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();

// Configure bodyParser to parse JSON
app.use(bodyParser.json());

// API endpoint to calculate GPA/Percentage and send email
app.post('/calculateGPA', (req, res) => {
    // Get student details from request body
    const { email, registerNumber, marks } = req.body;

    // Calculate GPA/Percentage
    const totalMarks = marks.reduce((acc, mark) => acc + mark, 0);
    const percentage = (totalMarks / (marks.length * 100)) * 100;

    // Determine pass/fail based on percentage
    const passStatus = percentage >= 40 ? 'Pass' : 'Fail';

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Your Gmail email address
            pass: 'your-password' // Your Gmail password
        }
    });

    // Setup email data
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Semester End Marks Details',
        text: `Dear Student,\n\nYour percentage of marks is ${percentage.toFixed(2)}% and you have ${passStatus}ed the semester.\n\nRegards,\nYour School/College`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Failed to send email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
