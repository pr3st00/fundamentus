const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio');
const baseUrl = 'https://www.fundsexplorer.com.br/funds/';

router.get('/', function (req, res, next) {

  const ticker = req.query.ticker;
  const url = baseUrl + ticker;

  const options = {
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0'
    }
  };

  rp(options)
    .then(function (html) {

      let spans = [];

      $('span', html).each(function (i, e) {
        spans[i] = $(this).text().replace(/\s|%|-/g, '').replace(/,/g, '.');
      });

      console.debug(spans);

      res.send({
        ticker: ticker,
        pvp: spans[spans.findIndex(e => e =="P/VP") + 1],
        dy: spans[spans.findIndex(e => e =="DividendYield") + 1],
      });

    })
    .catch(function (err) {
      res.status(500);
      res.send({ error: err })
    });

});

module.exports = router;
