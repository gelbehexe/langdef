/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-14 11:36
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

module.exports = function() {
	"use strict";

	require('./ShowVersion')();

	const optionList = require('./OptionDefinitions');

	const optionsDef =
		[
			{
				"header": "Options",
				"optionList": optionList,
			}
		];



	const usage = require('command-line-usage')(optionsDef);

	console.log(usage);

};