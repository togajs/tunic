'use strict';

/**
 * # Tunic
 *
 * Generates an abstract syntax tree based on a customizable regular-expression
 * grammar. Defaults to C-style comment blocks, so it supports JavaScript, PHP,
 * C++, and even CSS right out of the box.
 *
 * Tags are parsed greedily. If it looks like a tag, it's a tag. What you do
 * with them is completely up to you. Render something human-readable, perhaps?
 */

var proto,
	Transform = require('stream').Transform,
	inherits = require('mtil/function/inherits'),
	mixin = require('mtil/object/mixin'),

	/** Line matching patterns. */
	matchLines = {
		any: /^/gm,
		edge: /^[\t ]*[\r\n]|[\r\n][\t ]*$/g,
		empty: /^$/gm,
		trailing: /^\s*[\r\n]+|[\r\n]+\s*$/g
	},

	/** Default options. */
	defaults = {
		extension: /.\w+$/,
		blockIndent: /^[\t \*]/gm,
		blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,
		blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,
		property: 'ast',
		tagParse: /^(\w+)[\t \-]*(\{[^\}]+\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t \-]*([\s\S]+)?$/m,
		tagSplit: /^[\t ]*@/m,

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

		/**
		 * Generates navigation object. Looks for `title`, `name`, and `parent`
		 * tags in the first comment of a file.
		 *
		 * @type {Function}
		 * @param {Vinyl} file
		 * @param {Object} ast
		 * @return {Object} Contains `title`, `name`, and `parent` values.
		 */
		makeNav: function (file, ast) {
			var tagNode,
				firstComment = ast.blocks[1],
				tags = firstComment && firstComment.tags,
				i = tags && tags.length,
				nav = {};

			// Visit each tag of the first comment block
			while (i--) {
				tagNode = tags[i];

				switch (tagNode.tag) {
					case 'title':
					case 'name':
					case 'parent': {
						// Copy value to nav object
						nav[tagNode.tag] = tagNode.description.trim();

						// Remove tag
						tags.splice(i, 1);
					}
				}
			}

			return nav;
		}
	};

/**
 * @class Tunic
 * @extends Transform
 *
 * @constructor
 * @param {Object} options
 * @param {RegExp} options.extension
 * @param {RegExp} options.blockIndent
 * @param {RegExp} options.blockParse
 * @param {RegExp} options.blockSplit
 * @param {Array.<String>} options.namedTags
 * @param {String} options.property
 * @param {RegExp} options.tagParse
 * @param {RegExp} options.tagSplit
 */
function Tunic(options) {
	if (!(this instanceof Tunic)) {
		return new Tunic(options);
	}

	/**
	 * @property options
	 * @type {Object}
	 */
	this.options = mixin({}, defaults, options);

	Transform.call(this, { objectMode: true });
}

proto = inherits(Tunic, Transform);

/**
 * Splits a chunk into blocks and generates root ast object.
 *
 * @method parse
 * @param {String} chunk
 * @return {Object}
 */
proto.parse = function (chunk) {
	var blocks = String(chunk)
		.split(this.options.blockSplit)
		.map(this.parseBlock.bind(this));

	return {
		type: 'Document',
		blocks: blocks
	};
};

/**
 * Determines whether to parse a block as a comment or as code.
 *
 * @method parseBlock
 * @param {String} block
 * @return {Object}
 */
proto.parseBlock = function (block) {
	if (this.options.blockParse.test(block)) {
		return this.parseComment(block);
	}

	return this.parseCode(block);
};

/**
 * Cleans up a code block and generates a Code ast node.
 *
 * @method parseCode
 * @param {String} code
 * @return {Object}
 */
proto.parseCode = function (code) {
	return {
		type: 'Code',
		contents: code.replace(matchLines.trailing, '')
	};
};

/**
 * Splits a comment block by tag and generates a Comment ast node.
 *
 * @method parseComment
 * @param {String} comment
 * @return {Object}
 */
proto.parseComment = function (comment) {
	var tags = this
		.unwrap(comment)
		.split(this.options.tagSplit);

	return {
		type: 'Comment',
		description: tags.shift(),
		tags: tags.map(this.parseTag.bind(this))
	};
};

/**
 * Splits a tag into its various bits and generates a Tag ast node.
 *
 * @method parseTag
 * @param {String} tag
 * @return {Object}
 */
proto.parseTag = function (tag) {
	var options = this.options,
		// Splits `@label {type} name - description`
		parts = String(tag).match(options.tagParse),
		label = parts[1],       // `@label` as `label`
		type = parts[2],        // `{type}` as `type`
		name = parts[3],        // name
		description = parts[4]; // description

	// Join `name` and `description` if this isn't a named tag
	if (name && options.namedTags.indexOf(label) === -1) {
		if (description) {
			description = name + ' ' + description;
		}
		else {
			description = name;
		}

		name = undefined;
	}

	return {
		tag: label,
		type: type,
		name: name,
		description: description
	};
};

/**
 * Strips open- and close-comment markers, then unindents a comment's content.
 *
 * @method unwrap
 * @param {String} block
 * @return {Object}
 */
proto.unwrap = function (block) {
	var lines,
		emptyLines,
		indentedLines,
		options = this.options,
		indent = options.blockIndent;

	// Trim comment wrappers
	block = String(block)
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
		if (!indentedLines || (emptyLines + indentedLines !== lines)) {
			break;
		}

		// Strip leading indent characters
		block = block.replace(indent, '');
	}

	return block;
};

/**
 * @method _transform
 * @param {String} file
 * @param {String} enc
 * @param {Function} cb
 */
proto._transform = function (file, enc, cb) {
	var ast,
		options = this.options,
		extension = options.extension;

	// Anything to do?
	if (file != null) {
		if (typeof file === 'string' || file instanceof Buffer) {
			// Parse string or buffer
			file = this.parse(file);
		}
		else if (file.contents != null && extension.test(file.path)) {
			// Parse Vinyl file
			ast = this.parse(file.contents);

			// Generate nav data
			ast.nav = options.makeNav(file, ast);

			// Store ast on file
			file[options.property] = ast;
		}
	}

	// Pass along
	this.push(file);

	// Done
	cb();
};

module.exports = Tunic;
