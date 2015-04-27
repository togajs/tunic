/**
 * # Tunic
 *
 * Generates an abstract syntax tree (AST) based on a customizable regular-
 * expression grammar. Defaults to C-style comment blocks, so it supports
 * JavaScript, PHP, C++, and even CSS right out of the box.
 *
 * Tags are parsed greedily. If it looks like a tag, it's a tag. What you do
 * with them is completely up to you. Render something human-readable, perhaps?
 *
 * @title Tunic
 * @name tunic
 */

import mixin from 'mtil/object/mixin';
import { Transform } from 'stream';

/**
 * @class Tunic
 * @extends Stream.Transform
 */
export class Tunic extends Transform {
	/**
	 * @constructor
	 * @param {Object} options
	 * @param {RegExp} options.blockIndent
	 * @param {RegExp} options.blockParse
	 * @param {RegExp} options.blockSplit
	 * @param {RegExp} options.extension
	 * @param {Function(Vinyl,Object)} options.navMaker
	 * @param {Array.<String>} options.namedTags
	 * @param {String} options.property
	 * @param {RegExp} options.tagParse
	 * @param {RegExp} options.tagSplit
	 */
	constructor(options = {}) {
		super({ objectMode: true });

		/**
		 * @property options
		 * @type {Object}
		 */
		this.options = mixin({}, Tunic.defaults, options);
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
			options = this.options,
			extension = options.extension;

		if (typeof file === 'string' || file instanceof Buffer) {
			// Parse string or buffer
			file = this.parse(file);
		}

		if (file.contents != null && extension.test(file.path)) {
			// Parse Vinyl file
			ast = this.parse(file.contents);

			// Generate nav data
			ast.nav = options.navMaker(file, ast);

			// Store ast on file
			file[options.property] = ast;
		}

		this.push(file);

		return cb();
	}

	/**
	 * Generates navigation object. Looks for `title`, `name`, and `parent` tags
	 * in the first comment of a file.
	 *
	 * @method navMaker
	 * @param {Vinyl} file Vinyl file being parsed.
	 * @param {Object} ast Toga AST.
	 * @return {Object} Contains `title`, `name`, and `parent` values.
	 * @static
	 */
	static navMaker(file, ast) {
		var tagNode,
			blocks = ast && ast.blocks,
			firstComment = blocks && blocks[1],
			tags = firstComment && firstComment.tags,
			i = tags && tags.length,
			nav = {};

		// Visit each tag of the first comment block
		while (i--) {
			tagNode = tags[i];

			switch (tagNode.tag) {
				case 'title':
					// falls through

				case 'name':
					// falls through

				case 'parent': {
					// Copy value to nav object
					nav[tagNode.tag] = tagNode.description.trim();

					// Remove tag from block
					tags.splice(i, 1);
				}

				// no default
			}
		}

		return nav;
	}

	/**
	 * @method factory
	 * @param {Object} options
	 * @return {Tunic}
	 */
	static factory(options) {
		return new Tunic(options);
	}
}

/**
 * Default options.
 *
 * @property defaults
 * @type {Object.<String,RegExp>}
 * @static
 */
Tunic.defaults = {
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
	],

	navMaker: Tunic.navMaker
};

/**
 * Line matching patterns.
 *
 * @property matchLines
 * @type {Object.<String,RegExp>}
 * @static
 */
Tunic.matchLines = {
	/** Matches any newline. */
	any: /^/gm,

	/** Matches empty lines. */
	empty: /^$/gm,

	/** Matches any trailing whitespace including newlines. */
	trailing: /^\s*[\r\n]+|[\r\n]+\s*$/g,

	/** Matches outermost whitespace including first and last newlines. */
	edge: /^[\t ]*[\r\n]|[\r\n][\t ]*$/g
};

export default Tunic.factory;
