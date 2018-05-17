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

	let options = getOptions(args);

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


	Langdef(options)
		.then(function() {
			console.debug('DONE');
		},function (err) {
			console.error(err);
			require('../lib/ShowUsage')();
		});


};

main(process.argv);
