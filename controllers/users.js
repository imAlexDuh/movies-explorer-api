const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadAuthErr = require('../errors/BadAuthErr');
const ExistingEmailErr = require('../errors/ExistingEmailErr');
const NotExistErr = require('../errors/NotExistErr');
const BadRequestErr = require('../errors/BadRequestErr');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotExistErr('Пользователь по указанному не найден.'));
      }
      return res.status(200).send({ user });
    })
    .catch((err) => next(err));
};

function updateUserProfile(req, res, next) {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotExistErr('Пользователь по указанному id не найден.'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ExistingEmailErr('Пользователь с такой почтой уже существует'));
      } else if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
}

function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name, email: user.email, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new ExistingEmailErr('Передан уже зарегистрированный email.'));
      }
      return next(err);
    });
}

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? SECRET : 'superverysecretkey', { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: '604800',
          httpOnly: true,
        })
        .status(200)
        .send({ message: 'Авторизация прошла успешно' });
    })

    .catch(() => {
      next(new BadAuthErr('Неправильные почта или пароль.'));
    });
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};

module.exports = {
  getCurrentUser,
  updateUserProfile,
  createUser,
  login,
  logout,
};
