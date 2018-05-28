/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-16 11:56
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/


/**
 *
 * @param {ParserResult} parserResult
 * @param {{}} options
 * @param {function} [callback=undefined]
 * @return {Promise<string>} - resolves last source file
 */
module.exports = function(parserResult,options,callback) {

	return new Promise(function(resolve, reject) {

		const fs = require('fs');
		const dateFormat = require('date-format');
		const XMLWriter = require('xml-writer');

		const pd  = require('pretty-data').pd;
		const Path = require('path');

		const Entities = require('html-entities').AllHtmlEntities;

		const entities = new Entities();

		/**
		 *
		 * @return {{}}
		 * @private
		 */
		const _getXliffAttributes = function() {
			const result = {};

			let v;
			if ((v = options.xliffVersion)) {
				result['version'] = v;
			}

			if ((v = options.namespace)) {
				result['xmlns'] = v;
			}

			return result;
		};

		/**
		 *
		 * @param {String} dateStr
		 * @param {String} langkey
		 * @return {{}}
		 * @private
		 */
		const _getFileAttributes = function(dateStr,langkey) {
			const result = {};

			if (options.copyFileAttributes) {
				// let copyFileAttributes;
				let orgFileAttributes = parserResult.fileTagAttributes;
				for (const k in orgFileAttributes) {
					if (k === 'date') {
						continue;
					}
					//noinspection JSUnfilteredForInLoop
					result[k] = orgFileAttributes[k];
				}
			}

			if (!options.noDate) {
				result['date'] = dateStr;
			}

			if (options.addSourceLang) {
				result['source-language'] = options.defaultLocale;
			}

			if (options.addTargetLang) {
				result['target-language'] = langkey === '_default' ?
					options.defaultLocale :
					langkey;
			}

			result['datatype'] = 'plaintext';

			for (const k in options.extraFileAttrs) {
				//noinspection JSUnfilteredForInLoop
				result[k] = options.extraFileAttrs[k];
			}

			return result;
		};

		/**
		 *
		 * @param {XMLWriter} xmlWriter
		 * @param {{}} attributes
		 * @private
		 */
		const _addAttributes = function(xmlWriter,attributes) {
			if (!Object.keys(attributes).length) {
				return;
			}

			for (const k in attributes) {
				xmlWriter.writeAttribute(k,attributes[k]);
			}
		};

		/**
		 *
		 * @param {XMLWriter} xmlWriter
		 * @param {String} text
		 * @private
		 */
		const _addText = function(xmlWriter,text) {
			const escapedText = entities.encode(text);
			if (escapedText === text) {
				xmlWriter.text(text);
			} else {
				xmlWriter.startCData().write(text);
				xmlWriter.endCData();
				// xmlWriter.writeCData(text);
			}
		};

		/**
		 * @param {XMLWriter} xmlWriter
		 * @param {String} id
		 * @param {String} source
		 * @param {String} [target]
		 * @param {boolean} [useIdAsSource=false]
		 * @private
		 */
		const _addEntry = function(xmlWriter,id,source,target,useIdAsSource) {
			"use strict";

			xmlWriter.startElement('trans-unit');
			xmlWriter.writeAttribute('id',id);

			xmlWriter.startElement('source');
			_addText(xmlWriter,(useIdAsSource ? id : source));
			xmlWriter.endElement(); // source

			if (target) {
				xmlWriter.startElement('target');
				if (options.extraTargetAttrs && Object.keys(options.extraTargetAttrs).length) {
					for (let x in options.extraTargetAttrs) {
						//noinspection JSUnfilteredForInLoop
						xmlWriter.writeAttribute(x,options.extraTargetAttrs[x]);
					}
				}
				_addText(xmlWriter,target);
				xmlWriter.endElement(); // target
			}

			xmlWriter.endElement(); // trans-unit
		};

		/**
		 *
		 * @param {String} langkey
		 * @return {String}
		 * @private
		 */
		const _getTargetFilename = function(langkey) {
			"use strict";

			const sourceExtname = Path.extname(options.source);

			const basename = Path.basename(options.source,sourceExtname);

			let reallangkey;
			if (langkey === '_default') {
				if (options.hideDefault) {
					return basename + '.' + options.extension;
				}
				reallangkey = options.defaultLocale;
			} else {
				reallangkey = langkey;
			}

			//noinspection JSUnresolvedVariable
			const langBasename = options.pos === 'prepend' ?
				reallangkey + '.' + basename :
				basename + '.' + reallangkey;

			return langBasename + '.' + options.extension;

		};


		/**
		 *
		 * @param {String} destination
		 * @param {String} langkey
		 * @return {String}
		 * @private
		 */
		const _getDestfilepath = function(destination,langkey) {
			"use strict";

			return Path.resolve(destination,_getTargetFilename(langkey));
		};

		/**
		 *
		 * @param {String} dateStr
		 * @param {String} destination
		 * @param {String} langkey
		 * @private
		 */
		const _writeLanguage = function(dateStr,destination,langkey) {
			"use strict";

			const xmlWriter = new XMLWriter();

			xmlWriter.startDocument("1.0","utf-8",true);
			xmlWriter.startElement('xliff');
			_addAttributes(xmlWriter,_getXliffAttributes());

			xmlWriter.startElement('file');

			_addAttributes(xmlWriter,_getFileAttributes(dateStr,langkey));

			if (options.header) {
				xmlWriter.startElement('header');
				xmlWriter.endElement();
			}
			xmlWriter.startElement('body');

			// let counterId = 1;

			const translations = parserResult.translations[langkey];


			const forceTarget = options.forceTarget;

			if (langkey === '_default') {
				for(let ii=0; ii<parserResult.orderedIds.length; ii++) {
					const id = parserResult.orderedIds[ii];
					if (!translations.hasOwnProperty(id)) {
						continue;
					}

					const target = forceTarget ?
						translations[id] :
						false;

					const source =
						parserResult.sourceIds.hasOwnProperty(id) ?
							id : translations[id];


					_addEntry(xmlWriter,id,source,target);
				}
			} else {
				const orgTranslations = parserResult.translations['_default'];
				for(let ii=0; ii<parserResult.orderedIds.length; ii++) {
					const id = parserResult.orderedIds[ii];
					if (!translations.hasOwnProperty(id)) {
						continue;
					}

					const source =
						parserResult.sourceIds.hasOwnProperty(id) ?
							id : orgTranslations[id];


					_addEntry(xmlWriter,id,source,translations[id]);

				}
			}

			xmlWriter.endElement(); // body
			xmlWriter.endElement(); // file
			xmlWriter.endElement(); // xliff

			xmlWriter.endDocument();

			const destFilename = _getDestfilepath(destination,langkey);

			const formattedXmlStr = pd.xml(xmlWriter.toString())
				.replace(/>\s+(<!\[CDATA\[.*?\]\]>)\s+<\//g,'>$1</'); // replace additional linefeed before and after CDATA


			let destFileHandled = (typeof callback === 'function') ?
				(callback(options.source,destFilename,formattedXmlStr) === true) :
				false;

			if (!destFileHandled) {
				const fs = require('fs');

				fs.writeFileSync(destFilename,formattedXmlStr);
			}
		};


		/**
		 *
		 * @param {String} dest
		 * @return {String}
		 * @private
		 */
		const _resolveDestinationPath = function(dest) {
			let curpath = require('./AbsoluteFilename').get(options.source);
			curpath = Path.dirname(curpath);
			if (curpath === '/') {
				throw "Could not work on root path";
			}

			/**
			 * @var {String}
			 */
			let resolvedPath;

			if (!(resolvedPath = Path.resolve(curpath,dest))) {
				throw `Could resolve destination path "${dest}"`
			}
			if (!fs.existsSync(resolvedPath)) {
				throw `Destination path "${resolvedPath}" does not exist`
			}

			return resolvedPath;

		};

		try {
			let dateStr = dateFormat.asString('yyyy-MM-ddThh:mm:ssZ',new Date());

			let destination = _resolveDestinationPath(options.dest);

			for(const langKey in parserResult.langKeys) {
				// noinspection JSUnfilteredForInLoop
				_writeLanguage(dateStr,destination,langKey);
			}

			resolve(options.source);
		} catch (e) {
			reject(e);
		}

	});



};

