'use strict';

var Tunic = require('../index'),
	es = require('event-stream'),
	expect = require('expect.js'),
	vs = require('vinyl-fs');

describe('Tunic', function () {
	var tunic = Tunic;

	it('should create an instance', function () {
		var a = tunic(),
			b = new Tunic();

		expect(a).to.be.a(Tunic);
		expect(b).to.be.a(Tunic);
		expect(a).not.to.be(b);
	});

	describe('prototype', function () {
		describe('_transform', function () {
			var fooFixture = 'alert("foo");',

				fooExpected = {
					type: 'Document',
					blocks: [{ type: 'Code', contents: fooFixture }]
				},

				toEqualFoo = function (data, cb) {
					expect(data).to.eql(fooExpected);
					cb(null, data);
				},

				toEqualExpected = function (file, cb) {
					var expected = file.path.replace('fixtures', 'expected');
					expect(JSON.stringify(file.tunic)).to.be(JSON.stringify(require(expected + '.json')));
					cb(null, file);
				},

				toEqualUndefined = function (file, cb) {
					expect(file.tunic).to.be(undefined);
					cb(null, file);
				};

			it('should parse streamed chunks', function (done) {
				es.readArray([fooFixture, new Buffer(fooFixture)])
					.pipe(tunic())
					.pipe(es.map(toEqualFoo))
					.on('end', done);
			});

			it('should parse javascript files', function (done) {
				vs.src(__dirname + '/fixtures/**/*.js')
					.pipe(tunic())
					.pipe(es.map(toEqualExpected))
					.on('end', done);
			});

			it('should parse handlebars files', function (done) {
				vs.src(__dirname + '/fixtures/**/*.hbs')
					.pipe(tunic({
						blockIndent: /^[\t \!]/gm,
						blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
						blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
						namedTags: ['arg', 'argument', 'data', 'prop', 'property']
					}))
					.pipe(es.map(toEqualExpected))
					.on('end', done);
			});

			it('should parse perlish files', function (done) {
				vs.src(__dirname + '/fixtures/**/*.pl')
					.pipe(tunic({
						blockParse: /^=pod([\s\S]*?)\n=cut$/m,
						blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
						namedTags: ['arg', 'argument', 'data', 'prop', 'property']
					}))
					.pipe(es.map(toEqualExpected))
					.on('end', done);
			});

			it('should not parse empty files', function (done) {
				es.readArray([{ path: 'foo.js' }, { path: 'foo.js', content: null }])
					.pipe(tunic())
					.pipe(es.map(toEqualUndefined))
					.on('end', done);
			});

			it('should not parse unknown file types', function (done) {
				vs.src(__dirname + '/fixtures/**/*.coffee')
					.pipe(tunic({
						extension: /\.js$/
					}))
					.pipe(es.map(toEqualUndefined))
					.on('end', done);
			});
		});
	});
});
