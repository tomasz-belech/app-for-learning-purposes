require('dotenv').config()
const express = require('express');
const app = express();
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECTED_URI = process.env.REDIRECTED_URI;

console.log(process.env.CLIENT_ID);

app.get('/', (req, res) => {
    const data = {
        name: 'chudy',
        isAwesome: true
    };

    res.json(data);
});

app.get('/Login', (req, res) => {
    res.send('Log in to Spotify');
})
app.listen(port, () =>{
    console.log('Express app listening at http://localhost:${port}');
});