/**
 * # Perl Grammar
 *
 * Parses Perl-style comments. Does not parse tags.
 */

// 	testFile(assert, 'custom.pl', new Tunic({
// 		blockParse: /^=pod\n([\s\S]*?)\n=cut$/m,
// 		blockSplit: /(^=pod\n[\s\S]*?\n=cut$)/m,
// 		tagSplit: false
// 	}));

/**
 * @class Tunic.Grammar.Perl
 * @static
 */
export default {
	// #<{(|*
	//  * Matches allowed indention characters.
	//  *
	//  *     ^         start of line
	//  *     [\t \*]   tab, space, or asterisk
	//  *
	//  * @property {RegExp} blockIndent
	//  |)}>#
	// blockIndent: /^[\t \*]/gm,
    //
	// #<{(|*
	//  * Splits code and comment blocks.
	//  *
	//  *     (         capture match
	//  *     ^         start of line
	//  *     [\t ]*    any tabs or spaces
	//  *     \/\*\*    open comment with two asterisks
	//  *     (?!\/)    don't match if the comment is immediately closed
	//  *     [\s\S]*?  non-greedy match of any characters
	//  *     \s*       any space characters
	//  *     \*\/      close comment
	//  *     )         end of capture
	//  *
	//  * @property {RegExp} blockSplit
	//  |)}>#
	// blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,
    //
	// #<{(|*
	//  * Parses documentation blocks. Same as blockSplit, but doesn't capture.
	//  *
	//  * @property {RegExp} blockParse
	//  |)}>#
	// blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,
    //
	// #<{(|*
	//  * Splits tags from the block description on leading `@` symbols.
	//  *
	//  *     ^       start of line
	//  *     [\t ]*  any tabs or spaces
	//  *     @       literal "@"
	//  *
	//  * @property {RegExp} tagSplit
	//  |)}>#
	// tagSplit: /^[\t ]*@/m,
    //
	// #<{(|*
	//  * Parses `@tag {kind} name - description` chunks.
	//  *
	//  *     ^                     start of line
	//  *     (\w+)                 tag
	//  *     [\t \-]*              whitespace
	//  *     (?:\{(.*[^\\])?\})?   {kind}
	//  *     [\t \-]*              whitespace
	//  *     (\[[^\]]*\]\*?|\S*)?  name
	//  *     [\t ]*                whitespace
	//  *     (-?)                  delimiter
	//  *     [\t ]*                whitespace
	//  *     ([\s\S]+)?            description
	//  *     $                     end of line
	//  *
	//  * @property {RegExp} tagParse
	//  |)}>#
	// tagParse: /^(\w+)[\t \-]*(?:\{(.*[^\\])?\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t ]*(-?)[\t ]*([\s\S]+)?$/m,
    //
	// #<{(|*
	//  * List of tags which have a `name` in addition to a `description`.
	//  *
	//  * @property {Array.<String>} namedTags
	//  |)}>#
	// namedTags: [
	// 	'arg',
	// 	'argument',
	// 	'const',
	// 	'func',
	// 	'funciton',
	// 	'param',
	// 	'parameter',
	// 	'type'
	// ]
};
