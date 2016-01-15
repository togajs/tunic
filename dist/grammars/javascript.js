'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _c = require('./c');

Object.defineProperty(exports, 'blockIndent', {
	enumerable: true,
	get: function get() {
		return _c.blockIndent;
	}
});
Object.defineProperty(exports, 'blockSplit', {
	enumerable: true,
	get: function get() {
		return _c.blockSplit;
	}
});
Object.defineProperty(exports, 'blockParse', {
	enumerable: true,
	get: function get() {
		return _c.blockParse;
	}
});
Object.defineProperty(exports, 'tagSplit', {
	enumerable: true,
	get: function get() {
		return _c.tagSplit;
	}
});
Object.defineProperty(exports, 'tagParse', {
	enumerable: true,
	get: function get() {
		return _c.tagParse;
	}
});

/**
 * List of tags which have a `name` in addition to a `description`.
 *
 * @property {Array.<String>} namedTags
 */
var namedTags = exports.namedTags = ['arg', 'argument', 'class', 'exports', 'extends', 'imports', 'method', 'module', 'param', 'parameter', 'prop', 'property'];