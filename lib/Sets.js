/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-15 09:28
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

const Path = require('path');

function _getSetsPath() {
	return Path.resolve(__dirname+'/../sets');
}

function _getSetList() {
	"use strict";

	let sets = [];

	const path = require("path");

	const rawSets = require("fs").readdirSync(_getSetsPath(), 'utf8');

	let filename;
	for (let ii = 0; ii < rawSets.length; ii++) {
		filename = rawSets[ii];
		if (filename.substr(0, 1) === '_') {
			continue;
		}

		if (path.extname(filename) !== '.json') {
			continue;
		}

		sets.push(path.basename(filename, '.json'));
	}

	return sets;
}

/**
 *
 * @return {[]}
 */
function getSetList() {
	"use strict";

	global.langdef = global.langdef || {};

	const prop = '_setList';

	if (!global.langdef.hasOwnProperty(prop)) {
		global.langdef[prop] = _getSetList();
	}

	return global.langdef[prop];
}

/**
 *
 * @param {String} setName
 * @return {boolean}
 */
function hasSet(setName) {
	"use strict";

	return getSetList().indexOf(setName) > -1;
}

function _getSetSettings(setName) {
	"use strict";

	const defPath = Path.resolve(__dirname+'/../defs/defaults.json');

	let settings = require(defPath);

	let setSettings;

	setName = setName || 'default';

	if (setName === 'default') {
		setSettings = {
			'label': 'Default settings',
			'conf': settings,
		};
	} else {
		if (hasSet(setName)) {
			const tmpSettings = require(_getSetsPath()+'/'+setName+'.json');

			const merge = require('deepmerge');

			setSettings = {
				'label': tmpSettings['label'],
				'conf': merge.all([settings,tmpSettings['conf']])
			};

		} else {
			setSettings = {
				'label': 'Set "'+setName+'" not found - displaying default settings',
				'conf': settings,
			};
		}
	}

	return setSettings;
}

function getSetSettings(setName) {
	"use strict";

	global.langdef = global.langdef || {};

	const prop = '_set_'+setName;

	if (!global.langdef.hasOwnProperty(prop)) {
		global.langdef[prop] = _getSetSettings(setName);
	}

	return global.langdef[prop];
}

module.exports = {
	hasSet: hasSet,
	getSetOptList: function() {
		"use strict";

		const sets = getSetList();

		if (!sets.length) {
			return '';
		}

		return '<' + sets.join('|') + '>';
	},
	getSetList: getSetList,
	getLabel: function(setName) {
		"use strict";
		const settings = getSetSettings(setName);

		return settings.hasOwnProperty('label') ?
			settings['label'] :
			'Missing property "label" for "'+setName+'"';

	},
	getSetConf: function(setName) {
		"use strict";

		const settings = getSetSettings(setName);

		if (!settings.hasOwnProperty("conf")) {
			throw 'Missing propery "conf" for "'+setName+'"';
		}

		return settings['conf'];
	}
};