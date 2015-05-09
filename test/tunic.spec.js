/*eslint-env mocha */

import Tunic from '../src/tunic';
import expect from 'expect';

describe('tunic spec', function () {
	it('should create an instance', function () {
		var a = new Tunic();

		expect(a).toBeA(Tunic);
	});
});
