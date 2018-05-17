/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-15 10:38
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

const Sets = require('./Sets');
const Chalk = require('chalk');

/**
 * 
 * @return {{}}
 * @private
 */
const _getOptionDescriptions = function() {
	"use strict";

	/**
	 * @type {Array}
	 */
	const optionDefs = require('./OptionDefinitions');

	let res = {};

	let optionDef;
	for(let ii=0;ii<optionDefs.length; ii++) {
		optionDef = optionDefs[ii];
		res[optionDef.name] = optionDef.description || '';
	}

	return res;
};

/**
 *
 * @return {{}}
 */
function getOptionDescriptions() {

	global.langdef = global.langdef || {};

	const prop = '_optionDescriptions';

	if (!global.langdef.hasOwnProperty(prop)) {
		global.langdef[prop] = _getOptionDescriptions();
	}



	return global.langdef[prop];
}

module.exports = function(setName) {
	"use strict";

	setName = setName || "default";

	console.log(Chalk.underline.bold(setName));

	console.log("\t%s",Sets.getLabel(setName));

	const optionDescriptions = getOptionDescriptions();

	let optList = Sets.getSetConf();

	let lname = 0;
	let lvalue = 0;


	let name;

	let buf = [];
	for(name in optList) {
		if (!optList.hasOwnProperty(name)) {
			continue;
		}

		if (name === 'destType') {
			continue;
		}

		if (name.length > lname) {
			lname = name.length;
		}

		let v = JSON.stringify(optList[name])+'';

		if (v.length > lvalue) {
			lvalue = v.length;
		}

		buf.push([name,v,optionDescriptions[name] || 'undefined'])

	}

	let lform_name = Chalk.bold('x').length - 1;
	let lform_value = Chalk.blue('x').length - 1;

	let lines = ["\n"+Chalk.bold.underline('Parameters')+"\n"];

	for (let ii=0; ii < buf.length; ii++) {
		lines.push(
			"  " +
			Chalk.bold(buf[ii][0]) +
			"".padEnd(lname - buf[ii][0].length + lform_name)+
			Chalk.blue(buf[ii][1]) +
			"".padEnd(lname - buf[ii][1].length + lform_value)+
			Chalk.gray(buf[ii][2])
		);
	}

	console.log(lines.join("\n")+"\n");

};