import {parseTag} from '../src/tunic';
import test from 'ava';

test('should handle empty arguments', async assert => {
	const expected = {
		type: 'CommentBlockTag',
		tag: '',
		kind: '',
		name: '',
		description: ''
	};

	assert.same(parseTag(), expected);
});

test('should parse a simple tag', async assert => {
	const fixture = 'foo bar';

	const expected = {
		type: 'CommentBlockTag',
		tag: 'foo',
		kind: '',
		name: '',
		description: 'bar'
	};

	assert.same(parseTag(fixture), expected);
});

test('should parse a named tag', async assert => {
	const fixture = 'param foo bar';

	const expected = {
		type: 'CommentBlockTag',
		tag: 'param',
		kind: '',
		name: 'foo',
		description: 'bar'
	};

	assert.same(parseTag(fixture), expected);
});

test('should parse a complex tag', async assert => {
	const fixture = 'foo {qux} bar - baz';

	const expected = {
		type: 'CommentBlockTag',
		tag: 'foo',
		kind: 'qux',
		name: 'bar',
		description: 'baz'
	};

	assert.same(parseTag(fixture), expected);
});
