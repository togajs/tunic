import {parseBlocks} from '../src/tunic';
import test from 'ava';

test('should handle empty arguments', async assert => {
	const expected = [];

	assert.same(parseBlocks(), expected);
});

test('should join alternating blocks', async assert => {
	const fixture = [
		'/** foo */',
		'var a = 1;',
		'/** bar */',
		'var b = 2;'
	];

	const expected = [
		{
			type: 'CommentBlock',
			description: 'foo',
			tags: [],
			trailingCode: 'var a = 1;'
		},
		{
			type: 'CommentBlock',
			description: 'bar',
			tags: [],
			trailingCode: 'var b = 2;'
		}
	];

	assert.same(parseBlocks(fixture), expected);
});
