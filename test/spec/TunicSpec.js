'use strict';

var Tunic = require('../../index');
var es = require('event-stream');
var vs = require('vinyl-fs');

describe('Tunic', function () {
    var tunic = Tunic;

    var fooFixture = 'alert("foo");';

    var fooExpected = {
        type: 'Tunic',
        blocks: [{ type: 'Code', contents: fooFixture }]
    };

    var toBeUndefined = function (file, cb) {
        expect(file.tunic).toBeUndefined();
        cb(null, file);
    };

    var toEqualFoo = function (data, cb) {
        expect(data).toEqual(fooExpected);
        cb(null, data);
    };

    var toEqualExpected = function (file, cb) {
        var expected = file.path.replace('fixtures', 'expected');
        expect(file.tunic).toEqual(require(expected + '.json'));
        cb(null, file);
    };

    it('should create an instance when invoked directly', function () {
        var t = tunic();
        expect(t instanceof Tunic).toBe(true);
    });

    it('should create an instance when called with `new`', function () {
        var t = new Tunic();
        expect(t instanceof Tunic).toBe(true);
    });

    describe('#_transform', function () {
        it('should parse streamed chunks', function (done) {
            es.readArray([fooFixture, fooFixture])
                .pipe(tunic())
                .pipe(es.map(toEqualFoo))
                .on('end', done);
        });

        it('should not parse unknown file types', function (done) {
            vs.src(__dirname + '/../fixtures/**/*.js')
                .pipe(tunic({ extension: /\.coffee$/ }))
                .pipe(es.map(toBeUndefined))
                .on('end', done);
        });

        it('should parse javascript files', function (done) {
            vs.src(__dirname + '/../fixtures/**/*.js')
                .pipe(tunic())
                .pipe(es.map(toEqualExpected))
                .on('end', done);
        });

        it('should parse handlebar files', function (done) {
            vs.src(__dirname + '/../fixtures/**/*.hbs')
                .pipe(tunic({
                    blockIndents: /^[\t !]/gm,
                    blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
                    blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
                    namedTags: ['arg', 'argument', 'data', 'prop', 'property']
                }))
                .pipe(es.map(toEqualExpected))
                .on('end', done);
        });

        it('should parse perl files', function (done) {
            vs.src(__dirname + '/../fixtures/**/*.pl')
                .pipe(tunic({
                    blockParse: /^=pod([\s\S]*?)\n=cut$/m,
                    blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
                    namedTags: ['arg', 'argument', 'data', 'prop', 'property']
                }))
                .pipe(es.map(toEqualExpected))
                .on('end', done);
        });
    });
});
