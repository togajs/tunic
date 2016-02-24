/**
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

import * as defaultOptions from './grammars/javascript';

const astTypeDocumentation = 'Documentation';
const astTypeBlock = 'CommentBlock';
const astTypeTag = 'CommentBlockTag';
const whitespacePatterns = {
	/** Matches any line. */
	line: /^.*$/gm,

	/** Matches empty lines. */
	emptyLine: /^$/gm,

	/** Matches any surrounding whitespace, including newlines. */
	surrounding: /^\s*[\r\n]+|[\r\n]+\s*$/g
};

/**
 * Regular-expression runner and match counter.
 *
 * @param {?String} str
 * @param {RegExp} rx
 * @return {Number}
 */
function countMatches(str, rx) {
	const matches = String(str).match(rx);

	return matches && matches.length || 0;
}

/**
 * Creates a new options object based on defaults and overrides.
 *
 * @method normalizeOptions
 * @param {?Object} options - Parsing options.
 * @return {Object} Normalizes options.
 */
export function normalizeOptions(options) {
	return {...defaultOptions, ...options};
}

/**
 * Splits a string of code into blocks and generates the root AST node.
 *
 * @method parse
 * @param {String} code - Code to parse.
 * @param {?Object} options - Parsing options.
 * @return {Object} DocTree AST.
 */
export function parse(code = '', options) {
	const {blockSplit} = normalizeOptions(options);
	const [firstBlock, ...blocks] = String(code).split(blockSplit);

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
export function parseBlocks(blocks = [], options) {
	const commentNodes = [];
	const length = blocks.length;
	let i = 0;

	for (; i < length; i += 2) {
		commentNodes.push(parseComment(
			blocks[i],
			blocks[i + 1],
			options
		));
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
export function parseComment(commentBlock = '', codeBlock = '', options) {
	const {tagSplit} = normalizeOptions(options);
	const [description, ...tags] = unwrap(commentBlock).split(tagSplit);

	return {
		type: astTypeBlock,
		description,
		trailingCode: codeBlock.replace(whitespacePatterns.surrounding, ''),
		tags: tags.map(tag => parseTag(tag, options))
	};
}

/**
 * Splits a tag into its various bits and generates a tag AST node.
 *
 * @method parseTag
 * @param {?String} tagBlock
 * @return {Object}
 */
export function parseTag(tagBlock = '', options) {
	const {namedTags, tagParse} = normalizeOptions(options);
	const tagBlockSegments = tagBlock.match(tagParse) || [];
	const tag = tagBlockSegments[1] || '';
	let kind = tagBlockSegments[2] || '';
	let name = tagBlockSegments[3] || '';
	const delimiter = tagBlockSegments[4] || '';
	let description = tagBlockSegments[5] || '';

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
		description = [name, description]
			.filter(x => x && x.trim())
			.join(' ')
			.trim();

		name = '';
	}

	return {
		type: astTypeTag,
		tag,
		kind,
		name,
		description
	};
}

/**
 * Strips open and close markers and unindents the content of a comment.
 *
 * @method unwrap
 * @param {?String} block
 * @return {Object}
 */
export function unwrap(commentBlock = '', options) {
	const {blockIndent, blockParse} = normalizeOptions(options);
	let lines;
	let emptyLines;
	let indentedLines;

	// Trim comment wrappers
	commentBlock = commentBlock
		.replace(blockParse, '$1')
		.replace(whitespacePatterns.surrounding, '');

	// Total line count
	lines = countMatches(commentBlock, whitespacePatterns.line);

	// Attempt to unindent
	while (lines > 0) {
		// Empty line count
		emptyLines = countMatches(commentBlock, whitespacePatterns.emptyLine);

		// Indented line count
		indentedLines = countMatches(commentBlock, blockIndent);

		// Only continue if every line is still indented
		if (!indentedLines || emptyLines + indentedLines !== lines) {
			break;
		}

		// Strip leading indent characters
		commentBlock = commentBlock.replace(blockIndent, '');
	}

	return commentBlock;
}
