# tunic

The stupid doc-block parser. Generates an abstract syntax tree based on a customizable regular-expression grammar. Defaults to C-style comment blocks, so it supports JavaScript, PHP, C++, and even CSS right out of the box.

Tags are parsed greedily. If it looks like a tag, it's a tag. What you do with them is completely up to you. Render something human-readable, perhaps?

[![NPM version](https://badge.fury.io/js/tunic.png)](http://badge.fury.io/js/tunic)
[![Build Status](https://travis-ci.org/togajs/tunic.png?branch=master)](https://travis-ci.org/togajs/tunic)
[![Coverage Status](https://coveralls.io/repos/togajs/tunic/badge.png?branch=master)](https://coveralls.io/r/togajs/tunic?branch=master)
[![Dependency Status](https://david-dm.org/togajs/tunic.png?theme=shields.io)](https://david-dm.org/togajs/tunic)

## Install

With [Node.js](http://nodejs.org):

    $ npm install tunic

## Documentation Blocks

Documentation blocks follow the conventions of other standard tools such as JSDoc, Google Closure, YUIDoc, PHPDoc, JavaDoc, etc. The primary difference is that nothing is inferred from the code. If you want it documented, you must document it. This is why you can use tunic to parse inline documentation out of almost any language that supports multi-line comments.

## AST

- Document
  - `type` _`String`_ "Tunic"
  - `blocks` _`Array.<Code|Comment>`_ An array of alternating `Code` and `Comment` objects.
- Code
  - `type` _`String`_ "Code"
  - `contents` _`String`_ Raw contents of the code between the comment blocks.
- Comment
  - `type` _`String`_ "Comment"
  - `description` _`String`_ Any text from a comment block that precedes the first tag.
  - `tags` _`Array.<Tag>`_ An array of `Tag` objects.
- Tag
  - `tag` _`String`_ The tag value (eg. `class` or `return`)
  - `type` _`String`_ The tag type (eg. `Array.<String>`)
  - `name` _`String`_ The name of the tag, if the tag is listed in the `namedTags` option.
  - `description` _`String`_ Any other text that precedes the next tag, or the end of the comment.

## API

### `new Tunic([options])`

- `options` `{Object}` Optional grammar overrides.
  - `options.extension` `{RegExp}`
  - `options.blockIndents` `{RegExp}`
  - `options.blockParse` `{RegExp}`
  - `options.blockSplit` `{RegExp}`
  - `options.tagParse` `{RegExp}`
  - `options.tagSplit` `{RegExp}`
  - `options.namedTags` `{Array.<String>}`

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

    var tunic = require('tunic');
    var ast = tunic().parse('/** ... */');

### Custom Options

    var tunic = require('tunic');

    var handlebars = tunic({
        blockIndents: /^[\t !]/gm,
        blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
        blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
        namedTags: ['arg', 'argument', 'data', 'prop', 'property']
    });

    var ast = handlebars.parse('{{!--- ... --}}\n<div> ...');

### Using `new` Operator

    var Tunic = require('tunic');

    var pod = new Tunic({
        blockParse: /^=doc\n([\s\S]*?)\n=cut$/m,
        blockSplit: /(^=doc\n[\s\S]*?\n=cut$)/m,
        namedTags: ['arg', 'argument', 'data', 'prop', 'property']
    });

    var ast = pod.parse('=doc\n ... \n=cut');

### Streams

    var gulp = require('gulp');
    var tunic = require('tunic');

    gulp.src('./lib/**/*.js')
        .pipe(tunic());

## Test

    $ npm test

## Compatibility

Tested to work in the following environments:

- Node (0.10)

Using:

- [Travis](https://travis-ci.org/togajs/tunic)

## License

MIT
