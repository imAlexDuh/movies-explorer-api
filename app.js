require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./routes/default');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001, URL = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors);
mongoose.connect(URL);
app.use(requestLogger);
app.use(router);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка!' : message });
  next();
});

app.listen(PORT);
