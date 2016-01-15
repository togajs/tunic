/**
 * # JavaScript Grammar
 *
 * A C-style grammar with custom named tags.
 *
 * @module tunic/grammar/javascript
 */

export {blockIndent, blockSplit, blockParse, tagSplit, tagParse} from './c';

/**
 * List of tags which have a `name` in addition to a `description`.
 *
 * @property {Array.<String>} namedTags
 */
export const namedTags = [
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
