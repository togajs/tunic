import {parse} from '../src/tunic';
import test from 'ava';

test('should handle empty arguments', async assert => {
	const expected = {
		type: 'Documentation',
		blocks: []
	};

	assert.same(parse(), expected);
});

test('should create an DocTree Document', async assert => {
	const fixture = 'var a = 1;';

	const expected = {
		type: 'Documentation',
		blocks: [{
			type: 'CommentBlock',
			description: '',
			tags: [],
			trailingCode: 'var a = 1;'
		}]
	};

	assert.same(parse(fixture), expected);
});
