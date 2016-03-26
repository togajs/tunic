import test from 'ava';
import { createCommentNode } from '../src/tunic';

test('should create an empty comment node', async assert => {
	assert.same(createCommentNode(), {
		type: 'Comment',
		description: '',
		tags: []
	});
});

test('should create a plain comment node', async assert => {
	assert.same(createCommentNode('foo'), {
		type: 'Comment',
		description: 'foo',
		tags: []
	});
});

test('should create a tagged comment node', async assert => {
	assert.same(createCommentNode(' * foo\n * @bar\n *   baz\n * qux'), {
		type: 'Comment',
		description: 'foo\nqux',
		tags: [{
			type: 'Tag',
			tag: 'bar',
			kind: '',
			name: '',
			description: '\n  baz'
		}]
	});
});

test('should create an untagged comment node', async assert => {
	assert.same(createCommentNode(' * foo\n * @bar\n *   baz\n * qux', { tagStyle: false }), {
		type: 'Comment',
		description: 'foo\n@bar\n  baz\nqux',
		tags: []
	});
});
