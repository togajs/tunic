import tunic from '../src/tunic';
import test from 'ava';

const {createBlockNode} = tunic;

test('should create an empty block node', async assert => {
	assert.same(createBlockNode(), {
		type: 'Block',
		comment: {
			type: 'Comment',
			description: '',
			tags: []
		},
		code: {
			type: 'Code',
			code: ''
		}
	});
});

test('should create a plain block node', async assert => {
	assert.same(createBlockNode('foo', 'var a = 1;'), {
		type: 'Block',
		comment: {
			type: 'Comment',
			description: 'foo',
			tags: []
		},
		code: {
			type: 'Code',
			code: 'var a = 1;'
		}
	});
});
