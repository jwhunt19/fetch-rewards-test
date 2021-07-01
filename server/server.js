const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('/api/list', (req, res) => {
  axios.get('https://fetch-hiring.s3.amazonaws.com/hiring.json')
    .then(({ data }) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(err.response.status).send(err);
    });
});

app.listen(process.env.PORT || 3000);
