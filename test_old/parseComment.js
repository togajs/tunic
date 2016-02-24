import {parseComment} from '../src/tunic';
import test from 'ava';

test('should handle empty arguments', async assert => {
	const expected = {
		type: 'CommentBlock',
		description: '',
		tags: [],
		trailingCode: ''
	};

	assert.same(parseComment(), expected);
});

test('should parse a simple comment', async assert => {
	const commentFixture = '/** foo */';

	const codeFixture = 'var a = 1;';

	const expected = {
		type: 'CommentBlock',
		description: 'foo',
		tags: [],
		trailingCode: 'var a = 1;'
	};

	assert.same(parseComment(commentFixture, codeFixture), expected);
});

test('should parse a tagged comment', async assert => {
	const commentFixture = `
		/**
		 * foo
		 * @bar baz
		 * @bat qux
		 */
	`;

	const codeFixture = 'var a = 1;';

	const expected = {
		type: 'CommentBlock',
		description: 'foo\n',
		tags: [
			{
				type: 'CommentBlockTag',
				tag: 'bar',
				kind: '',
				name: '',
				description: 'baz'
			},
			{
				type: 'CommentBlockTag',
				tag: 'bat',
				kind: '',
				name: '',
				description: 'qux'
			}
		],
		trailingCode: 'var a = 1;'
	};

	assert.same(parseComment(commentFixture, codeFixture), expected);
});