/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

const Langdef = require('../');
Langdef({
	"source": __dirname+'/sample.langdef',
	"dest": __dirname+'/out',
	"hideDefault": false
},function(sourceFilename,destFilename,content) {
	console.info(`"${destFilename}" written`);
	return false;
})
	.then(function (res) {
		console.log(`Processed file "${res}"`);
	},function(err) {
		console.error(err);
	});