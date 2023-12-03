const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const URL_REGEX = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/im;
const ENG_REGEX = /^[a-zA-Z]/im;
const RU_REGEX = /^[а-яА-ЯёЁ]/im;

const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(URL_REGEX),
    trailerLink: Joi.string().required().regex(URL_REGEX),
    thumbnail: Joi.string().required().regex(URL_REGEX),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().regex(RU_REGEX),
    nameEN: Joi.string().required().regex(ENG_REGEX),
  }),
}), createMovie);

moviesRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex(),
  }),
}), deleteMovieById);

module.exports = moviesRouter;
