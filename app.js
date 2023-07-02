const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().optional().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[0-9a-z.\-_~:/?#[\]@!$&'()*+,;=]+#?$/).optional(),
    about: Joi.string().optional().min(2).max(30),
  }).unknown(true),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Некорректный путь' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  if (err.name === 'DocumentNotFoundError') res.status(404).send({ message: 'Запрашиваемые данные не найдены' });
  if (err.name === 'CastError') res.status(400).send({ message: 'Переданы некорректные данные' });
  if (err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные для создания' });
  if (err.code === 11000) res.status(409).send({ message: 'Такой email уже существует' });

  res.status(statusCode).send({ message });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
