'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * # Tunic
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * A documentation-block parser. Generates a [DocTree][doctree] abstract syntax
                                                                                                                                                                                                                                                                   * tree based on a customizable regular-expression grammar. Defaults to parsing
                                                                                                                                                                                                                                                                   * C-style comment blocks, so it supports C, C++, Java, JavaScript, PHP, and
                                                                                                                                                                                                                                                                   * even CSS right out of the box.
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * [doctree]: https://github.com/togajs/doctree
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * @module tunic
                                                                                                                                                                                                                                                                   */

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.normalizeOptions = normalizeOptions;
exports.parse = parse;
exports.parseBlocks = parseBlocks;
exports.parseComment = parseComment;
exports.parseTag = parseTag;
exports.unwrap = unwrap;

var _c = require('./grammars/c');

var defaultOptions = _interopRequireWildcard(_c);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var astTypeDocumentation = 'Documentation';
var astTypeBlock = 'CommentBlock';
var astTypeTag = 'CommentBlockTag';
var whitespacePatterns = {
	/** Matches any line start. */
	line: /^/gm,

	/** Matches empty lines. */
	emptyLine: /^$/gm,

	/** Matches any surrounding whitespace, including newlines. */
	surrounding: /^\s*[\r\n]+|[\r\n]+\s*$/g
};

/**
 * Creates a new options object based on defaults and overrides.
 *
 * @method normalizeOptions
 * @param {?Object} options - Parsing options.
 * @return {Object} Normalizes options.
 */
function normalizeOptions(options) {
	return _extends({}, defaultOptions, options);
}

/**
 * Splits a string of code into blocks and generates the root AST node.
 *
 * @method parse
 * @param {String} code - Code to parse.
 * @param {?Object} options - Parsing options.
 * @return {Object} DocTree AST.
 */
function parse() {
	var code = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var options = arguments[1];

	var _normalizeOptions = normalizeOptions(options);

	var blockSplit = _normalizeOptions.blockSplit;

	var _String$split = String(code).split(blockSplit);

	var _String$split2 = _toArray(_String$split);

	var firstBlock = _String$split2[0];

	var blocks = _String$split2.slice(1);

	/**
  * The blocks array should always start with a code block. If that block is
  * empty, we can skip it. Otherwise we need an empty comment block to own
  * the code block as trailing code.
  */

	if (firstBlock && firstBlock.trim()) {
		blocks.unshift('', firstBlock);
	}

	/**
  * The blocks array is guaranteed to start with a comment now, so we may
  * proceed with parsing and generate the root DocTree AST node.
  */
	return {
		type: astTypeDocumentation,
		blocks: parseBlocks(blocks, options)
	};
}

/**
 * Accepts an alternating list of comment blocks and code blocks, pairs them
 * together, and creates a list of DocTree CommentBlock nodes.

 * @method parseBlocks
 * @param {?Array.<String>} blocks
 * @param {?Object} options - Parsing options.
 * @return {Array}
 */
function parseBlocks() {
	var blocks = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	var options = arguments[1];

	var commentNodes = [];
	var length = blocks.length;
	var i = 0;

	for (; i < length; i += 2) {
		commentNodes.push(parseComment(blocks[i], blocks[i + 1], options));
	}

	return commentNodes;
}

/**
 * Splits a comment block by tags and generates a Doctree CommentBlock AST node.
 *
 * @method parseComment
 * @param {?String} commentBlock
 * @param {?String} codeBlock
 * @param {?Object} options - Parsing options.
 * @return {Object}
 */
function parseComment() {
	var commentBlock = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var codeBlock = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	var options = arguments[2];

	var _normalizeOptions2 = normalizeOptions(options);

	var tagSplit = _normalizeOptions2.tagSplit;

	var _unwrap$split = unwrap(commentBlock).split(tagSplit);

	var _unwrap$split2 = _toArray(_unwrap$split);

	var description = _unwrap$split2[0];

	var tags = _unwrap$split2.slice(1);

	return {
		type: astTypeBlock,
		description: description,
		trailingCode: codeBlock.replace(whitespacePatterns.surrounding, ''),
		tags: tags.map(function (tag) {
			return parseTag(tag, options);
		})
	};
}

/**
 * Splits a tag into its various bits and generates a tag AST node.
 *
 * @method parseTag
 * @param {?String} tagBlock
 * @return {Object}
 */
function parseTag() {
	var tagBlock = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var options = arguments[1];

	var _normalizeOptions3 = normalizeOptions(options);

	var namedTags = _normalizeOptions3.namedTags;
	var tagParse = _normalizeOptions3.tagParse;

	var tagBlockSegments = tagBlock.match(tagParse) || [];

	var tag = tagBlockSegments[1] || '';
	var kind = tagBlockSegments[2] || '';
	var name = tagBlockSegments[3] || '';
	var delimiter = tagBlockSegments[4] || '';
	var description = tagBlockSegments[5] || '';

	/**
  * The kind may contain escaped curly braces, so we should clean up the
  * leading back-slashes.
  */
	kind = kind.replace(/\\([\{\}])/g, '$1');

	/**
  * The regular expression needs help to know if a tag is supposed to
  * have a name segment. In some cases the name is really just the first
  * word of the description, so we merge them back together.
  */
	if (name && !delimiter && !namedTags.includes(tag)) {
		description = [name, description].filter(function (x) {
			return x && x.trim();
		}).join(' ').trim();

		name = '';
	}

	return {
		type: astTypeTag,
		tag: tag,
		kind: kind,
		name: name,
		description: description
	};
}

/**
 * Strips open- and close-comment markers and unindents the content.
 *
 * @method unwrap
 * @param {?String} block
 * @return {Object}
 */
function unwrap() {
	var commentBlock = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var options = arguments[1];

	var _normalizeOptions4 = normalizeOptions(options);

	var blockIndent = _normalizeOptions4.blockIndent;
	var blockParse = _normalizeOptions4.blockParse;

	var lines = undefined;
	var emptyLines = undefined;
	var indentedLines = undefined;

	// Trim comment wrappers
	commentBlock = commentBlock.replace(blockParse, '$1').replace(whitespacePatterns.surrounding, '');

	// Total line count
	lines = commentBlock.match(whitespacePatterns.line).length;

	// Attempt to unindent
	while (lines > 0) {
		// Empty line count
		emptyLines = (commentBlock.match(whitespacePatterns.emptyLine) || []).length;

		// Indented line count
		indentedLines = (commentBlock.match(blockIndent) || []).length;

		// Only continue if every line is still indented
		if (!indentedLines || emptyLines + indentedLines !== lines) {
			break;
		}

		// Strip leading indent characters
		commentBlock = commentBlock.replace(blockIndent, '');
	}

	return commentBlock;
}