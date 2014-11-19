'use strict';

var tunic = require('../index'),
	expect = require('expect.js');

describe('tunic spec', function () {
	it('should create an instance', function () {
		var Tunic = tunic,
			a = new Tunic(),
			b = tunic();

		expect(a).to.be.a(Tunic);
		expect(b).to.be.a(Tunic);

		expect(a).not.to.be(b);
	});
});
