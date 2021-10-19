const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
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

  const options = { 
    usecloudscraper : false,
    debug : false, 
  }

  crawler(ticker, url, (ticker, html) => {
    let $ = cheerio.load(html);

    let price = $("#stock-price span").first().text().replace(/,/g, '.').replace(/ /g, '').replace(/R\$/g, '').replace(/\n/g, '');

    let spans = [];

    $('span').each(function (i, e) {
      spans[i] = $(this).text().replace(/\s|%|-/g, '').replace(/,/g, '.');
    });

    return {
      ticker: ticker,
      pvp: spans[spans.findIndex(e => e == "P/VP") + 1],
      dy: spans[spans.findIndex(e => e == "DividendYield") + 1],
      sector: spans[spans.findIndex(e => e == "Segmento") + 1],
      price: price,
    };
  })
    .then(function (returnValue) {
      res.send(returnValue);
    })
    .catch(function (err) {
      let statusCode = err.statusCode || 500;
      res.status(statusCode);
      console.error(err);

      let errorMessage = statusCode == 404 ? "Ticker not found" : "Unexpected error";

      res.send({ 
        message: "Request failed",
        error: errorMessage,
      });
    }, options);

}

module.exports = router;
