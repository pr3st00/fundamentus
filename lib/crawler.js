const rp = require('request-promise');
const $ = require('cheerio');
const NodeCache = require( "node-cache" );

const defaultTTL = 3600 * 24;

const cache = new NodeCache({ stdTTL: defaultTTL });

function crawler(ticker, url, getData) {
  
  return new Promise((resolve, reject) => {

		let cachedValue = cache.get(ticker);
		
		if (cachedValue) {
			console.debug("Returning value from cache");
			console.debug("Dumping keys: " + cache.keys());
			
			resolve(cachedValue);
			
			return;
		}

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

			console.debug("Returning value from web call: ");
			console.debug(spans);

			returnValue = getData(ticker, spans);

			console.log("Saving cache");
			cache.set(ticker,returnValue);

			resolve(returnValue);

		})
		.catch(function (err) {
			reject(err);
		});
  });
  
};

module.exports = crawler;
