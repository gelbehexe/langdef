/*
 * @copyright Copyright MIT
 *
 * @see LICENSE
 */

/**
 *
 * @since 2018-05-16 11:13
 * @author Petra Arentzen
 *
 * @package langdef
 *
 **/

/**
* @typedef {{}} ParserResult
* @property {String} encoding
* @property {{}} fileTagAttributes
* @property {{}} translations
* @property {{}} langKeys
* @property {{}} sourceIds
* @property {[]} orderedIds
*/

/**
 *
 * @param {String} content
 * @param {{}} options
 * @return {Promise<ParserResult>}
 */
module.exports = function(content,options) {
	return new Promise(function(resolve, reject) {

		const Entities = require('html-entities').AllHtmlEntities;

		const entities = new Entities();

		let uniqId = 0;

		/**
		 *
		 * @type {ParserResult}
		 */
		const result = {
			encoding: 'ascii',
			fileTagAttributes: {},
			/**
			 * @type {{}}
			 */
			translations: {},
			langKeys: {},
			sourceIds: {},
			orderedIds: []
		};

		let failure = null;

		/**
		 *
		 * @param {String} langKey
		 * @param {String} id
		 * @param {String} value
		 * @param {boolean} [useIdAsSource=false]
		 * @private
		 */
		const _addTranslation = function(langKey,id,value,useIdAsSource) {
			try {
				if (result.orderedIds.indexOf(id) === -1) {
					result.orderedIds.push(id);
				}

				if (!result.translations.hasOwnProperty(langKey)) {
					result.translations[langKey] = {};
				}

				if (result.translations[langKey].hasOwnProperty(id)) {
					const context_prefix = `[${options.source}] `;

					console.warn(`${context_prefix}Duplicate entry for id "${id}" langkey "${langKey}"`)
				}
				result.translations[langKey][id] = entities.decode(value);
				result.langKeys[langKey] = true;

				if (useIdAsSource) {
					result.sourceIds[id] = true;
				}
			} catch (e) {
				failure = e;
			}
		};

		/**
		 * @param {String} id
		 * @param {String} value
		 * @param {boolean} [useIdAsSource=false]
		 * @private
		 */
		const _addDefaultTranslation = function(id,value,useIdAsSource) {
			_addTranslation('_default',id,value,useIdAsSource);
		};

		/**
		 *
		 * @param node
		 * @private
		 */
		const _extractLangid = function(node) {
			const res = _extractAttribute(node,'id');

			if (res === null) {
				if (options.useIdForSource) {
					return ''+(++uniqId);
				}
				throw "Missing attribute 'id'";
			}

			return res;

		};

		const _extractAttribute = function(node,attrName) {
			if (
				!node.hasOwnProperty('attributes') ||
				!node.attributes.hasOwnProperty(attrName)
			) {
				return null;
			}

			return node.attributes[attrName];
		};

		/**
		 *
		 * @param node
		 * @private
		 */
		const _extractTextValue = function(node) {
			for(let ii=0; ii < node.children.length; ii++) {
				if (node.children[ii].type === "text") {
					return node.children[ii].value;
				}
			}

			return "";
		};


		try {
			const XmlReader = require('xml-reader');

			const options = {
				stream: false,
				parentNodes: true,
				tagPrefix: '',
				doneEvent: 'done',
				emitTopLevelOnly: false,
			};

			const xmlReader = XmlReader.create(options);

			const _parseFileNode = function(node) {
				if (!node.hasOwnProperty('attributes')) {
					return;
				}
				for(const k in node.attributes) {
					//noinspection JSUnfilteredForInLoop
					result.fileTagAttributes[k] = node.attributes[k];
				}
			};


			xmlReader.on('tag',function(name,node) {
				if (failure) {
					return;
				}
				try {
					if (name === 'langDef') {
						return;
					}
					if (name === 'file') {
						_parseFileNode(node);
						return;
					}

					if (name === 'entry') {
						const id = _extractLangid(node);

						const useIdAsSource = !!parseInt(_extractAttribute(node,'useIdAsSource'));

						for (let ii=0; ii < node.children.length; ii++) {
							const child = node.children[ii];
							if (child.name === 'source') {
								//noinspection JSUnfilteredForInLoop
								_addDefaultTranslation(id,_extractTextValue(child),useIdAsSource);
								continue;
							}

							//noinspection JSUnfilteredForInLoop
							if (child.name === 'translations') {

								for (let jj=0; jj < child.children.length; jj++) {
									const subchild = child.children[jj];
									if (subchild.type === 'element') {
										_addTranslation(subchild.name,id,_extractTextValue(subchild),false);
									}
								}

							}
						}

					}

				} catch (e) {
					failure = e;
				}
			});



			xmlReader.on('error',function() {
				reject(failure);
			});

			xmlReader.on('done',function() {
				resolve(result);
			});

			xmlReader.parse(content);

		} catch (e) {
			reject(e);
		}


	});
};