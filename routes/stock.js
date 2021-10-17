const express = require('express');
const router = express.Router();
const crawler = require('../lib/crawler.js');

const baseUrl = 'http://www.fundamentus.com.br/detalhes.php?papel=';

router.get('/', function (req, res, next) {
  sendResponse(req.query.ticker, res);
});

router.get('/:ticker', function (req, res, next) {
  sendResponse(req.params.ticker, res);
});

function sendResponse(ticker, res) {
  const url = baseUrl + ticker;
  const cotacaoRegex = /Cota.*o/g;

  crawler(ticker, url, (ticker, spans) => {
    return {
      ticker: ticker,
      dy: spans[spans.findIndex(e => e == "Div.Yield") + 1],
      roe: spans[spans.findIndex(e => e == "ROE") + 1],
      roic: spans[spans.findIndex(e => e == "ROIC") + 1],
      eve: spans[spans.findIndex(e => e == "EV/EBITDA") + 1],
      pl: spans[spans.findIndex(e => e == "P/L") + 1],
      pvp: spans[spans.findIndex(e => e == "P/VP") + 1],
      lpa: spans[spans.findIndex(e => e == "LPA") + 1],
      price: spans[spans.findIndex(e => e.match(cotacaoRegex)) + 1],
    };
  })
    .then(function (returnValue) {
      res.send(returnValue);
    })
    .catch(function (err) {
      res.status(500);
      res.send({ error: err })
    });
}

module.exports = router;
