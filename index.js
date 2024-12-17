const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 10000;

app.use(bodyParser.json());

app.post('/', (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Липсва задължително поле' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
              user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Имейлът е изпратен: ' + info.response });
  });
});

app.listen(PORT, () => console.log(`Сървър с работещ на порт ${PORT}`));
