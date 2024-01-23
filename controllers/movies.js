const Movie = require('../models/movie');

const BadRequestErr = require('../errors/BadRequestErr');
const NotExistErr = require('../errors/NotExistErr');
const DelMovieErr = require('../errors/DelMovieErr');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send({ movies }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director,
    duration, year,
    description, image,
    trailerLink, nameRU, nameEN,
    thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(201).send({ movie });
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные.'));
      }
      return next(err);
    });
};

function deleteMovieById(req, res, next) {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotExistErr('Фильм с указанным id не найден');
    })
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new DelMovieErr('Нельзя удалять чужие фильмы');
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .then((removeMovie) => res.status(200).send({ removeMovie }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Неправильный id фильма'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
