const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const moviesRouter = require('./movie');
const auth = require('../middlewares/auth');

const NotExistErr = require('../errors/NotExistErr');

const { createUser, login, logout } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);
router.use(userRouter);
router.use(moviesRouter);
router.post('/signout', logout);

router.use('*', (req, res, next) => {
  next(new NotExistErr('Такой страницы нет'));
});

module.exports = router;
