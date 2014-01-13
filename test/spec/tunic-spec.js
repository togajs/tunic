/*jshint maxlen:false */
'use strict';

var assert = require('assert');
var fs = require('fs');
var tunic = require('../../lib/tunic');
var Tunic = tunic;

describe('Tunic', function () {
    it('should ignore non-blocks', function() {
        var ignore = fs.readFileSync(__dirname + '/../fixtures/ignore.js', 'utf8');

        assert.deepEqual(tunic(ignore), require('../expected/ignore.json'));
    });

    it('should parse empty blocks', function() {
        var empty = fs.readFileSync(__dirname + '/../fixtures/empty.js', 'utf8');

        assert.deepEqual(tunic(), [{ 'type': 'Code', 'body': 'undefined' }]);
        assert.deepEqual(tunic(''), [{ 'type': 'Code', 'body': '' }]);
        assert.deepEqual(tunic(null), [{ 'type': 'Code', 'body': 'null' }]);
        assert.deepEqual(tunic(empty), require('../expected/empty.json'));
    });

    it('should parse descriptions', function() {
        var desc = fs.readFileSync(__dirname + '/../fixtures/desc.js', 'utf8');

        assert.deepEqual(tunic(desc), require('../expected/desc.json'));
    });

    it('should parse tags', function() {
        var tag = fs.readFileSync(__dirname + '/../fixtures/tag.js', 'utf8');

        assert.deepEqual(tunic(tag), require('../expected/tag.json'));
    });

    it('should parse args', function() {
        var arg = fs.readFileSync(__dirname + '/../fixtures/arg.js', 'utf8');

        assert.deepEqual(tunic(arg), require('../expected/arg.json'));
    });

    it('should parse types', function() {
        var type = fs.readFileSync(__dirname + '/../fixtures/type.js', 'utf8');

        assert.deepEqual(tunic(type), require('../expected/type.json'));
    });

    it('should parse names', function() {
        var name = fs.readFileSync(__dirname + '/../fixtures/name.js', 'utf8');

        assert.deepEqual(tunic(name), require('../expected/name.json'));
    });

    it('should handle indention', function() {
        var indent = fs.readFileSync(__dirname + '/../fixtures/indent.js', 'utf8');
        var standardParser = new Tunic();
        var tokens = standardParser.parse(indent, {
            raw: true
        });

        assert.deepEqual(tokens, require('../expected/indent.json'));
    });

    it('should use custom handlebars grammar', function() {
        var custom = fs.readFileSync(__dirname + '/../fixtures/custom.hbs', 'utf8');

        var handlebarParser = new Tunic({
            blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
            blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
            indent: /^[\t !]/gm,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        });

        var tokens = handlebarParser.parse(custom, {
            raw: true
        });

        assert.deepEqual(tokens, require('../expected/custom-hbs.json'));
    });

    it('should use custom perl grammar', function() {
        var custom = fs.readFileSync(__dirname + '/../fixtures/custom.pl', 'utf8');

        var perlParser = new Tunic({
            blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
            blockParse: /^=pod([\s\S]*?)\n=cut$/m,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        });

        var tokens = perlParser.parse(custom, {
            raw: true
        });

        assert.deepEqual(tokens, require('../expected/custom-perl.json'));
    });
});
