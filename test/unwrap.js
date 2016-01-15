import {unwrap} from '../src/tunic';
import test from 'ava';

test('should handle empty arguments', async assert => {
	const expected = '';

	assert.is(unwrap(), expected);
});

test('should unwrap a comment', async assert => {
	const fixture = `
		/**
		 * Lorem ipsum dolor sit amet,
		 * consectetur adipiscing elit.
		 */
	`;

	const expected = 'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.';

	assert.is(unwrap(fixture), expected);
});
