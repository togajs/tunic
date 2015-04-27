/*eslint-env mocha */
'use strict';

import tunic from '../index';
import { Tunic } from '../index';

import expect from 'expect';

describe('tunic spec', function () {
	it('should create an instance', function () {
		var a = new Tunic(),
			b = tunic();

		expect(a).toBeA(Tunic);
		expect(b).toBeA(Tunic);

		expect(a).toNotBe(b);
	});
});
