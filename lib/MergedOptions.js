/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-15 16:50
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

/**
 *
 * @param {{}} options
 * @return {{}}
 * @private
 */
function _getMergedOptions(options) {


	const merge = require('deepmerge');

	const Sets = require('./Sets');

	const defaultSet = Sets.getSetConf('default');

	let envSet = {};
	if (options.hasOwnProperty('type')) {
		envSet = Sets.getSetConf(options['type']);
	}

	return merge.all([defaultSet,envSet,options]);
}


module.exports = {
	/**
	 *
	 * @param {{}} options
	 * @param {boolean} [forceReload=false]
	 * @return {{}}
	 */
	getMergedOptions: function(options,forceReload) {

		global.langdef = global.langdef || {};

		const prop = '_mergedOptions';

		if (forceReload || !global.langdef.hasOwnProperty(prop)) {
			global.langdef[prop] = _getMergedOptions(options);
		}

		return global.langdef[prop];
	}
};



