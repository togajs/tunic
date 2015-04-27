/*eslint-env mocha */
'use strict';

import { Tunic } from '../index';

import expect from 'expect';
import streamArray from 'stream-array';
import supply from 'mtil/function/supply';
import vinylFs from 'vinyl-fs';
import { join } from 'path';
import { readFileSync } from 'fs';

var config = {
	fixtures: join(__dirname, '/fixtures'),
	expected: join(__dirname, '/expected'),
	actual: join(__dirname, '/actual')
};

describe('tunic e2e', function () {
	describe('raw streams', function () {
		function testWithArray(array, stream, done) {
			var expectChunk = supply(
				function (chunk) {
					expect(chunk).toEqual({
						type: 'Document',
						blocks: [{
							contents: 'hello',
							type: 'Code'
						}]
					});
				},
				function (chunk) {
					expect(chunk).toEqual({
						type: 'Document',
						blocks: [{
							contents: 'world',
							type: 'Code'
						}]
					});
				}
			);

			streamArray(array)
				.pipe(stream)
				.on('data', expectChunk)
				.on('error', done)
				.on('end', done);
		}

		it('should parse strings', function (done) {
			var strings = ['hello', 'world'];

			testWithArray(strings, new Tunic(), done);
		});

		it('should parse buffers', function (done) {
			var buffers = [new Buffer('hello'), new Buffer('world')];

			testWithArray(buffers, new Tunic(), done);
		});
	});

	describe('object streams', function () {
		function testWithFile(filename, stream, done) {
			var fixture = join(config.fixtures, filename),
				expected = join(config.expected, filename + '.json');

			function expectFile(file) {
				var actual = JSON.stringify(file.ast, null, 2) + '\n';

				expect(actual).toEqual(String(readFileSync(expected)));

				done();
			}

			vinylFs
				.src(fixture)
				.pipe(stream)
				.on('data', expectFile)
				.on('error', done);
		}

		it('should parse arguments', function (done) {
			testWithFile('arg.js', new Tunic(), done);
		});

		it('should parse descriptions', function (done) {
			testWithFile('desc.js', new Tunic(), done);
		});

		it('should parse empty blocks', function (done) {
			testWithFile('empty.js', new Tunic(), done);
		});

		it('should ignore malformed blocks', function (done) {
			testWithFile('ignore.js', new Tunic(), done);
		});

		it('should parse indents', function (done) {
			testWithFile('indents.js', new Tunic(), done);
		});

		it('should parse names', function (done) {
			testWithFile('name.js', new Tunic(), done);
		});

		it('should make navigation nodes', function (done) {
			testWithFile('nav.js', new Tunic(), done);
		});

		it('should parse tags', function (done) {
			testWithFile('tag.js', new Tunic(), done);
		});

		it('should parse types', function (done) {
			testWithFile('type.js', new Tunic(), done);
		});

		it('should parse handlebars files', function (done) {
			var stream = new Tunic({
				blockIndent: /^[\t \!]/gm,
				blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
				blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
				namedTags: ['arg', 'argument', 'data', 'prop', 'property']
			});

			testWithFile('custom.hbs', stream, done);
		});

		it('should parse perlish files', function (done) {
			var stream = new Tunic({
				blockParse: /^=pod([\s\S]*?)\n=cut$/m,
				blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
				namedTags: ['arg', 'argument', 'data', 'prop', 'property']
			});

			testWithFile('custom.pl', stream, done);
		});

		it('should ignore unknown files', function (done) {
			var stream = new Tunic({
				extension: /\.js$/
			});

			function expectFile(file) {
				expect(file.ast).toBe(undefined);

				done();
			}

			vinylFs
				.src(join(config.fixtures, 'unused.coffee'))
				.pipe(stream)
				.on('data', expectFile)
				.on('error', done);
		});
	});
});
