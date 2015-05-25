/**
 * # Tunic
 *
 * A base parser for [Toga](http://togajs.con) documentation. Generates an
 * abstract syntax tree based on a customizable regular-expression grammar.
 *
 * @title Tunic
 * @name tunic
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _stream = require('stream');

/**
 * @class Tunic
 * @extends Stream.Transform
 */

var Tunic = (function (_Transform) {

	/**
  * @constructor
  * @param {Object} options
  * @param {RegExp} options.blockIndent
  * @param {RegExp} options.blockParse
  * @param {RegExp} options.blockSplit
  * @param {RegExp} options.extension
  * @param {Array.<String>} options.namedTags
  * @param {String} options.property
  * @param {RegExp} options.tagParse
  * @param {RegExp} options.tagSplit
  */

	function Tunic(options) {
		_classCallCheck(this, Tunic);

		_get(Object.getPrototypeOf(Tunic.prototype), 'constructor', this).call(this, { objectMode: true });

		this.__initializeProperties();

		this.options = _extends({}, Tunic.defaults, options);
	}

	_inherits(Tunic, _Transform);

	_createClass(Tunic, [{
		key: 'parse',

		/**
   * Splits a chunk into blocks and generates root ast object.
   *
   * @method parse
   * @param {String} chunk
   * @return {Object}
   */
		value: function parse(chunk) {
			var blocks = String(chunk).split(this.options.blockSplit).map(this.parseBlock.bind(this));

			return {
				type: 'Document',
				blocks: blocks
			};
		}
	}, {
		key: 'parseBlock',

		/**
   * Determines whether to parse a block as a comment or as code.
   *
   * @method parseBlock
   * @param {String} block
   * @return {Object}
   */
		value: function parseBlock(block) {
			if (this.options.blockParse.test(block)) {
				return this.parseComment(block);
			}

			return this.parseCode(block);
		}
	}, {
		key: 'parseCode',

		/**
   * Cleans up a code block and generates a Code ast node.
   *
   * @method parseCode
   * @param {String} codeBlock
   * @return {Object}
   */
		value: function parseCode(codeBlock) {
			var matchLines = Tunic.matchLines;

			return {
				type: 'Code',
				contents: codeBlock.replace(matchLines.trailing, '')
			};
		}
	}, {
		key: 'parseComment',

		/**
   * Splits a comment block by tag and generates a Comment ast node.
   *
   * @method parseComment
   * @param {String} commentBlcok
   * @return {Object}
   */
		value: function parseComment(commentBlock) {
			var tags = this.unwrap(commentBlock).split(this.options.tagSplit);

			return {
				type: 'Comment',
				description: tags.shift(),
				tags: tags.map(this.parseTag.bind(this))
			};
		}
	}, {
		key: 'parseTag',

		/**
   * Splits a tag into its various bits and generates a Tag ast node.
   *
   * @method parseTag
   * @param {String} tagBlock
   * @return {Object}
   */
		value: function parseTag(tagBlock) {
			var options = this.options,
			   

			// Splits `@label {type} name - description`
			parts = tagBlock.match(options.tagParse),
			    tag = parts[1],
			    // `@tag` as `tag`
			type = parts[2],
			    // `{type}` as `type`
			name = parts[3],
			    // name
			description = parts[4]; // description

			// Join `name` and `description` if this isn't a named tag
			if (name && options.namedTags.indexOf(tag) === -1) {
				description = description ? name + ' ' + description : name;

				name = undefined;
			}

			return { tag: tag, type: type, name: name, description: description };
		}
	}, {
		key: 'unwrap',

		/**
   * Strips open- and close-comment markers, then unindents a comment's content.
   *
   * @method unwrap
   * @param {String} block
   * @return {Object}
   */
		value: function unwrap(block) {
			var lines,
			    emptyLines,
			    indentedLines,
			    matchLines = Tunic.matchLines,
			    options = this.options,
			    indent = options.blockIndent;

			// Trim comment wrappers
			block = block.replace(options.blockParse, '$1').replace(matchLines.edge, '');

			// Total line count
			lines = block.match(matchLines.any).length;

			// Attempt to unindent
			while (lines > 0) {
				// Empty line count
				emptyLines = (block.match(matchLines.empty) || []).length;

				// Indented line count
				indentedLines = (block.match(indent) || []).length;

				// Only continue if every line still starts with an indent character
				if (!indentedLines || emptyLines + indentedLines !== lines) {
					break;
				}

				// Strip leading indent characters
				block = block.replace(indent, '');
			}

			return block;
		}
	}, {
		key: '_transform',

		/**
   * @method _transform
   * @param {String} file
   * @param {String} enc
   * @param {Function} cb
   */
		value: function _transform(file, enc, cb) {
			var ast;var _options = this.options;
			var extension = _options.extension;
			var property = _options.property;

			if (typeof file === 'string' || file instanceof Buffer) {
				return cb(null, this.parse(file));
			}

			if (!file || file.isAsset || !extension.test(file.path)) {
				return cb(null, file);
			}

			// Parse Vinyl file
			ast = this.parse(file.contents);

			// Store ast on file
			file[property] = ast;

			cb(null, file);
		}
	}, {
		key: '__initializeProperties',
		value: function __initializeProperties() {
			this.options = null;
		}
	}], [{
		key: 'defaults',

		/**
   * Default options.
   *
   * @property {Object} defaults
   * @static
   */
		value: {
			/** The name of this plugin. */
			name: 'tunic',

			/** The name of the property in which to store the AST. */
			property: 'ast',

			/** Matches any file extension. */
			extension: /.\w+$/,

			/** Matches allowed indention characters. */
			blockIndent: /^[\t \*]/gm,

			/** Splits code blocks from documentation blocks. */
			blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,

			/** Parses documentation blocks. */
			blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,

			/** Splits tags on leading `@` symbols. */
			tagSplit: /^[\t ]*@/m,

			/** Parses `@tag {type} name - Description.` chunks. */
			tagParse: /^(\w+)[\t \-]*(\{[^\}]+\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t \-]*([\s\S]+)?$/m,

			/** Which tags have a `name` in addition to a `description`. */
			namedTags: ['module', 'imports', 'exports', 'class', 'extends', 'method', 'arg', 'argument', 'param', 'parameter', 'prop', 'property']
		},
		enumerable: true
	}, {
		key: 'matchLines',

		/**
   * Line matching patterns.
   *
   * @property {Object} matchLines
   */
		value: {
			/** Matches any newline. */
			any: /^/gm,

			/** Matches empty lines. */
			empty: /^$/gm,

			/** Matches any trailing whitespace including newlines. */
			trailing: /^\s*[\r\n]+|[\r\n]+\s*$/g,

			/** Matches outermost whitespace including first and last newlines. */
			edge: /^[\t ]*[\r\n]|[\r\n][\t ]*$/g
		},
		enumerable: true
	}]);

	return Tunic;
})(_stream.Transform);

exports['default'] = Tunic;
module.exports = exports['default'];

/**
 * @property {Object} options
 */