#!/usr/bin/env node
/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-14 09:28
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

const getOptions = require('../lib/GetOptions');

const main = function(args) {
	"use strict";

	let options;
	try {
		options = getOptions(args);
	} catch (e) {
		if (typeof e === 'object' && e.hasOwnProperty('message')) {
			console.error(e['message']);
		} else {
			console.error(e);
		}
		require('../lib/ShowUsage')();
		return;
	}

	if (options.hasOwnProperty('version')) {
		require('../lib/ShowVersion')();
		return;
	}

	if (options.hasOwnProperty('help')) {
		require('../lib/ShowUsage')();
		return;
	}

	if (options.hasOwnProperty('listenv')) {
		require('../lib/ListEnv')(options['listenv']);
		return;
	}

	if (options.hasOwnProperty('showenv')) {
		require('../lib/ShowEnv')(options['showenv']);
		return;
	}

	if (options.hasOwnProperty('extraFileAttrs')) {
		options['extraFileAttrs'] = require('../lib/ParseConsoleAttrs')(options['extraFileAttrs']);
	}


	const Langdef = require('../');

	const verbose = options.hasOwnProperty('verbose');

	const callback = verbose ?
		function(sourceFile,destFile) {
			console.log(`${destFile} written`);
		} :
		function() {};

	Langdef(options,callback)
		.then(function(sourceFile) {
			if (verbose) {
				console.log(`\t-> ${sourceFile} processed`);
			}
		},function (err) {
			console.error(err);
			require('../lib/ShowUsage')();
		});


};

main(process.argv);
