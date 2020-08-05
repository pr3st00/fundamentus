const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio');
const baseUrl = 'http://www.fundamentus.com.br/detalhes.php?papel=';

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
        dy: spans[spans.findIndex(e => e =="Div.Yield") + 1],
        roe: spans[spans.findIndex(e => e =="ROE") + 1],
        roic: spans[spans.findIndex(e => e =="ROIC") + 1],
        eve: spans[spans.findIndex(e => e =="EV/EBITDA") + 1],
        pl: spans[spans.findIndex(e => e =="P/L") + 1],
        pvp: spans[spans.findIndex(e => e =="P/VP") + 1],
        lpa: spans[spans.findIndex(e => e =="LPA") + 1],
      });

    })
    .catch(function (err) {
      res.status(500);
      res.send({ error: err })
    });

});

module.exports = router;
