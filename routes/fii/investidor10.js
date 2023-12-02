const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const crawler = require('../../lib/crawler.js');
const formatter = require('../../lib/formatter.js');

const baseUrl = 'https://investidor10.com.br/fiis/';

const NA = "N/A";
const ONE = "1.0";

const DY = "DY";
const SEGMENT = "SEGMENTO";
const PVP = "P/VP";
const PRICE = "Cotação";
const VALUE = "VAL. PATRIMONIAL";
const CNPJ = "CNPJ";

router.get('/', function (req, res, next) {
  sendResponse(req.query.ticker, res);
});

router.get('/:ticker', function (req, res, next) {
  sendResponse(req.params.ticker, res);
});

function sendResponse(ticker, res) {
  const url = baseUrl + ticker;

  const options = {
    usecloudscraper: true,
    debug: false,
  }

  crawler(ticker, url, (ticker, html) => {
    let $ = cheerio.load(html);

    let properties = NA;
    let spans = [];

    $('span').each(function (i, e) {
      spans[i] = $(this).text();
    });

    let price = formatter.formatNumber(spans[spans.findIndex(e => e.match(PRICE)) + 1]);
    let last_dividend = formatter.formatNumber(spans[spans.findIndex(e => e.match("ÚLTIMO RENDIMENTO")) + 1]);

    return {
      ticker: ticker,
      value: formatter.formatNumber(spans[spans.findIndex(e => e.match(VALUE)) + 1]),
      price: formatter.formatNumber(spans[spans.findIndex(e => e.match(PRICE)) + 1]),
      pvp: formatter.formatNumber(spans[spans.findIndex(e => e.match(PVP)) + 1]),
      dy: ((last_dividend / price) * 100).toFixed(2),
      dy12m: formatter.formatNumber(spans[spans.findIndex(e => e.match(DY)) + 1]),
      sector: formatter.formatText(spans[spans.findIndex(e => e.match(SEGMENT)) + 1]),
      cnpj: formatter.formatText(spans[spans.findIndex(e => e.match(CNPJ)) + 1]),
      properties: properties || NA,
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