import requestPromise from 'request-promise';
const rp = requestPromise.defaults({ jar: true });
import pkg from 'cloudscraper-promise';
const { get } = pkg;
import NodeCache from "node-cache";

const NOT_FOUND_ERROR_CODE_REGEX = "4\\d{2}";
const NOT_FOUND_HTTTP_CODE = 404;

const defaultTTL = 3600 * 24;
const USE_CACHE = true;

const cache = new NodeCache({ stdTTL: defaultTTL });

function crawler(key, url, getData, options) {

	let cacheKey = key;

	if (options?.cachePrefix) {
		cacheKey = options.cachePrefix + ":" + cacheKey;
	}

	return new Promise((resolve, reject) => {

		let cachedValue = cache.get(cacheKey);

		if (cachedValue && USE_CACHE) {
			debug("Returning value from cache", options);
			debug("Dumping keys: " + cache.keys(), options);

			resolve(cachedValue);

			return;
		}

		const requestOptions = {
			url: url,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
			}
		};

		if (options?.usecloudscraper) {
			debug("Using cloudscrapper", options);

			get(requestOptions.url, function (err, response, html) {
				if (err) {
					reject(err);
				} else {
					if (response.statusCode && response.statusCode.toString().match(NOT_FOUND_ERROR_CODE_REGEX)) {
						reject(buildError("Not found", NOT_FOUND_HTTTP_CODE));
						return;
					}

					let returnValue = getData(key, html);

					if (!returnValue) {
						reject(buildError("Not found", NOT_FOUND_HTTTP_CODE));
						return;
					}

					debug("Saving cache", options);
					cache.set(cacheKey, returnValue);

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
					cache.set(cacheKey, returnValue);

					resolve(returnValue);
				})
				.catch(function (err) {
					reject(err);
				});
		}
	});

};

function buildError(message, statusCode) {
	let err = new Error(message);
	err.statusCode = statusCode;

	return err;
}

function debug(mesg, options) {
	if (options?.debug) {
		console.debug(mesg);
	}
}

export default crawler;