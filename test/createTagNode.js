import test from 'ava';
import { createTagNode } from '../src/tunic';

test('should create an empty comment node', async assert => {
	assert.same(createTagNode(), {
		type: 'Tag',
		tag: '',
		kind: '',
		name: '',
		description: ''
	});
});

test('should create an unnamed comment node', async assert => {
	assert.same(createTagNode('foo', 'bar', 'baz', null, 'qux'), {
		type: 'Tag',
		tag: 'foo',
		kind: 'bar',
		name: '',
		description: 'baz qux'
	});
});

test('should create a named comment node', async assert => {
	assert.same(createTagNode('foo', 'bar', 'baz', '-', 'qux'), {
		type: 'Tag',
		tag: 'foo',
		kind: 'bar',
		name: 'baz',
		description: 'qux'
	});

	assert.same(createTagNode('param', undefined, '[baz]', undefined, 'qux'), {
		type: 'Tag',
		tag: 'param',
		kind: '',
		name: '[baz]',
		description: 'qux'
	});

	assert.same(createTagNode('param', undefined, '[baz]', undefined, 'qux', { namedTags: ['foo'] }), {
		type: 'Tag',
		tag: 'param',
		kind: '',
		name: '',
		description: '[baz] qux'
	});
});
