import {normalizeOptions} from '../src/tunic';
import test from 'ava';

test('should assign default values', async assert => {
	const options = normalizeOptions();

	assert.ok(options.blockSplit instanceof RegExp);
	assert.ok(options.blockParse instanceof RegExp);
	assert.is(options.foo, undefined);
});

test('should assign custom values', async assert => {
	const options = normalizeOptions({
		blockParse: 'parse',
		foo: 'bar'
	});

	assert.ok(options.blockSplit instanceof RegExp);
	assert.is(options.blockParse, 'parse');
	assert.is(options.foo, 'bar');
});
