const rp = require('request-promise').defaults({ jar: true });
const cloudscraper = require('cloudscraper-promise');
const NodeCache = require("node-cache");

const defaultTTL = 3600 * 24;
const USE_CACHE = true;

const cache = new NodeCache({ stdTTL: defaultTTL });

function crawler(key, url, getData, options) {

	return new Promise((resolve, reject) => {

		let cachedValue = cache.get(key);

		if (cachedValue && USE_CACHE) {
			debug("Returning value from cache", options);
			debug("Dumping keys: " + cache.keys(), options);

			resolve(cachedValue);

			return;
		}

		const requestOptions = {
			url: url,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0'
			}
		};

		if (options?.usecloudscraper) {
			debug("Using cloudscrapper", options);

			cloudscraper.get(requestOptions.url, function (err, response, html) {
				if (err) {
					reject(err);
				} else {
					let returnValue = getData(key, html);

					debug("Saving cache", options);
					cache.set(key, returnValue);

					resolve(returnValue);
				}
			});
		}
		else {
			debug("Using requestpromise", options);

			rp(requestOptions)
				.then(function (html) {
					let returnValue = getData(key, html);

					debug("Saving cache", options);
					cache.set(key, returnValue);

					resolve(returnValue);
				})
				.catch(function (err) {
					reject(err);
				});
		}
	});

};

function debug(mesg, options) {
	if (options?.debug) {
		console.debug(mesg);
	}
}

module.exports = crawler;