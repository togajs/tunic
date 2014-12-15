'use strict';

var tunic = require('../index'),
	es = require('event-stream'),
	expect = require('expect.js'),
	toga = require('toga'),

	config = {
		coffee: __dirname + '/fixtures/**/*.coffee',
		js: __dirname + '/fixtures/**/*.js',
		hbs: __dirname + '/fixtures/**/*.hbs',
		perl: __dirname + '/fixtures/**/*.{pl,pm}',
		dest: __dirname + '/actual',
	};

describe('tunic e2e', function () {
	var count,
		fooFixture = 'alert("foo");',
		fooExpected = {
			type: 'Document',
			blocks: [{ type: 'Code', contents: fooFixture }]
		};

	function toEqualFoo(data, cb) {
		count++;

		expect(data).to.eql(fooExpected);
		cb(null, data);
	}

	function toEqualExpected(file, cb) {
		count++;

		var expected = file.path.replace('fixtures', 'expected');
		expect(JSON.stringify(file.ast)).to.be(JSON.stringify(require(expected + '.json')));
		cb(null, file);
	}

	function toEqualUndefined(file, cb) {
		count++;

		expect(file.ast).to.be(undefined);
		cb(null, file);
	}

	it('should parse streamed chunks', function (done) {
		count = 0;

		var files = [
			fooFixture,
			new Buffer(fooFixture)
		];

		es
			.readArray(files)
			.pipe(tunic())
			.pipe(es.map(toEqualFoo))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(2);
				done();
			});
	});

	it('should parse javascript files', function (done) {
		count = 0;

		toga
			.src(config.js)
			.pipe(tunic())
			.pipe(es.map(toEqualExpected))
			.pipe(toga.dest(config.dest))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(8);
				done();
			});
	});

	it('should parse handlebars files', function (done) {
		count = 0;

		toga
			.src(config.hbs)
			.pipe(tunic({
				blockIndent: /^[\t \!]/gm,
				blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
				blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
				namedTags: ['arg', 'argument', 'data', 'prop', 'property']
			}))
			.pipe(es.map(toEqualExpected))
			.pipe(toga.dest(config.dest))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});

	it('should parse perlish files', function (done) {
		count = 0;

		toga
			.src(config.perl)
			.pipe(tunic({
				blockParse: /^=pod([\s\S]*?)\n=cut$/m,
				blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
				namedTags: ['arg', 'argument', 'data', 'prop', 'property']
			}))
			.pipe(es.map(toEqualExpected))
			.pipe(toga.dest(config.dest))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});

	it('should not parse empty files', function (done) {
		count = 0;

		var files = [
			{ path: 'foo.js' },
			{ path: 'foo.js', content: null },
			undefined
		];

		es
			.readArray(files)
			.pipe(tunic())
			.pipe(es.map(toEqualUndefined))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(2);
				done();
			});
	});

	it('should not parse unknown file types', function (done) {
		count = 0;

		toga
			.src(config.coffee)
			.pipe(tunic({
				extension: /\.js$/
			}))
			.pipe(es.map(toEqualUndefined))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});
});
