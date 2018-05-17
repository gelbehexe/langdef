/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-17 13:52
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

/**
 *
 * @param {String} consoleAttrs
 * @return {{}}
 */
module.exports = function(consoleAttrs) {
	consoleAttrs += ''; // stringify

	const res = {};

	let parts = consoleAttrs.split(';');

	let pair,k,v;
	for (let ii=0; ii < parts.length; ii++) {
		pair = parts[ii].split('=',2);

		if (pair.length !== 2) {
			throw `Could not parse "${parts}"`
		}

		k = pair[0].trim();
		v = pair[1].trim();

		res[k] = v;
	}



	return res;
};