const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 10000;

// Middleware
app.use(cors()); // Разрешава CORS заявките
app.use(bodyParser.json()); // Парсира JSON тялото на заявките

app.post('/', (req, res) => {
  const { to, subject, text } = req.body;

  // Проверка за липсващи полета
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Вашият Gmail адрес
      pass: process.env.EMAIL_PASSWORD, // Вашата парола
    },
  });

  // Настройки за имейла
  const mailOptions = {
    from: process.env.EMAIL, // Изпращач
    to, // Получател
    subject, // Тема
    html: text, // HTML съдържание
  };

  // Изпращане на имейла
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: error.message });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
