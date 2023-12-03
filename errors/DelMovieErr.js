const { ERROR_DEL_MOVIE } = require('../constants');

class DelCardErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_DEL_MOVIE;
  }
}

module.exports = DelCardErr;
