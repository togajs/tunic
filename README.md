# `tunic`

> The stupid doc-block parser.

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

Generates a [Toga](http://togajs.github.io)-compatible abstract syntax tree based on a customizable regular-expression grammar. Defaults to C-style comment blocks, so it supports JavaScript, PHP, C++, and even CSS right out of the box.

Tags are parsed greedily. If it looks like a tag, it's a tag. What you do with them is completely up to you. Render something human-readable, perhaps?

## Install

With [Node.js](http://nodejs.org):

    $ npm install tunic

## Documentation Blocks

Documentation blocks follow the conventions of other standard tools such as JSDoc, Google Closure, YUIDoc, PHPDoc, JavaDoc, etc. The primary difference is that nothing is inferred from the code. If you want it documented, you must document it. This is why you can use tunic to parse inline documentation out of almost any language that supports multi-line comments.

## AST

- Root
  - `type` _`String`_ - Always "Document".
  - `blocks` _`Array.<Code|Comment>`_
- Code
  - `type` _`String`_ - Always "Code".
  - `body` _`String`_
- Comment
  - `type` _`String`_ - Always "Comment".
  - `description` _`String`_
  - `tags` _`Array.<Tag>`_
- Tag
  - `tag` _`String`_
  - `type` _`String`_
  - `name` _`String`_
  - `description` _`String`_

## API

### `new Tunic([options])`

- `options` `{Object}` Optional grammar overrides.
  - `options.extension` _`RegExp`_ - Matches the file extension or extensions which are handled by this parser.
  - `options.blockIndent` _`RegExp`_ - Matches any leading characters that are valid as DocBlock indentation, such as whitespace or asterisks. Used for normalization.
  - `options.blockParse` _`RegExp`_ - Matches the content of a DocBlock, where the first capturing group is the content without the start and end comment characters. Used for normalization.
  - `options.blockSplit` _`RegExp`_ - Splits code and docblocks into alternating chunks.
  - `options.tagParse` _`RegExp`_ - Matches the various parts of a tag where parts are captured in the following order:
    - 1: `tag`
    - 2: `type`
    - 3: `name`
    - 4: `description`
  - `options.tagSplit` _`RegExp`_ - Matches characters used to split description and tags from each other.
  - `options.namedTags` _`Array.<String>`_ - Which tags should be considered "named" tags. Non-named tags will have their name prepended to the description and set to `undefined`.
  - `options.namespaceSplit` _`RexExp`_ - Splits namespaces.
  - `options.namespaceTags` _`Object.<String,RegExp>`_ - Which tags should be used to generate navigation trees, and how to split them (eg. `/\b\.\b/` for `.`, or `/\b::\b/` for `::`). The word boundaries (`\b`) are important as it allows splitters to be escaped.

Creates a reusable parser based on the given options. Defaults to parsing C-style comment blocks.

#### `tunic([options]) : Tunic`

Functional shorthand, if that's how you operate.

### `.parse(block) : AST`

- `block` `{String}` Block of code containing comments to parse.

Generates a sensible syntax tree format of doc-blocks and surrounding code.

### Stream

Tunic is a [Transform Stream](http://nodejs.org/api/stream.html#stream_class_stream_transform), working in object mode, compatible with `String`, `Buffer`, and [Vinyl](https://github.com/wearefractal/vinyl). Strings and buffers are parsed and the resulting AST is emitted as data. Vinyl objects are augmented with the AST stored as the `.tunic` property.

## Example

### Default Options

    var tunic = require('tunic'),
        ast = tunic().parse('/** ... */');

### Custom Options

    var tunic = require('tunic'),
        handlebars = tunic({
            blockIndent: /^[\t !]/gm,
            blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
            blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
            namedTags: ['arg', 'argument', 'data', 'prop', 'property']
        }),
        ast = handlebars.parse('{{!--- ... --}}\n<div> ...');

### Using `new` Operator

    var Tunic = require('tunic'),
        pod = new Tunic({
            blockParse: /^=doc\n([\s\S]*?)\n=cut$/m,
            blockSplit: /(^=doc\n[\s\S]*?\n=cut$)/m,
            namedTags: ['arg', 'argument', 'data', 'prop', 'property']
        }),
        ast = pod.parse('=doc\n ... \n=cut');

### Streams

    var gulp = require('gulp'),
        tunic = require('tunic');

    gulp.src('./lib/**/*.js')
        .pipe(tunic()); // adds `.tunic` property to `file` object

## Test

    $ npm test

## Contribute [![Tasks][waffle-img]][waffle-url] [![Chat][gitter-img]][gitter-url] [![Tip][gittip-img]][gittip-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

## License

MIT

[coveralls-img]: http://img.shields.io/coveralls/togajs/tunic/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/togajs/tunic
[downloads-img]: http://img.shields.io/npm/dm/tunic.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/chat-togajs/tunic-blue.svg?style=flat-square
[gitter-url]:    https://gitter.im/togajs/tunic
[gittip-img]:    http://img.shields.io/gittip/shannonmoeller.svg?style=flat-square
[gittip-url]:    https://www.gittip.com/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/tunic.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/tunic
[travis-img]:    http://img.shields.io/travis/togajs/tunic.svg?style=flat-square
[travis-url]:    https://travis-ci.org/togajs/tunic
[waffle-img]:    http://img.shields.io/github/issues/togajs/tunic.svg?style=flat-square
[waffle-url]:    http://waffle.io/togajs/tunic
