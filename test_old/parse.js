import {parse} from '../src/tunic';
import test from 'ava';

test('should handle empty arguments', async assert => {
	const expected = {
		type: 'Documentation',
		blocks: []
	};

	assert.same(parse(), expected);
});

test('should parse code a leading comment', async assert => {
	const fixture = '/** foo */\nvar a = 1;';

	const expected = {
		type: 'Documentation',
		blocks: [
			{
				type: 'CommentBlock',
				description: 'foo',
				tags: [],
				trailingCode: 'var a = 1;'
			}
		]
	};

	assert.same(parse(fixture), expected);
});

test('should parse code without a leading comment', async assert => {
	const fixture = 'var a = 1;\n/** foo */';

	const expected = {
		type: 'Documentation',
		blocks: [
			{
				type: 'CommentBlock',
				description: '',
				tags: [],
				trailingCode: 'var a = 1;'
			},
			{
				type: 'CommentBlock',
				description: 'foo',
				tags: [],
				trailingCode: ''
			}
		]
	};

	assert.same(parse(fixture), expected);
});
