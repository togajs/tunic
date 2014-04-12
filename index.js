'use strict';

/**
 * # Tunic
 *
 * The stupid doc-block parser. Generates an abstract syntax tree based on a
 * customizable regular-expression grammar. Defaults to C-style comment blocks,
 * so it supports JavaScript, PHP, C++, and even CSS right out of the box.
 *
 * Tags are parsed greedily. If it looks like a tag, it's a tag. What you do
 * with them is completely up to you. Render something human-readable, perhaps?
 */

var Transform = require('stream').Transform;
var inherits = require('mout/lang/inheritPrototype');
var mixIn = require('mout/object/mixIn');

/**
 * Line matching patterns.
 *
 * @type {Object.<String,RegExp>}
 */
var matchLines = {
    any: /^/gm,
    edge: /^[\t ]*[\r\n]|[\r\n][\t ]*$/g,
    empty: /^$/gm
};

/**
 * Default C-style grammar options.
 *
 * @type {Object}
 */
var defaults = {
    extension: /.\w+$/,

    blockIndents: /^[\t \*]/gm,
    blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,
    blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,

    tagParse: /^(\w+)[\t \-]*(\{[^\}]+\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t \-]*([\s\S]+)?$/m,
    tagSplit: /^[\t ]*@/m,

    namedTags: [
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
 * @class Tunic
 * @extends Transform
 *
 * @constructor
 * @param {Tunic.Grammar} options
 * @param {RegExp} options.blockIndents
 * @param {RegExp} options.blockParse
 * @param {RegExp} options.blockSplit
 * @param {RegExp} options.tagParse
 * @param {RegExp} options.tagSplit
 * @param {Array.<String>} options.namedTags
 * @param {Array.<String>} options.namespaceTags
 */
function Tunic(options) {
    // Support functional execution: `tunic(options)`
    if (!(this instanceof Tunic)) {
        return new Tunic(options);
    }

    /**
     * @property options
     * @type {Object}
     */
    this.options = mixIn({}, defaults, this.defaults, options);

    Transform.call(this, { objectMode: true });
}

var proto = inherits(Tunic, Transform);

/**
 * @method parse
 * @param {String} chunk
 * @return {Object}
 */
proto.parse = function (chunk) {
    return {
        type: 'Tunic',
        blocks: String(chunk)
            .split(this.options.blockSplit)
            .map(this.parseBlock.bind(this))
    };
};

/**
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
 * @method parseCode
 * @param {String} code
 * @return {Object}
 */
proto.parseCode = function (code) {
    return{
        type: 'Code',
        contents: code
    };
};

/**
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
 * @method parseTag
 * @param {String} tag
 * @return {Object}
 */
proto.parseTag = function (tag) {
    var options = this.options;
    var parts = String(tag).match(options.tagParse);
    var label = parts[1];
    var type = parts[2];
    var name = parts[3];
    var description = parts[4];

    if (name && options.namedTags.indexOf(label) === -1) {
        description = name + ' ' + description;
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
 * @method unwrap
 * @param {String} block
 * @return {Object}
 */
proto.unwrap = function (block) {
    var lines;
    var emptyLines;
    var indentedLines;
    var options = this.options;
    var indent = options.blockIndents;

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

        // Check for remaining indention
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
    var extension = this.options.extension;

    // String or Buffer
    if (typeof file === 'string' || file instanceof Buffer) {
        this.push(this.parse(file.toString()));
        return cb();
    }

    // Vinyl
    if (file.contents != null && extension.test(file.path)) {
        file.tunic = this.parse(file.contents.toString());
    }

    this.push(file);
    return cb();
};

module.exports = Tunic;
