/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-14 10:54
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

module.exports = {

	/**
	 *
	 * @param {string} str
	 * @return {string}
	 */
	lcfirst: function(str) {
		"use strict";

		return str.substr(0,1).toLowerCase()+str.substr(1);
	},

	/**
	 *
	 * @param {string} str
	 * @return {string}
	 */
	ucfirst: function(str) {
		"use strict";

		return str.substr(0,1).toUpperCase()+str.substr(1);
	},

	/**
	 *
	 * @param {string} str
	 * @return {string}
	 */
	upperCamelize: function(str) {
		"use strict";

		const tmpArr = str.split(/[^a-zA-Z]/);

		for (let ii=0; ii<tmpArr.length; ii++) {
			tmpArr[ii] = this.ucfirst(tmpArr[ii]);
		}

		return tmpArr.join('');

	},

	/**
	 *
	 * @param {string} str
	 * @return {string}
	 */
	lowerCamelize: function(str) {
		"use strict";

		return this.lcfirst(this.upperCamelize(str));

	}
};
