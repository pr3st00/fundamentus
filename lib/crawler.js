const rp = require('request-promise').defaults({ jar: true });
var cloudscraper = require('cloudscraper-promise');
const NodeCache = require("node-cache");

const defaultTTL = 3600 * 24;

const cache = new NodeCache({ stdTTL: defaultTTL });

function crawler(key, url, getData, options) {

	return new Promise((resolve, reject) => {

		let cachedValue = cache.get(key);

		if (cachedValue) {
			console.debug("Returning value from cache");
			console.debug("Dumping keys: " + cache.keys());

			resolve(cachedValue);

			return;
		}

		const requestOptions = {
			url: url,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0'
			}
		};

		if (options && options.usecloudscraper) {
			console.log("Using cloudscrapper");

			cloudscraper.get(requestOptions.url, function (err, response, html) {
				if (err) {
					reject(err);
				} else {
					returnValue = getData(key, html);

					console.log("Saving cache");
					cache.set(key, returnValue);

					resolve(returnValue);
				}
			});
		}
		else {
			console.log("Using requestpromise");

			rp(requestOptions)
				.then(function (html) {
					returnValue = getData(key, html);

					console.log("Saving cache");
					cache.set(key, returnValue);

					resolve(returnValue);
				})
				.catch(function (err) {
					reject(err);
				});
		}
	});

};

module.exports = crawler;
