/* eslint-env mocha */

var Tunic = require('../src/tunic'),
	expect = require('expect');

describe.only('tunic spec', function () {
	var tunic;

	beforeEach(function () {
		tunic = new Tunic();
	});

	it('should create an instance', function () {
		expect(tunic).toBeA(Tunic);
	});

	describe('#parse', function () {
		it('should parse an empty string', function () {
			expect(tunic.parse('')).toEqual({
				type: 'Documentation',
				body: []
			});

			expect(tunic.parse('/**\nFoo\n*/\nvar foo = "bar";\n/**\nBaz\n*/\nvar baz = "bat";')).toEqual({
				type: 'Documentation',
				body: [
					{
						type: 'CommentBlock',
						description: 'Foo',
						trailingCode: 'var foo = "bar";',
						tags: []
					},
					{
						type: 'CommentBlock',
						description: 'Baz',
						trailingCode: 'var baz = "bat";',
						tags: []
					}
				]
			});
		});
	});

	describe('#parseBlocks', function () {
		it('should parse an empty arrays', function () {
			expect(tunic.parseBlocks()).toEqual([]);
			expect(tunic.parseBlocks([])).toEqual([]);
		});

		it('should parse blocks', function () {
			expect(tunic.parseBlocks([''])).toEqual([{
				type: 'CommentBlock',
				description: '',
				trailingCode: '',
				tags: []
			}]);

			expect(tunic.parseBlocks([
				'/** Foo */',
				'var foo = "bar";'
			])).toEqual([{
				type: 'CommentBlock',
				description: 'Foo',
				trailingCode: 'var foo = "bar";',
				tags: []
			}]);

			expect(tunic.parseBlocks([
				'/** Foo */',
				'var foo = "bar";',
				'/** Baz */',
				'var baz = "bat";'
			])).toEqual([
				{
					type: 'CommentBlock',
					description: 'Foo',
					trailingCode: 'var foo = "bar";',
					tags: []
				},
				{
					type: 'CommentBlock',
					description: 'Baz',
					trailingCode: 'var baz = "bat";',
					tags: []
				}
			]);
		});
	});

	describe('#parseComment', function () {
		it('should parse an empty string', function () {
			expect(tunic.parseComment()).toEqual({
				type: 'CommentBlock',
				description: '',
				trailingCode: '',
				tags: []
			});

			expect(tunic.parseComment('')).toEqual({
				type: 'CommentBlock',
				description: '',
				trailingCode: '',
				tags: []
			});
		});

		it('should parse a comment', function () {
			expect(tunic.parseComment('Foo')).toEqual({
				type: 'CommentBlock',
				description: 'Foo',
				trailingCode: '',
				tags: []
			});

			expect(tunic.parseComment('/** Foo */', 'var foo = "bar";')).toEqual({
				type: 'CommentBlock',
				description: 'Foo',
				trailingCode: 'var foo = "bar";',
				tags: []
			});

			expect(tunic.parseComment('/**\nFoo\n@tag description\n@return\n*/', 'var foo = "bar";')).toEqual({
				type: 'CommentBlock',
				description: 'Foo\n',
				trailingCode: 'var foo = "bar";',
				tags: [
					{
						type: 'CommentBlockTag',
						tag: 'tag',
						kind: undefined,
						name: undefined,
						description: 'description'
					},
					{
						type: 'CommentBlockTag',
						tag: 'return',
						kind: undefined,
						name: undefined,
						description: undefined
					}
				]
			});
		});
	});

	describe('#parseTag', function () {
		it('should parse an empty tag', function () {
			expect(tunic.parseTag()).toEqual({
				type: 'CommentBlockTag',
				tag: undefined,
				kind: undefined,
				name: undefined,
				description: undefined
			});

			expect(tunic.parseTag('')).toEqual({
				type: 'CommentBlockTag',
				tag: undefined,
				kind: undefined,
				name: undefined,
				description: undefined
			});
		});

		it('should parse a tag', function () {
			expect(tunic.parseTag('tag description')).toEqual({
				type: 'CommentBlockTag',
				tag: 'tag',
				kind: undefined,
				name: undefined,
				description: 'description'
			});

			expect(tunic.parseTag('tag name - description')).toEqual({
				type: 'CommentBlockTag',
				tag: 'tag',
				kind: undefined,
				name: 'name',
				description: 'description'
			});

			expect(tunic.parseTag('tag {kind} name - description')).toEqual({
				type: 'CommentBlockTag',
				tag: 'tag',
				kind: 'kind',
				name: 'name',
				description: 'description'
			});

			expect(tunic.parseTag('param {kind} name description')).toEqual({
				type: 'CommentBlockTag',
				tag: 'param',
				kind: 'kind',
				name: 'name',
				description: 'description'
			});

			expect(tunic.parseTag('return {kind} description')).toEqual({
				type: 'CommentBlockTag',
				tag: 'return',
				kind: 'kind',
				name: undefined,
				description: 'description'
			});
		});
	});

	describe('#unwrap', function () {
		it('should unwrap an empty comment', function () {
			expect(tunic.unwrap('')).toBe('');
			expect(tunic.unwrap('/** */')).toBe('');
			expect(tunic.unwrap('/**\n *\n */')).toBe('');
		});

		it('should unwrap a comment', function () {
			expect(tunic.unwrap('Hello')).toBe('Hello');
			expect(tunic.unwrap('/** Hello */')).toBe('Hello');
			expect(tunic.unwrap('/**\nHello\n*/')).toBe('Hello');
			expect(tunic.unwrap('/**\n * Hello\n */')).toBe('Hello');
			expect(tunic.unwrap('\t/**\n\t * Hello\n\t */')).toBe('Hello');
		});
	});
});
