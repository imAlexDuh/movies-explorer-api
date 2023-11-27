const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes/default');
const cors = require('./middlewares/cors');
const { requestLogger } = require('./middlewares/logger');

const { PORT = 3000, URL = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors);
mongoose.connect(URL);
app.use(requestLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка!' : message });
  next();
});

app.listen(PORT, () => {
  console.log('Server is on port 3000');
});