const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const crawler = require('../../lib/crawler.js');
const formatter = require('../../lib/formatter.js');
const errorBuilder = require('../../lib/errorBuilder.js');

const baseUrl = 'https://www.fundsexplorer.com.br/funds/';

const CACHE_PREFIX = "fii";

const NA = "N/A";
const PVP = "P/VP";
const SEGMENT = "Segmento";
const DY = /DY.*Dividendo/;
const PRICE = /Cota.*atual/;

router.get('/', function (req, res, next) {
  if (!req.query.ticker) {
    return res.status(400).send(errorBuilder.buildMissingParameterResponse("ticker"));
  }

  sendResponse(req.query.ticker, res);
});

router.get('/:ticker', function (req, res, next) {
  sendResponse(req.params.ticker, res);
});

function sendResponse(ticker, res) {
  ticker = ticker.toLowerCase();
  const url = baseUrl + ticker;

  const options = {
    usecloudscraper: true,
    debug: false,
    cachePrefix: CACHE_PREFIX,
  }

  crawler(ticker, url, (ticker, html) => {
    let $ = cheerio.load(html);

    let properties = $("#fund-actives-chart-info-wrapper span").first().text().replace(/ativos/g, '').replace(/ /g, '');

    let p = [];

    $('p').each(function (i, e) {
      p[i] = $(this).text();
    });

    return {
      ticker: ticker,
      pvp: formatter.formatNumber(p[p.findIndex(e => e == PVP) + 1]),
      dy: formatter.formatNumber(p[p.findIndex(e => e.match(DY)) + 1]),
      price: formatter.formatNumber(p[p.findIndex(e => e.match(PRICE)) - 1]),
      sector: formatter.formatText(p[p.findIndex(e => e == SEGMENT) + 1]),
      properties: properties || NA,
    };
  })
    .then(function (returnValue) {
      res.send(returnValue);
    })
    .catch(function (err) {
      let statusCode = err.statusCode || 500;
      console.error(err);

      let errorMessage = statusCode == 404 ? "Ticker not found" : "Unexpected error";

      res.status(statusCode).send(errorBuilder.buildErrorResponse("Request failed", errorMessage));
    }, options);

}

module.exports = router;