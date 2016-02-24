import {createBlockNode} from '../src2/tunic';
import test from 'ava';

test('should create a blank block node', async assert => {
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
