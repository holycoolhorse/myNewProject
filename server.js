const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs'); // bcrypt yerine bcryptjs kullanıyoruz
const app = express();
const port = process.env.PORT || 3000;

// Kullanıcıları ve mesajları tutmak için basit diziler
let users = [];
let messages = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Ana sayfa
app.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  } else {
    res.redirect('/login');
  }
});

// Giriş sayfası
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Kayıt sayfası
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Kullanıcı kayıt
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.redirect('/login');
});

// Kullanıcı giriş
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

// Mesajları listeleme
app.get('/messages', (req, res) => {
  if (req.session.user) {
    res.json(messages);
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Mesaj oluşturma
app.post('/messages', (req, res) => {
  if (req.session.user) {
    const newMessage = {
      username: req.session.user.username,
      text: req.body.text,
      createdAt: new Date()
    };
    messages.unshift(newMessage);
    res.status(201).json(newMessage);
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});