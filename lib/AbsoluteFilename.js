/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-16 12:19
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

module.exports = {
	/**
	 * returns absolute path from path
	 * @param {string} filename
	 * @return {string}
	 */
	get: function(filename) {
		const path = require('path');

		if (path.isAbsolute(filename)) {
			return filename;
		}

		if (filename.substr(0,1) !== '.') {
			filename = './'+filename;
		}

		return path.resolve(process.cwd(),filename);

	}
};
