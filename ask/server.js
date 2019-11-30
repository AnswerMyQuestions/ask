const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Home
app.get('/join', (req, res) => {
    console.log('join get')
});

app.post('/join', (req, res) => {
    console.log('join post'); // insert문
});

// Login
app.get('/signin', (req, res) => {
    console.log('singin get');
});

app.post('/signin', (req, res) => {
    console.log('signin post');
});

// Mypage
app.post('/deleteroom', (req, res) => {
    console.log('deleteroom post'); // delete문 또는 삭제여부 표시
});

app.post('/deleteaccount', (req, res) => {
    console.log('deleteaccount post'); // delete문 또는 삭제여부 표시
});

app.listen(port, () => console.log(`Listening on port ${port}`));

