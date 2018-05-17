/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-16 11:20
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

const fs = require('fs');

/**
 *
 * @param {string} source - filename
 * @return {Promise<string>}
 */
module.exports = function(source) {

	return new Promise(function (resolve, reject) {

		const absSource = require('./AbsoluteFilename').get(source);

		fs.readFile(absSource,{encoding: 'utf8', flag: 'r'},function(err,result) {
			if (err) {
				reject(err);
				return;
			}

			resolve(result);
		});
	});
};