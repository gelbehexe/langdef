/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-15 09:19
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/


/**
 * Lists sets
 */
module.exports = function() {
	"use strict";

	const Sets = require('./Sets');

	const sets = Sets.getSetList();

	sets.unshift('default');

	const def = [];

	for (let ii=0; ii < sets.length; ii++) {
		def.push({
			"header": sets[ii],
			"content": Sets.getLabel(sets[ii])
		});
	}

	const info = require('command-line-usage')(def);

	console.log(info);

};