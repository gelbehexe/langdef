/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-14 09:14
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

/**
 *
 * @param overrideOptions
 * @param {function} [callback=undefined] - callback with parameters sourceFile, destFile, content
 *                                          returning a boolean value whether destination is handled
 *                                          if returning true, there is no write done any more
 * @return {Promise<string>} - resolves last processed filename
 */
module.exports = function parse(overrideOptions,callback) {
	"use strict";

	overrideOptions = overrideOptions || {};
	const options = require('./lib/MergedOptions').getMergedOptions(overrideOptions,true);

	return new Promise(function(resolve, reject) {
		if (!options.source) {
			reject("Source file not set");
			return;
		}

		if (!options.dest) {
			reject("Destination path not set");
			return;
		}

		const Reader = require('./lib/Reader');

		const error = function(err) {
			reject(err);
		};

		const writerCallback = function(result) {
			resolve(result);
		};

		const parserCallback = function(result) {

			const Writer = require('./lib/Writer');

			Writer(result,options,callback)
				.then(writerCallback,error);


		};

		// noinspection JSUnusedLocalSymbols
		const xreaderCallback = function(result) {
			const Parser = require('./lib/Parser');

			Parser(result,options)
				.then(parserCallback,error);

		};

		Reader(options.source)
			.then(readerCallback,error);

		function readerCallback(result) {
			const Parser = require('./lib/Parser');

			Parser(result,options)
				.then(parserCallback,error);
		}


	});



};
