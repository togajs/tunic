import {createDocumentationNode} from '../src2/tunic';
import test from 'ava';

test('should create a blank documentation node', async assert => {
	assert.same(createDocumentationNode(), {
		type: 'Documentation',
		blocks: []
	});
});

test('should create a plain documentation node', async assert => {
	assert.same(createDocumentationNode('var a = 1;'), {
		type: 'Documentation',
		blocks: [{
			type: 'Block',
			comment: {
				type: 'Comment',
				description: '',
				tags: [],
				line: 1
			},
			code: {
				type: 'Code',
				code: 'var a = 1;',
				line: 1
			}
		}]
	});
});

test('should create a plain documentation node', async assert => {
	assert.same(createDocumentationNode('/** foo */\nvar a = 1;'), {
		type: 'Documentation',
		blocks: [{
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
		}]
	});
});
