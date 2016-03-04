import rx from 'regx';
import {slashStarStar} from './commentStyles';
import {atCurlyDash} from './tagStyles';

const AST_TYPE_DOCUMENTATION = 'Documentation';
const AST_TYPE_BLOCK = 'Block';
const AST_TYPE_COMMENT = 'Comment';
const AST_TYPE_COMMENT_TAG = 'CommentTag';
const AST_TYPE_CODE = 'Code';

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
	options = options || {};
	options = {...slashStarStar, ...options.commentStyle};

	return rx('m')`
		${options.open}
		\s*?
		\n?
		(
			[\s\S]*?
		)
		\n?
		\s*?
		${options.close}
	`;
});

const compileIndentMatcher = memoize(options => {
	options = options || {};
	options = {...slashStarStar, ...options.commentStyle};

	return rx('m')`
		^
		${options.indent}
	`;
});

const compileTagMatcher = memoize(options => {
	options = options || {};
	options = {...atCurlyDash, ...options.tagStyle};

	return rx('gm')`
		${options.tag}
		${options.kind}
		${options.name}
		${options.delimiter}
		${options.description}
	`;
});

function unindentComment(comment, options) {
	if (!comment) {
		return comment;
	}

	const indentMatcher = compileIndentMatcher(options);
	const firstIndent = comment.match(indentMatcher);
	const indentLength = firstIndent && firstIndent[0].length;

	if (!indentLength) {
		return comment;
	}

	return comment
		.split('\n')
		.map(x => x.slice(indentLength))
		.join('\n');
}

// Parser

function createDocumentationNode(documentation = '', options) {
	const commentMatcher = compileCommentMatcher(options);
	const [firstBlock, ...blocks] = documentation
		.replace(/\r\n/g, '\n')
		.split(commentMatcher);

	// always lead with a comment
	if (firstBlock.trim()) {
		blocks.unshift('', firstBlock);
	}

	const blockNodes = [];
	const blockCount = blocks.length;
	let i = 0;

	while (i < blockCount) {
		const comment = blocks[i++];
		const code = blocks[i++];

		blockNodes.push(createBlockNode(comment, code, options));
	}

	return {
		type: AST_TYPE_DOCUMENTATION,
		blocks: blockNodes
	};
}

function createBlockNode(comment = '', code = '', options) {
	return {
		type: AST_TYPE_BLOCK,
		comment: createCommentNode(comment, options),
		code: createCodeNode(code, options)
	};
}

function createCommentNode(comment = '', options) {
	options = options || {};

	const tagMatcher = compileTagMatcher(options);
	const tagNodes = [];

	function extractTag(match, tag, kind, name, delimiter, description) {
		tagNodes.push(createCommentTagNode(tag, kind, name, delimiter, description, options));

		return '';
	}

	comment = unindentComment(comment, options);

	if (options.tagStyle !== false) {
		comment = comment.replace(tagMatcher, extractTag);
	}

	return {
		type: AST_TYPE_COMMENT,
		description: comment,
		tags: tagNodes
	};
}

function createCommentTagNode(tag = '', kind = '', name = '', delimiter = '', description = '', options) {
	options = options || {};

	const namedTags = options.namedTags || defaultNamedTags;

	if (name && !delimiter && namedTags.indexOf(tag) === -1) {
		description = [name, description]
			.filter(Boolean)
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

function createCodeNode(code = '') {
	return {
		type: AST_TYPE_CODE,
		code
	};
}

// API

export default function tunic(opts) {
	return {
		parse: doc => createDocumentationNode(doc, opts)
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
