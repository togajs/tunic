import {createCommentTagNode} from '../src2/tunic';
import test from 'ava';

test('should create a blank comment node', async assert => {
	assert.same(createCommentTagNode(), {
		type: 'CommentTag',
		tag: '',
		kind: '',
		name: '',
		description: ''
	});
});

test('should create an unnamed comment node', async assert => {
	assert.same(createCommentTagNode('foo', 'bar', 'baz', null, 'qux'), {
		type: 'CommentTag',
		tag: 'foo',
		kind: 'bar',
		name: '',
		description: 'baz qux'
	});
});

test('should create a named comment node', async assert => {
	assert.same(createCommentTagNode('foo', 'bar', 'baz', '-', 'qux'), {
		type: 'CommentTag',
		tag: 'foo',
		kind: 'bar',
		name: 'baz',
		description: 'qux'
	});
});
