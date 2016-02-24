import tunic from '../src/tunic';
import test from 'ava';

test('should create a reusable parser', async assert => {
	const hashHashHash = tunic({
		open: /^###/,
		close: /^###/
	});

	assert.same(hashHashHash.parse(), {
		type: 'Documentation',
		blocks: []
	});

	assert.same(hashHashHash.parse('###\n# foo\n###\na = 1'), {
		type: 'Documentation',
		blocks: [{
			type: 'Block',
			comment: {
				type: 'Comment',
				description: '# foo',
				tags: [],
				line: 1
			},
			code: {
				type: 'Code',
				code: 'a = 1',
				line: 4
			}
		}]
	});

	assert.same(hashHashHash.parse('###\n# foo\n###\na = 1', {indent: /[\t #]/}), {
		type: 'Documentation',
		blocks: [{
			type: 'Block',
			comment: {
				type: 'Comment',
				description: 'foo',
				tags: [],
				line: 1
			},
			code: {
				type: 'Code',
				code: 'a = 1',
				line: 4
			}
		}]
	});
});
