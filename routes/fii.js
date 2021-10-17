const express = require('express');
const router = express.Router();
const crawler = require('../lib/crawler.js');

const baseUrl = 'https://www.fundsexplorer.com.br/funds/';

router.get('/', function (req, res, next) {
  sendResponse(req.query.ticker, res);
});

router.get('/:ticker', function (req, res, next) {
  sendResponse(req.params.ticker, res);
});

function sendResponse(ticker, res) {
  const url = baseUrl + ticker;

  crawler(ticker, url, (ticker, spans) => {
    return {
      ticker: ticker,
      pvp: spans[spans.findIndex(e => e == "P/VP") + 1],
      dy: spans[spans.findIndex(e => e == "DividendYield") + 1],
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
