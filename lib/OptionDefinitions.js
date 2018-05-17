/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-15 08:54
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

/**
 *
 * @param {Array} optionsList
 * @return {Array}
 * @private
 */
function _normalizeOptionsList(optionsList) {
	for (let ii=0; ii<optionsList.length; ii++) {
		if (
			optionsList[ii].hasOwnProperty('type') &&
			(typeof optionsList[ii].type === 'string')
		) {
			let t;
			eval('t = '+optionsList[ii].type);
			//noinspection JSUnusedAssignment
			optionsList[ii].type = t;
		}
	}
	return optionsList;
}

/**
 *
 * @return {Array}
 * @private
 */
function _getOptionDefinitions() {
	"use strict";

	const optionsDefPath = require('path').resolve(__dirname+'/../defs/options.json');

	const optionsDefString = require('fs').readFileSync(optionsDefPath,'utf8')
		.replace('${SET_LIST}',require('./Sets').getSetOptList());

	const optionsDef = JSON.parse(optionsDefString);

	return _normalizeOptionsList(optionsDef);

}

/**
 * @return {Array}
 */
function getOptionDefinitions() {
	"use strict";

	global.langdef = global.langdef || {};

	const prop = '_optionDefintions';

	if (!global.langdef.hasOwnProperty(prop)) {
		global.langdef[prop] = _getOptionDefinitions();
	}

	return global.langdef[prop];
}

/**
 * @type {Array}
 */
module.exports = getOptionDefinitions();
