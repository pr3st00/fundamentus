const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio');
const baseUrl = 'http://www.fundamentus.com.br/detalhes.php?papel=';

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
        dy: spans[104],
        roe: spans[107],
        roic: spans[99],
        eve: spans[112],
        pl: spans[48],
        pvp: spans[56],
      });

    })
    .catch(function (err) {
      res.status(500)
      res.send({ error: err })
    });

});

module.exports = router;
