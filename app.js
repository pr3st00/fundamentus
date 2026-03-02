import express, { json, static as expressStatic } from 'express';
import { join } from 'path';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'body-parser';
const { json: _json, urlencoded } = pkg;
import { default as createLogger } from './lib/loggerBuilder.js';

// Routes
import fundsexplorer from './routes/fii/fundsexplorer.js';
import investidor10 from './routes/fii/investidor10.js';
import stock from './routes/stocks/fundamentus.js';
import health from './routes/health.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(json());
app.use(createLogger());

app.use(_json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressStatic(join(__dirname, 'public')));

app.use('/fii', investidor10);
app.use('/fii2', fundsexplorer);
app.use('/stock', stock);
app.use('/health', health);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;