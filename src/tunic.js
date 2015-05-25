/**
 * # Tunic
 *
 * A base parser for [Toga](http://togajs.con) documentation. Generates an
 * abstract syntax tree based on a customizable regular-expression grammar.
 *
 * @title Tunic
 * @name tunic
 */

import { Transform } from 'stream';

/**
 * @class Tunic
 * @extends Stream.Transform
 */
export default class Tunic extends Transform {
	/**
	 * @property {Object} options
	 */
	options = null;

	/**
	 * Default options.
	 *
	 * @property {Object} defaults
	 * @static
	 */
	static defaults = {
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
		namedTags: [
			'module',
			'imports',
			'exports',
			'class',
			'extends',
			'method',
			'arg',
			'argument',
			'param',
			'parameter',
			'prop',
			'property'
		]
	};

	/**
	 * Line matching patterns.
	 *
	 * @property {Object} matchLines
	 */
	static matchLines = {
		/** Matches any newline. */
		any: /^/gm,

		/** Matches empty lines. */
		empty: /^$/gm,

		/** Matches any trailing whitespace including newlines. */
		trailing: /^\s*[\r\n]+|[\r\n]+\s*$/g,

		/** Matches outermost whitespace including first and last newlines. */
		edge: /^[\t ]*[\r\n]|[\r\n][\t ]*$/g
	};

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
	constructor(options) {
		super({ objectMode: true });

		this.options = { ...Tunic.defaults, ...options };
	}

	/**
	 * Splits a chunk into blocks and generates root ast object.
	 *
	 * @method parse
	 * @param {String} chunk
	 * @return {Object}
	 */
	parse(chunk) {
		var blocks = String(chunk)
			.split(this.options.blockSplit)
			.map(this.parseBlock.bind(this));

		return {
			type: 'Document',
			blocks: blocks
		};
	}

	/**
	 * Determines whether to parse a block as a comment or as code.
	 *
	 * @method parseBlock
	 * @param {String} block
	 * @return {Object}
	 */
	parseBlock(block) {
		if (this.options.blockParse.test(block)) {
			return this.parseComment(block);
		}

		return this.parseCode(block);
	}

	/**
	 * Cleans up a code block and generates a Code ast node.
	 *
	 * @method parseCode
	 * @param {String} codeBlock
	 * @return {Object}
	 */
	parseCode(codeBlock) {
		var matchLines = Tunic.matchLines;

		return {
			type: 'Code',
			contents: codeBlock.replace(matchLines.trailing, '')
		};
	}

	/**
	 * Splits a comment block by tag and generates a Comment ast node.
	 *
	 * @method parseComment
	 * @param {String} commentBlcok
	 * @return {Object}
	 */
	parseComment(commentBlock) {
		var tags = this
			.unwrap(commentBlock)
			.split(this.options.tagSplit);

		return {
			type: 'Comment',
			description: tags.shift(),
			tags: tags.map(this.parseTag.bind(this))
		};
	}

	/**
	 * Splits a tag into its various bits and generates a Tag ast node.
	 *
	 * @method parseTag
	 * @param {String} tagBlock
	 * @return {Object}
	 */
	parseTag(tagBlock) {
		var options = this.options,

			// Splits `@label {type} name - description`
			parts = tagBlock.match(options.tagParse),

			tag = parts[1],         // `@tag` as `tag`
			type = parts[2],        // `{type}` as `type`
			name = parts[3],        // name
			description = parts[4]; // description

		// Join `name` and `description` if this isn't a named tag
		if (name && options.namedTags.indexOf(tag) === -1) {
			description = description
				? name + ' ' + description
				: name;

			name = undefined;
		}

		return { tag, type, name, description };
	}

	/**
	 * Strips open- and close-comment markers, then unindents a comment's content.
	 *
	 * @method unwrap
	 * @param {String} block
	 * @return {Object}
	 */
	unwrap(block) {
		var lines, emptyLines, indentedLines,
			matchLines = Tunic.matchLines,
			options = this.options,
			indent = options.blockIndent;

		// Trim comment wrappers
		block = block
			.replace(options.blockParse, '$1')
			.replace(matchLines.edge, '');

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

	/**
	 * @method _transform
	 * @param {String} file
	 * @param {String} enc
	 * @param {Function} cb
	 */
	_transform(file, enc, cb) {
		var ast,
			{ extension, property } = this.options;

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
}

