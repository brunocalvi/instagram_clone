const express = require('express');
const bodyParser = require('body-parser');
const postagensRouter = require('./routes/postagensRouter');
const multiparty = require('connect-multiparty');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multiparty());

app.get('/', (req, res) => {
  res.status(200).json({msg: 'Olá mundo !'});
});

app.use('/', postagensRouter);

app.listen(3000, () => {
  console.log('-> API rodando na porta 3000');
});