import { Router } from 'express';
import { load } from 'cheerio';
import crawler from '../../lib/crawler.js';
import formatter from '../../lib/formatter.js';
import errorBuilder from '../../lib/errorBuilder.js';

const router = Router();

const BASE_URL = 'https://investidor10.com.br/fiis/';

const CACHE_PREFIX = "fii";

const NA = "N/A";
const ONE = "1.0";

const DY = "DY";
const SEGMENT = "SEGMENTO";
const PVP = "P/VP";
const PRICE = "Cotação";
const VALUE = "VAL. PATRIMONIAL";
const CNPJ = "CNPJ";
const VACANCY = "VACÂNCIA";
const TAX = "TAXA DE ADMIN";
const LAST_DIVIDEND = "ÚLTIMO RENDIMENTO";

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
  const url = BASE_URL + ticker;

  const options = {
    usecloudscraper: true,
    debug: false,
    cachePrefix: CACHE_PREFIX,
  }

  crawler(ticker, url, (ticker, html) => {
    let $ = load(html);

    let spans = [];
    let properties = 0;

    $('span').each(function (i, e) {
      spans[i] = $(this).text();
    });

    $('span.count').each(function (i, e) {
      properties += parseInt($(this).text());
    });

    let price = formatter.formatNumber(spans[spans.findIndex(e => e.match(PRICE)) + 1]);
    let last_dividend = formatter.formatNumber(spans[spans.findIndex(e => e.match(LAST_DIVIDEND)) + 1]);
    let vacancy = formatter.formatNumber(spans[spans.findIndex(e => e.match(VACANCY)) + 1]);
    let tax = spans[spans.findIndex(e => e.match(TAX)) + 1].split("%")[0];

    return {
      ticker: ticker,
      value: formatter.formatNumber(spans[spans.findIndex(e => e.match(VALUE)) + 1]),
      price: formatter.formatNumber(spans[spans.findIndex(e => e.match(PRICE)) + 1]),
      pvp: formatter.formatNumber(spans[spans.findIndex(e => e.match(PVP)) + 1]),
      dy: ((last_dividend / price) * 100).toFixed(2),
      dy12m: formatter.formatNumber(spans[spans.findIndex(e => e.match(DY)) + 1]),
      vacancy: (vacancy / 100).toFixed(2),
      tax: formatter.formatNumber(tax),
      sector: formatter.formatText(spans[spans.findIndex(e => e.match(SEGMENT)) + 1]),
      cnpj: formatter.formatText(spans[spans.findIndex(e => e.match(CNPJ)) + 1]),
      properties: properties.toString() || "N/A",
    };
  }, options)
    .then(function (returnValue) {
      res.send(returnValue);
    })
    .catch(function (err) {
      let statusCode = err.statusCode || 500;
      let errorMessage = statusCode == 404 ? "Ticker not found" : "Unexpected error";

      res.status(statusCode).send(errorBuilder.buildErrorResponse("Request failed", errorMessage));
    });
}

export default router;