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

const defaultOptions = {
	// slash star
	open: /^[\t ]*\/\*\*/,
	close: /\*\//,
	indent: /[\t \*]/,

	// @tag {kind} name - description
	tag: /[\r\n]?[\t ]*@(\w+)[\t \-]*/,
	kind: /(?:\{(.*[^\\])?\})?[\t \-]*/,
	name: /(\[[^\]]*\]\*?|\S*)?[\t ]*/,
	delimiter: /(-?)[\t ]*/,
	description: /(.*(?:[\r\n]+[\t ]+.*)*)/
};

const defaultNamedTags = [
	'arg',
	'argument',
	'class',
	'exports',
	'extends',
	'imports',
	'method',
	'module',
	'param',
	'parameter',
	'prop',
	'property'
];

// Utilities

function countMatches(str, rx) {
	return (String(str).match(rx) || []).length;
}

function memoize(fn) {
	const cache = new WeakMap();
	const nullKey = {};

	return obj => {
		const key = obj || nullKey;

		if (cache.has(key)) {
			return cache.get(key);
		}

		const value = fn(obj);

		cache.set(key, value);

		return value;
	};
}

const compileCommentMatcher = memoize(options => {
	options = {...defaultOptions, ...options};

	return rx('m')`
		(
			^[\t ]*
			${options.open}
			[\s\S]*?
			${options.close}
			[\r\n]*
		)
	`;
});

const compileCommentContentMatcher = memoize(options => {
	options = {...defaultOptions, ...options};

	return rx('m')`
		^[\t ]*
		${options.open}
		\s*?
		[\r\n]*
		(
			[\s\S]*?
		)
		[\r\n]*
		\s*?
		${options.close}
		[\r\n]*
	`;
});

const compileIndentMatcher = memoize(options => {
	options = {...defaultOptions, ...options};

	return rx('gm')`
		^${options.indent}
	`;
});

const compileTagMatcher = memoize(options => {
	options = {...defaultOptions, ...options};

	return rx('gm')`
		${options.tag}
		${options.kind}
		${options.name}
		${options.delimiter}
		${options.description}
	`;
});

function unwrapComment(comment, options) {
	const commentContentMatcher = compileCommentContentMatcher(options);
	const indentMatcher = compileIndentMatcher(options);
	let block = comment.replace(commentContentMatcher, '$1');

	while (block) {
		const lineCount = countMatches(block, RX_LINES);
		const emptyLineCount = countMatches(block, RX_LINES_EMPTY);
		const indentedLines = block.match(indentMatcher);

		if (!indentedLines || emptyLineCount + indentedLines.length !== lineCount) {
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

export default function tunic(defaults) {
	return {
		parse: (doc, opts) => createDocumentationNode(doc, {
			...defaults,
			...opts
		})
	};
}

function createDocumentationNode(documentation = '', options) {
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

function createBlockNode(comment = '', code = '', line = 0, options) {
	const commentLine = line;
	const codeLine = line + countMatches(comment, RX_LINES_NEW);

	return {
		type: AST_TYPE_BLOCK,
		comment: createCommentNode(comment, commentLine, options),
		code: createCodeNode(code, codeLine, options)
	};
}

function createCommentNode(comment = '', line = 0, options) {
	const tagMatcher = compileTagMatcher(options);
	const tagNodes = [];

	function aggregateTags(...parts) {
		tagNodes.push(createCommentTagNode(...parts.slice(1, -1), options));

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

function createCommentTagNode(tag = '', kind = '', name = '', delimiter = '', description = '', options = {}) {
	const namedTags = options.namedTags || defaultNamedTags;

	if (kind) {
		kind = kind.replace(RX_BRACES_ESCAPED, '$1');
	}

	if (name && !delimiter && namedTags.indexOf(tag) === -1) {
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

function createCodeNode(code = '', line = 0) {
	return {
		type: AST_TYPE_CODE,
		code,
		line
	};
}

Object.assign(tunic, {
	parse: createDocumentationNode,
	createDocumentationNode,
	createBlockNode,
	createCommentNode,
	createCommentTagNode,
	createCodeNode
});
