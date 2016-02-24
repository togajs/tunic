import rx from 'regx';

const AST_TYPE_DOCUMENTATION = 'Documentation';
const AST_TYPE_BLOCK = 'Block';
const AST_TYPE_COMMENT = 'Comment';
const AST_TYPE_COMMENT_TAG = 'CommentTag';
const AST_TYPE_CODE = 'Code';

const RX_LINES = /^/mg;
const RX_LINES_EMPTY = /^$/mg;
const RX_LINES_NEW = /\r?\n/g;
const RX_BRACES_ESCAPED = /\\([\{\}])/g;

// Utilities

function compileCommentMatcher(options = {}) {
	const open = options.open || /^[\t ]*\/\*\*/;
	const close = options.close || /\*\//;

	return rx('m')`
		(
			^[\t ]*
			${open}
			[\s\S]*?
			${close}
			[\r\n]*
		)
	`;
}

function compileCommentContentMatcher(options = {}) {
	const open = options.open || /^[\t ]*\/\*\*/;
	const close = options.close || /\*\//;

	return rx('m')`
		^[\t ]*
		${open}
		\s*?
		[\r\n]*
		(
			[\s\S]*?
		)
		[\r\n]*
		\s*?
		${close}
		[\r\n]*
	`;
}

function compileIndentMatcher(options = {}) {
	const indent = options.indent || /[\t \*]/;

	return rx('gm')`
		^${indent}
	`;
}

function compileTagMatcher(options = {}) {
	const tag = options.tag || /[\r\n]?[\t ]*@(\w+)[\t \-]*/;
	const kind = options.kind || /(?:\{(.*[^\\])?\})?[\t \-]*/;
	const name = options.name || /(\[[^\]]*\]\*?|\S*)?[\t ]*/;
	const delimiter = options.delimiter || /(-?)[\t ]*/;
	const description = options.description || /(.*(?:[\r\n]+[\t ]+.*)*)/;

	return rx('gm')`
		${tag}
		${kind}
		${name}
		${delimiter}
		${description}
	`;
}

function countMatches(str = '', rx = /./g) {
	return (String(str).match(rx) || []).length;
}

function unwrapComment(comment = '', options = {}) {
	const commentContentMatcher = compileCommentContentMatcher(options);
	const indentMatcher = compileIndentMatcher(options);
	let block = comment.replace(commentContentMatcher, '$1');

	while (block) {
		const lines = block.match(RX_LINES) || [];
		const emptyLines = block.match(RX_LINES_EMPTY) || [];
		const indentedLines = block.match(indentMatcher);

		if (!indentedLines || emptyLines.length + indentedLines.length !== lines.length) {
			break;
		}

		if (!indentedLines.reduce((a, b) => a === b ? a : false)) {
			break;
		}

		block = block.replace(indentMatcher, '');
	}

	return block;
}

// API

export function parse(documentation = '', options) {
	return createDocumentationNode(documentation, options);
}

export function createDocumentationNode(documentation = '', options) {
	const commentMatcher = compileCommentMatcher(options);
	const [firstBlock, ...blocks] = documentation.split(commentMatcher);

	// always lead with a comment
	if (firstBlock.trim()) {
		blocks.unshift('', firstBlock);
	}

	const blockNodes = [];
	const blockCount = blocks.length;
	let i = 0;
	let line = 1;

	while (i < blockCount) {
		const comment = blocks[i++];
		const code = blocks[i++];

		blockNodes.push(createBlockNode(comment, code, line, options));

		line += countMatches(comment + code, RX_LINES_NEW);
	}

	return {
		type: AST_TYPE_DOCUMENTATION,
		blocks: blockNodes
	};
}

export function createBlockNode(comment = '', code = '', line = 0, options) {
	const commentLine = line;
	const codeLine = line + countMatches(comment, RX_LINES_NEW);

	return {
		type: AST_TYPE_BLOCK,
		comment: createCommentNode(comment, commentLine, options),
		code: createCodeNode(code, codeLine, options)
	};
}

export function createCommentNode(comment = '', line = 0, options) {
	const tagMatcher = compileTagMatcher(options);
	const tagNodes = [];

	function aggregateTags(tag, ...parts) {
		tagNodes.push(createCommentTagNode(...parts, options));

		return '';
	}

	comment = unwrapComment(comment, options)
		.replace(tagMatcher, aggregateTags);

	return {
		type: AST_TYPE_COMMENT,
		description: comment,
		tags: tagNodes,
		line
	};
}

export function createCommentTagNode(tag = '', kind = '', name = '', delimiter = '', description = '') {
	if (kind) {
		kind = kind.replace(RX_BRACES_ESCAPED, '$1');
	}

	if (name && !delimiter) {
		description = [name, description]
			.filter(x => x && x.trim())
			.join(' ')
			.trim();

		name = '';
	}

	return {
		type: AST_TYPE_COMMENT_TAG,
		tag,
		kind,
		name,
		description
	};
}

export function createCodeNode(code = '', line = 0) {
	return {
		type: AST_TYPE_CODE,
		code,
		line
	};
}
