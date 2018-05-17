/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-14 11:31
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

module.exports = function() {
	"use strict";

	const versionsDef = [
		{
			"header": "Converter for '*.langdef' files",
			"content": "Converts '*.langdef' files to '*.xliff' files"
		},
		{
			"header": "Version",
			"content": require('../package.json').version
		}
	];

	const versionInfo = require('command-line-usage')(versionsDef);

	console.log(versionInfo);
};