import logger from 'morgan';

const jsonFormat = (tokens, req, res) => JSON.stringify({
  time: new Date().toISOString(),
  level: 'info',
  type: 'access',
  method: tokens.method(req, res),
  url: tokens.url(req, res),
  status: Number(tokens.status(req, res)),
  contentLength: Number(tokens.res(req, res, 'content-length')) || 0,
  responseTimeMs: Number(tokens['response-time'](req, res)),
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

function createLogger() {
  return logger(jsonFormat);
}

export default createLogger;