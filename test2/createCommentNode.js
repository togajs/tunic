import {createCommentNode} from '../src2/tunic';
import test from 'ava';

test('should create a blank comment node', async assert => {
	assert.same(createCommentNode(), {
		type: 'Comment',
		description: '',
		tags: [],
		line: 0
	});
});

test('should create a plain comment node', async assert => {
	assert.same(createCommentNode('/** foo */', 1), {
		type: 'Comment',
		description: 'foo',
		tags: [],
		line: 1
	});
});

test('should create a tagged comment node', async assert => {
	assert.same(createCommentNode('/**\n foo\n @bar\n*/', 1), {
		type: 'Comment',
		description: 'foo',
		tags: [{
			type: 'CommentTag',
			tag: 'bar',
			kind: '',
			name: '',
			description: ''
		}],
		line: 1
	});
});
