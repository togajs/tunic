/*eslint-env mocha */

var Tunic = require('../src/tunic'),
	expect = require('expect');

describe('tunic spec', function () {
	it('should create an instance', function () {
		var a = new Tunic();

		expect(a).toBeA(Tunic);
	});
});
