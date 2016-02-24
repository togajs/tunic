import tunic from '../src/tunic';
import test from 'ava';

const {createCommentNode} = tunic;

test('should create an empty comment node', async assert => {
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
	assert.same(createCommentNode('/**\n * foo\n * @bar\n*/', 1), {
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

test('should handle mismatched indents', async assert => {
	assert.same(createCommentNode('/**\n * foo\n  @bar\n*/', 1), {
		type: 'Comment',
		description: '* foo',
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
