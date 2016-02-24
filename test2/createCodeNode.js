import {createCodeNode} from '../src2/tunic';
import test from 'ava';

test('should create a blank comment node', async assert => {
	assert.same(createCodeNode(), {
		type: 'Code',
		code: '',
		line: 0
	});
});

test('should create a plain comment node', async assert => {
	assert.same(createCodeNode('foo', 1), {
		type: 'Code',
		code: 'foo',
		line: 1
	});
});
