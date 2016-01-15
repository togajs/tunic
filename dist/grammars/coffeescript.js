'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * # CoffeeScript Grammar
 *
 * Parses CoffeeScript-style comments and Javadoc-style tags.
 *
 * @module tunic/grammar/coffeescript
 */

/**
 * Matches allowed indention characters.
 *
 *     ^         start of line
 *     [\t \#]   tab, space, or asterisk
 *
 * @property {RegExp} blockIndent
 */
var blockIndent = exports.blockIndent = /^[\t #]/gm;

/**
 * Splits code and comment blocks.
 *
 *     (         capture match
 *     ^         start of line
 *     [\t ]*    any tabs or spaces
 *     ##        open comment with two hashes
 *     (?!#)     don't match if the comment is a block comment
 *     [\s\S]*?  non-greedy match of any characters
 *     \s*       any space characters
 *     \n[^#]    close comment
 *     )         end of capture
 *
 * @property {RegExp} blockSplit
 */
var blockSplit = exports.blockSplit = /(^[\t ]*##(?!#)[\s\S]*?\s*\n[^#])/m;

/**
 * Parses documentation blocks. Same as blockSplit, but only captures content.
 *
 * @property {RegExp} blockParse
 */
var blockParse = exports.blockParse = /^[\t ]*##(?!#)([\s\S]*?)\s*\n[^#]/m;

/**
 * Splits tags from the block description on leading `@` symbols.
 *
 *     ^       start of line
 *     [\t ]*  any tabs or spaces
 *     @       literal "@"
 *
 * @property {RegExp} tagSplit
 */
var tagSplit = exports.tagSplit = /^[\t ]*@/m;

/**
 * Parses `@tag {kind} name - description` chunks.
 *
 *     ^                     start of line
 *     (\w+)                 tag
 *     [\t \-]*              whitespace
 *     (?:\{(.*[^\\])?\})?   {kind}
 *     [\t \-]*              whitespace
 *     (\[[^\]]*\]\*?|\S*)?  name
 *     [\t ]*                whitespace
 *     (-?)                  delimiter
 *     [\t ]*                whitespace
 *     ([\s\S]+)?            description
 *     $                     end of line
 *
 * @property {RegExp} tagParse
 */
var tagParse = exports.tagParse = /^(\w+)[\t \-]*(?:\{(.*[^\\])?\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t ]*(-?)[\t ]*([\s\S]+)?$/m;

/**
 * List of tags which have a `name` in addition to a `description`.
 *
 * @property {Array.<String>} namedTags
 */
var namedTags = exports.namedTags = ['arg', 'argument', 'class', 'exports', 'extends', 'imports', 'method', 'module', 'param', 'parameter', 'prop', 'property'];