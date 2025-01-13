const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Mesajları tutmak için basit bir dizi
let messages = [];

app.use(bodyParser.json());
app.use(express.static('public'));

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Mesajları listeleme
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Mesaj oluşturma
app.post('/messages', (req, res) => {
  const newMessage = {
    text: req.body.text,
    createdAt: new Date()
  };
  messages.unshift(newMessage);
  res.status(201).json(newMessage);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});