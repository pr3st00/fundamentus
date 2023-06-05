const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const crawler = require('../lib/crawler.js');

const baseUrl = 'https://www.fundsexplorer.com.br/funds/';

const NA  = "N/A";
const PVP = "P/VP";
const SEGMENT = "Segmento";
const DY = /DY.*Dividendo/;
const PRICE = /Cota.*atual/;

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

    let price = $("#headerTicker__content__price div").first().text().replace(/,/g, '.').replace(/ /g, '').replace(/R\$/g, '').replace(/\n/g, '');
    let properties = $("#fund-actives-chart-info-wrapper span").first().text().replace(/ativos/g,'').replace(/ /g,'');

    let p = [];

    $('p').each(function (i, e) {
      p[i] = $(this).text();
    });

    return {
      ticker: ticker,
      pvp: 		formatNumber(p[p.findIndex(e => e == PVP) + 1]),
      dy:  		formatNumber(p[p.findIndex(e => e.match(DY)) + 1]),
      price: 		formatNumber(p[p.findIndex(e => e.match(PRICE)) - 1]),
      sector: 		formatText(p[p.findIndex(e => e == SEGMENT) + 1]),
      properties: 	properties || NA,
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

function formatText(value) {
	return value;
}

function formatNumber(value) {
	return value.replace(/\s|%|-/g, '').replace(/,/g, '.').replace(/R\$/g, '');
}

module.exports = router;
