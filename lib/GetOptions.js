/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-15 09:05
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

const commandLineArgs = require('command-line-args');

const StringHelper = require('../lib/StringHelper');

const _camelizeOpts = function(args) {
	"use strict";

	const result = [];
	let m;
	for (let ii=0; ii < args.length; ii++) {
		if (
			((m = args[ii].match(/^(-{1,2})(.*?)(=.*|)$/)) !== null) &&
			m.length
		) {
			result.push(m[1]+StringHelper.lowerCamelize(m[2])+m[3]);
		}
	}
	return result;


};

/**
 *
 * @param {[]} args
 * @return {{}}
 */
module.exports = function (args) {

	args = _camelizeOpts(args);

	let optionsDefinitions = require('../lib/OptionDefinitions');

	return commandLineArgs(optionsDefinitions,args);
};