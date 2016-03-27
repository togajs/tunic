# `tunic`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][amazon-img]][amazon-url]

A documentation-block parser which generates a [DocTree][doctree] abstract syntax tree. Defaults to parsing [C-style block comments](https://en.wikipedia.org/wiki/C_syntax#Comments) and [Javadoc-style tags](https://en.wikipedia.org/wiki/Javadoc#Structure_of_a_Javadoc_comment), but many other pre-configured [comment styles](https://github.com/togajs/tunic/blob/master/src/commentStyles.js) and [tag styles](https://github.com/togajs/tunic/blob/master/src/tagStyles.js) are included.

Documentation blocks follow the conventions of other standard tools such as Javadoc, JSDoc, Google Closure, PHPDoc, etc. The primary difference is that nothing is inferred from the code. If you want it documented, _you_ must document it. This is why you can use `tunic` to parse inline documentation out of almost any language that supports multi-line comments.

## Install

```
$ npm install --save tunic
```

## Usage

TODO

## API

TODO

## Contribute

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

© Shannon Moeller <me@shannonmoeller.com> (http://shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/togajs/tunic/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/togajs/tunic
[downloads-img]: http://img.shields.io/npm/dm/tunic.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/togajs/toga
[npm-img]:       http://img.shields.io/npm/v/tunic.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/tunic
[travis-img]:    http://img.shields.io/travis/togajs/tunic.svg?style=flat-square
[travis-url]:    https://travis-ci.org/togajs/tunic
[waffle-img]:    http://img.shields.io/github/issues/togajs/tunic.svg?style=flat-square
[waffle-url]:    http://waffle.io/togajs/tunic
