const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio');
const baseUrl = 'https://www.fundsexplorer.com.br/funds/';

router.get('/', function (req, res, next) {

  const ticker = req.query.ticker;
  const url = baseUrl + ticker;

  rp(url)
    .then(function (html) {

      let spans = [];

      $('span', html).each(function (i, e) {
        spans[i] = $(this).text().replace(/\s|%|-/g, '').replace(/,/g, '.');
      });

      console.debug(spans);

      res.send({
        ticker: ticker,
        pvp: spans[64],
        dy: spans[56],
      });

    })
    .catch(function (err) {
      res.status(500);
      res.send({ error: err })
    });

});

module.exports = router;
