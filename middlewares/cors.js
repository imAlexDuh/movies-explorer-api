const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://api.imalexdudie.nomoredomainsmonster.ru',
  'http://api.imalexdudie.nomoredomainsmonster.ru',
  'https://imalexdudie.nomoredomainsmonster.ru',
  'http://imalexdudie.nomoredomainsmonster.ru',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
