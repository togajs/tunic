import test from 'ava';
import tunic from '../src/tunic';
import { hashHashHash } from '../src/commentStyles';

test('should create a reusable parser', async assert => {
	const parser = tunic({ commentStyle: hashHashHash });

	assert.same(parser.parse(), {
		type: 'Documentation',
		blocks: []
	});

	assert.same(parser.parse('###\n# foo\n###\na = 1'), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'foo',
					tags: []
				},
				code: {
					type: 'Code',
					code: '\na = 1'
				}
			}
		]
	});
});
