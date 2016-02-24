import tunic from '../src/tunic';
import test from 'ava';

const {createBlockNode} = tunic;

test('should create an empty block node', async assert => {
	assert.same(createBlockNode(), {
		type: 'Block',
		comment: {
			type: 'Comment',
			description: '',
			tags: [],
			line: 0
		},
		code: {
			type: 'Code',
			code: '',
			line: 0
		}
	});
});

test('should create a plain block node', async assert => {
	assert.same(createBlockNode('/** foo */\n', 'var a = 1;', 1), {
		type: 'Block',
		comment: {
			type: 'Comment',
			description: 'foo',
			tags: [],
			line: 1
		},
		code: {
			type: 'Code',
			code: 'var a = 1;',
			line: 2
		}
	});
});
