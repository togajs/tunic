import tunic from '../src/tunic';
import test from 'ava';

const { createCodeNode } = tunic;

test('should create an empty comment node', async assert => {
	assert.same(createCodeNode(), {
		type: 'Code',
		code: ''
	});
});

test('should create a plain comment node', async assert => {
	assert.same(createCodeNode('foo'), {
		type: 'Code',
		code: 'foo'
	});
});
