const express = require('express');
const fs = require('fs');  
const path = require('path'); 
const app = express();
const router = express.Router();

app.use(express.json());  // Middleware to parse JSON body


router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});


router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data' });
    }
    res.json(JSON.parse(data));  // Send the user data as JSON
  });
});


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Read the user.json file
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data' });
    }

    const user = JSON.parse(data); // Since user.json contains a single user object

    // Validate the username and password
    if (user.username !== username) {
      return res.json({ status: false, message: 'User Name is invalid' });
    }

    if (user.password !== password) {
      return res.json({ status: false, message: 'Password is invalid' });
    }

    // If credentials are valid
    res.json({ status: true, message: 'User Is valid' });
  });
});


router.get('/logout', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send('<b>Username is required to logout.<b>');
  }

  res.send(`<b>${username} successfully logged out.<b>`);
});


app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.use('/', router);

app.listen(process.env.port || 8081, () => {
  console.log('Web Server is listening at port ' + (process.env.port || 8081));
});
