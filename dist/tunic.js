'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n\t\t(\n\t\t\t^[\t ]*\n\t\t\t', '\n\t\t\t[sS]*?\n\t\t\t', '\n\t\t\t[\r\n]*\n\t\t)\n\t'], ['\n\t\t(\n\t\t\t^[\\t ]*\n\t\t\t', '\n\t\t\t[\\s\\S]*?\n\t\t\t', '\n\t\t\t[\\r\\n]*\n\t\t)\n\t']),
    _templateObject2 = _taggedTemplateLiteral(['\n\t\t^[\t ]*\n\t\t', '\n\t\ts*?\n\t\t[\r\n]*\n\t\t(\n\t\t\t[sS]*?\n\t\t)\n\t\t[\r\n]*\n\t\ts*?\n\t\t', '\n\t\t[\r\n]*\n\t'], ['\n\t\t^[\\t ]*\n\t\t', '\n\t\t\\s*?\n\t\t[\\r\\n]*\n\t\t(\n\t\t\t[\\s\\S]*?\n\t\t)\n\t\t[\\r\\n]*\n\t\t\\s*?\n\t\t', '\n\t\t[\\r\\n]*\n\t']),
    _templateObject3 = _taggedTemplateLiteral(['\n\t\t^', '\n\t'], ['\n\t\t^', '\n\t']),
    _templateObject4 = _taggedTemplateLiteral(['\n\t\t', '\n\t\t', '\n\t\t', '\n\t\t', '\n\t\t', '\n\t'], ['\n\t\t', '\n\t\t', '\n\t\t', '\n\t\t', '\n\t\t', '\n\t']);

exports.default = tunic;

var _regx = require('regx');

var _regx2 = _interopRequireDefault(_regx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var AST_TYPE_DOCUMENTATION = 'Documentation';
var AST_TYPE_BLOCK = 'Block';
var AST_TYPE_COMMENT = 'Comment';
var AST_TYPE_COMMENT_TAG = 'Tag';
var AST_TYPE_CODE = 'Code';

var RX_LINES = /^/mg;
var RX_LINES_EMPTY = /^$/mg;
var RX_LINES_NEW = /\r?\n/g;
var RX_BRACES_ESCAPED = /\\([\{\}])/g;

var defaultOptions = {
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

var defaultNamedTags = ['arg', 'argument', 'class', 'exports', 'extends', 'imports', 'method', 'module', 'param', 'parameter', 'prop', 'property'];

// Utilities

function countMatches(str, rx) {
	return (String(str).match(rx) || []).length;
}

function memoize(fn) {
	var cache = new WeakMap();
	var nullKey = {};

	return function (obj) {
		var key = obj || nullKey;

		if (cache.has(key)) {
			return cache.get(key);
		}

		var value = fn(obj);

		cache.set(key, value);

		return value;
	};
}

var compileCommentMatcher = memoize(function (options) {
	options = _extends({}, defaultOptions, options);

	return (0, _regx2.default)('m')(_templateObject, options.open, options.close);
});

var compileCommentContentMatcher = memoize(function (options) {
	options = _extends({}, defaultOptions, options);

	return (0, _regx2.default)('m')(_templateObject2, options.open, options.close);
});

var compileIndentMatcher = memoize(function (options) {
	options = _extends({}, defaultOptions, options);

	return (0, _regx2.default)('gm')(_templateObject3, options.indent);
});

var compileTagMatcher = memoize(function (options) {
	options = _extends({}, defaultOptions, options);

	return (0, _regx2.default)('gm')(_templateObject4, options.tag, options.kind, options.name, options.delimiter, options.description);
});

function unwrapComment(comment, options) {
	var commentContentMatcher = compileCommentContentMatcher(options);
	var indentMatcher = compileIndentMatcher(options);
	var block = comment.replace(commentContentMatcher, '$1');

	while (block) {
		var lineCount = countMatches(block, RX_LINES);
		var emptyLineCount = countMatches(block, RX_LINES_EMPTY);
		var indentedLines = block.match(indentMatcher);

		if (!indentedLines || emptyLineCount + indentedLines.length !== lineCount) {
			break;
		}

		if (!indentedLines.reduce(function (a, b) {
			return a === b ? a : false;
		})) {
			break;
		}

		block = block.replace(indentMatcher, '');
	}

	return block;
}

// API

function tunic(defaults) {
	return {
		parse: function parse(doc, opts) {
			return createDocumentationNode(doc, _extends({}, defaults, opts));
		}
	};
}

function createDocumentationNode() {
	var documentation = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var options = arguments[1];

	var commentMatcher = compileCommentMatcher(options);

	var _documentation$split = documentation.split(commentMatcher);

	var _documentation$split2 = _toArray(_documentation$split);

	var firstBlock = _documentation$split2[0];

	var blocks = _documentation$split2.slice(1);

	// always lead with a comment


	if (firstBlock.trim()) {
		blocks.unshift('', firstBlock);
	}

	var blockNodes = [];
	var blockCount = blocks.length;
	var i = 0;
	var line = 1;

	while (i < blockCount) {
		var comment = blocks[i++];
		var code = blocks[i++];

		blockNodes.push(createBlockNode(comment, code, line, options));

		line += countMatches(comment + code, RX_LINES_NEW);
	}

	return {
		type: AST_TYPE_DOCUMENTATION,
		blocks: blockNodes
	};
}

function createBlockNode() {
	var comment = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var code = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	var line = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	var options = arguments[3];

	var commentLine = line;
	var codeLine = line + countMatches(comment, RX_LINES_NEW);

	return {
		type: AST_TYPE_BLOCK,
		comment: createCommentNode(comment, commentLine, options),
		code: createCodeNode(code, codeLine, options)
	};
}

function createCommentNode() {
	var comment = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var line = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	var options = arguments[2];

	var tagMatcher = compileTagMatcher(options);
	var tagNodes = [];

	function aggregateTags() {
		for (var _len = arguments.length, parts = Array(_len), _key = 0; _key < _len; _key++) {
			parts[_key] = arguments[_key];
		}

		tagNodes.push(createTagNode.apply(undefined, _toConsumableArray(parts.slice(1, -1)).concat([options])));

		return '';
	}

	comment = unwrapComment(comment, options).replace(tagMatcher, aggregateTags);

	return {
		type: AST_TYPE_COMMENT,
		description: comment,
		tags: tagNodes,
		line: line
	};
}

function createTagNode() {
	var tag = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var kind = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	var name = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
	var delimiter = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
	var description = arguments.length <= 4 || arguments[4] === undefined ? '' : arguments[4];
	var options = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];

	var namedTags = options.namedTags || defaultNamedTags;

	if (kind) {
		kind = kind.replace(RX_BRACES_ESCAPED, '$1');
	}

	if (name && !delimiter && namedTags.indexOf(tag) === -1) {
		description = [name, description].filter(function (x) {
			return x && x.trim();
		}).join(' ').trim();

		name = '';
	}

	return {
		type: AST_TYPE_COMMENT_TAG,
		tag: tag,
		kind: kind,
		name: name,
		description: description
	};
}

function createCodeNode() {
	var code = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var line = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	return {
		type: AST_TYPE_CODE,
		code: code,
		line: line
	};
}

Object.assign(tunic, {
	parse: createDocumentationNode,
	createDocumentationNode: createDocumentationNode,
	createBlockNode: createBlockNode,
	createCommentNode: createCommentNode,
	createTagNode: createTagNode,
	createCodeNode: createCodeNode
});
