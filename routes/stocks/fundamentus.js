const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const crawler = require('../../lib/crawler.js');

const baseUrl = 'http://www.fundamentus.com.br/detalhes.php?papel=';

const CACHE_PREFIX = "stock";

router.get('/', function (req, res, next) {
  sendResponse(req.query.ticker, res);
});

router.get('/:ticker', function (req, res, next) {
  sendResponse(req.params.ticker, res);
});

function sendResponse(ticker, res) {
  const url = baseUrl + ticker;
  const cotacaoRegex = /Cota.*o/g;

  const options = {
    usecloudscraper: true,
    debug: false,
    cachePrefix: CACHE_PREFIX,
  }

  crawler(ticker, url, (ticker, html) => {
    let $ = cheerio.load(html);

    if ($('h1:contains("Nenhum papel encontrado")').text()) {
      return null;
    }

    let spans = [];

    $('span').each(function (i, e) {
      spans[i] = $(this).text().replace(/\s|%|-/g, '').replace(/,/g, '.');
    });

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
  }, options)
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
    });
}

module.exports = router;