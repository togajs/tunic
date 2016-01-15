/**
 * # C Grammar
 *
 * Parses C-style multi-line comments and Javadoc-style tags.
 *
 * @module tunic/grammars/c
 */

/**
 * Matches allowed indention characters.
 *
 *     ^         start of line
 *     [\t \*]   tab, space, or asterisk
 *
 * @property {RegExp} blockIndent
 */
export const blockIndent = /^[\t \*]/gm;

/**
 * Splits code and comment blocks.
 *
 *     (         capture match
 *     ^         start of line
 *     [\t ]*    any tabs or spaces
 *     \/\*\*    open comment with two asterisks
 *     (?!\/)    don't match if the comment is immediately closed
 *     [\s\S]*?  non-greedy match of any characters
 *     \s*       any space characters
 *     \*\/      close comment
 *     )         end of capture
 *
 * @property {RegExp} blockSplit
 */
export const blockSplit = /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m;

/**
 * Parses documentation blocks. Same as `blockSplit`, but only captures content.
 *
 * @property {RegExp} blockParse
 */
export const blockParse = /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m;

/**
 * Splits tags from the block description on leading `@` symbols.
 *
 *     ^       start of line
 *     [\t ]*  any tabs or spaces
 *     @       literal "@"
 *
 * @property {RegExp} tagSplit
 */
export const tagSplit = /^[\t ]*@/m;

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
export const tagParse = /^(\w+)[\t \-]*(?:\{(.*[^\\])?\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t ]*(-?)[\t ]*([\s\S]+)?$/m;

/**
 * List of tags which have a `name` in addition to a `description`.
 *
 * @property {Array.<String>} namedTags
 */
export const namedTags = [
	'arg',
	'argument',
	'const',
	'func',
	'function',
	'param',
	'parameter',
	'type'
];
