const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/join', (req, res) => {
    console.log('join get')
});

app.post('/join', (req, res) => {
    console.log('join post'); // insert문
});

app.get('/signin', (req, res) => {
    console.log('singin get');
});

app.post('/signin', (req, res) => {
    console.log('signin post');
});

app.listen(port, () => console.log(`Listening on port ${port}`));

