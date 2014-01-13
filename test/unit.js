(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var mixIn = require('mout/object/mixIn');

/**
 * Line matching patterns.
 *
 * @type {Object.<String,RegExp>}
 */
var matchLines = {
    any: /^/gm,
    empty: /^$/gm,
    edge: /^[\t ]*\n|\n[\t ]*$/g
};

/**
 * Default C-style grammar.
 *
 * @type {Object.<String,RegExp>}
 */
var defaultGrammar = {
    blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,
    blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,
    indent: /^[\t \*]/gm,
    tagSplit: /^[\t ]*@/m,
    tagParse: /^(\w+)[\t \-]*(\{[^\}]+\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t \-]*([\s\S]+)?$/m,
    named: /^(arg(ument)?|augments|class|extends|method|param|prop(erty)?)$/
};

/**
 * Default options.
 *
 * @type {Object}
 */
var defaultOptions = {
    raw: false
};

/**
 * # Tunic
 *
 * The stupid doc-block parser. Generates an abstract syntax tree based on a
 * customizable regular-expression grammar. Defaults to C-style comment blocks,
 * so it supports JavaScript, PHP, C++, and even CSS right out of the box.
 *
 * Tags are parsed greedily. If it looks like a tag, it's a tag. What you do
 * with them is completely up to you. Render something human-readable, perhaps?
 *
 * @class Tunic
 * @param {String} [block]
 * @param {Object} [grammar]
 * @constructor
 */
function Tunic(block, grammar) {
    // Make `block` optional
    if (arguments.length === 1 && typeof block === 'object' && block) {
        grammar = block;
        block = undefined;
    }

    /** Support functional execution: `tunic(block, grammar)` */
    if (!(this instanceof Tunic)) {
        return new Tunic(grammar).parse(block);
    }

    // Set defaults
    this.grammar = mixIn({}, defaultGrammar, grammar);
    this.options = mixIn({}, defaultOptions);

    // Enforce context
    this.parse = this.parse.bind(this);
    this.parseBlock = this.parseBlock.bind(this);
    this.parseCode = this.parseCode.bind(this);
    this.parseDocBlock = this.parseDocBlock.bind(this);
    this.parseTag = this.parseTag.bind(this);
}

var proto = Tunic.prototype;

/**
 * @method parse
 * @param {String} block
 * @param {String} [options]
 * @return {String}
 */
proto.parse = function(block, options) {
    if (arguments.length === 2) {
        this.options = mixIn({}, defaultOptions, options);
    }

    return String(block)
        .split(this.grammar.blockSplit)
        .map(this.parseBlock);
};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
proto.parseBlock = function(block) {
    if (this.grammar.blockParse.test(block)) {
        return this.parseDocBlock(block);
    }

    return this.parseCode(block);
};

/**
 * @method parseCode
 * @param {String} [block]
 * @return {Object}
 */
proto.parseCode = function(block) {
    return {
        type: 'Code',
        body: String(block)
    };
};

/**
 * @method parseDocBlock
 * @param {String} [block]
 * @return {Object}
 */
proto.parseDocBlock = function(block) {
    block = String(block);

    var tags = this
        .normalizeDocBlock(block)
        .split(this.grammar.tagSplit);

    var token = {
        type: 'DocBlock',
        description: tags.shift(),
        tags: tags.map(this.parseTag)
    };

    if (this.options.raw) {
        token.raw = block;
    }

    return token;
};

/**
 * @method normalizeDocBlock
 * @param {String} block
 * @return {String}
 */
proto.normalizeDocBlock = function(block) {
    var grammar = this.grammar;

    // Trim comment wrappers
    var blockParse = grammar.blockParse;

    block = String(block)
        .replace(blockParse, '$1')
        .replace(matchLines.edge, '');

    // Unindent content
    var emptyLines;
    var indentedLines;
    var indent = grammar.indent;
    var lines = block.match(matchLines.any).length;

    while (lines > 0) {
        emptyLines = (block.match(matchLines.empty) || []).length;
        indentedLines = (block.match(indent) || []).length;

        if (indentedLines && (emptyLines + indentedLines === lines)) {
            // Strip leading indent characters
            block = block.replace(indent, '');
        } else {
            // Not indented anymore
            break;
        }
    }

    return block;
};

/**
 * @method parseTag
 * @param {String} [block]
 * @return {Object}
 */
proto.parseTag = function(block) {
    var grammar = this.grammar;
    var parts = String(block).match(grammar.tagParse);
    var tag = parts[1];
    var type = parts[2];
    var name = parts[3] || '';
    var description = parts[4] || '';
    var token = {};

    // Handle named tags

    if (!grammar.named.test(tag)) {
        if (name && description) {
            description = name + ' ' + description;
        } else if (name) {
            description = name;
        }

        name = undefined;
    }

    // Keep tokens light

    if (tag) {
        token.tag = tag;
    }

    if (type) {
        token.type = type;
    }

    if (name) {
        token.name = name;
    }

    if (description) {
        token.description = description;
    }

    return token;
};

module.exports = Tunic;

},{"mout/object/mixIn":11}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":7}],4:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],7:[function(require,module,exports){
var process=require("__browserify_process"),global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},{"./support/isBuffer":6,"__browserify_process":5,"inherits":4}],8:[function(require,module,exports){


    var _hasDontEnumBug,
        _dontEnums;

    function checkDontEnum(){
        _dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

        _hasDontEnumBug = true;

        for (var key in {'toString': null}) {
            _hasDontEnumBug = false;
        }
    }

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forIn(obj, fn, thisObj){
        var key, i = 0;
        // no need to check if argument is a real object that way we can use
        // it for arrays, functions, date, etc.

        //post-pone check till needed
        if (_hasDontEnumBug == null) checkDontEnum();

        for (key in obj) {
            if (exec(fn, obj, key, thisObj) === false) {
                break;
            }
        }

        if (_hasDontEnumBug) {
            while (key = _dontEnums[i++]) {
                // since we aren't using hasOwn check we need to make sure the
                // property was overwritten
                if (obj[key] !== Object.prototype[key]) {
                    if (exec(fn, obj, key, thisObj) === false) {
                        break;
                    }
                }
            }
        }
    }

    function exec(fn, obj, key, thisObj){
        return fn.call(thisObj, obj[key], key, obj);
    }

    module.exports = forIn;



},{}],9:[function(require,module,exports){
var hasOwn = require('./hasOwn');
var forIn = require('./forIn');

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forOwn(obj, fn, thisObj){
        forIn(obj, function(val, key){
            if (hasOwn(obj, key)) {
                return fn.call(thisObj, obj[key], key, obj);
            }
        });
    }

    module.exports = forOwn;



},{"./forIn":8,"./hasOwn":10}],10:[function(require,module,exports){


    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     module.exports = hasOwn;



},{}],11:[function(require,module,exports){
var forOwn = require('./forOwn');

    /**
    * Combine properties from all the objects into first one.
    * - This method affects target object in place, if you want to create a new Object pass an empty object as first param.
    * @param {object} target    Target Object
    * @param {...object} objects    Objects to be combined (0...n objects).
    * @return {object} Target Object.
    */
    function mixIn(target, objects){
        var i = 0,
            n = arguments.length,
            obj;
        while(++i < n){
            obj = arguments[i];
            if (obj != null) {
                forOwn(obj, copyProp, target);
            }
        }
        return target;
    }

    function copyProp(val, key){
        this[key] = val;
    }

    module.exports = mixIn;


},{"./forOwn":9}],12:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{Type}", "name": "[name]", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{Type}", "name": "[name]", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{Type}", "name": "[name]" }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{Type}", "name": "name" }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "[name]", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "[name]", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "name", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "name", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "[name]" }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "name" }] },
    { "type": "Code", "body": "\n" }
]

},{}],13:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" },
            { "tag": "tag", "description": "\n" }
        ],
        "raw": "{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" },
            { "tag": "tag" }
        ],
        "raw": "{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" },
            { "tag": "tag" }
        ],
        "raw": "{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" },
            { "tag": "tag", "description": "\n" }
        ],
        "raw": "    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" },
            { "tag": "tag" }
        ],
        "raw": "    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" },
            { "tag": "tag" }
        ],
        "raw": "    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}"
    },
    { "type": "Code", "body": "\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n" }
]

},{}],14:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "use strict;\nuse warnings;\n\nprint \"hello world\";\n\n" },
    {
        "type": "DocBlock",
        "description": "\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    my $foo = \"bar\";\n\n" },
            { "tag": "tag" }
        ],
        "raw": "=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = \"bar\";\n\n@tag\n\n=cut"
    },
    { "type": "Code", "body": "\n" }
]

},{}],15:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "" },
    { "type": "DocBlock", "description": "description", "tags": [] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "description", "tags": [] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "description", "tags": [] },
    { "type": "Code", "body": "\n" }
]

},{}],16:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "/**/\n" },
    { "type": "DocBlock", "description": "", "tags": [] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [] },
    { "type": "Code", "body": "\n" }
]

},{}],17:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n" }
]

},{}],18:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" },
            { "tag": "tag" }
        ],
        "raw": "/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" },
            { "tag": "tag" }
        ],
        "raw": "/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" },
            { "tag": "tag" }
        ],
        "raw": "/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" },
            { "tag": "tag" }
        ],
        "raw": "    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" },
            { "tag": "tag" }
        ],
        "raw": "    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */"
    },
    { "type": "Code", "body": "\n\n" },
    {
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": [
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" },
            { "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" },
            { "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" },
            { "tag": "tag" }
        ],
        "raw": "    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */"
    },
    { "type": "Code", "body": "\n" }
]

},{}],19:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "name" }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "[name]" }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "[name={}]" }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "name": "[name=\"hello world\"]" }] },
    { "type": "Code", "body": "\n" }
]

},{}],20:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "tag", "type": "{Type}", "description": "Description here." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "tag", "type": "{Type}", "description": "Description here." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "tag", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "tag", "description": "Description." }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "tag" }] },
    { "type": "Code", "body": "\n" }
]

},{}],21:[function(require,module,exports){
module.exports=[
    { "type": "Code", "body": "" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{Type}" }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{String|Object}" }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{Array.<Object.<String,Number>>}" }] },
    { "type": "Code", "body": "\n" },
    { "type": "DocBlock", "description": "", "tags": [{ "tag": "arg", "type": "{Function(String, ...[Number]): Number}", "name": "callback" }] },
    { "type": "Code", "body": "\n" }
]

},{}],22:[function(require,module,exports){
/*jshint maxlen:false */
'use strict';

var assert = require('assert');
var fs = require('fs');
var tunic = require('../../lib/tunic');
var Tunic = tunic;

describe('Tunic', function () {
    it('should ignore non-blocks', function() {
        var ignore = "// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n";

        assert.deepEqual(tunic(ignore), require('../expected/ignore.json'));
    });

    it('should parse empty blocks', function() {
        var empty = "/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n";

        assert.deepEqual(tunic(), [{ 'type': 'Code', 'body': 'undefined' }]);
        assert.deepEqual(tunic(''), [{ 'type': 'Code', 'body': '' }]);
        assert.deepEqual(tunic(null), [{ 'type': 'Code', 'body': 'null' }]);
        assert.deepEqual(tunic(empty), require('../expected/empty.json'));
    });

    it('should parse descriptions', function() {
        var desc = "/** description */\n/**\n * description\n */\n/**\ndescription\n*/\n";

        assert.deepEqual(tunic(desc), require('../expected/desc.json'));
    });

    it('should parse tags', function() {
        var tag = "/** @tag {Type} - Description here. */\n/** @tag {Type} Description here. */\n/** @tag - Description. */\n/** @tag Description. */\n/** @tag */\n";

        assert.deepEqual(tunic(tag), require('../expected/tag.json'));
    });

    it('should parse args', function() {
        var arg = "/** @arg {Type} [name] - Description. */\n/** @arg {Type} [name] Description. */\n/** @arg {Type} name - Description. */\n/** @arg {Type} name Description. */\n/** @arg {Type} [name] */\n/** @arg {Type} name */\n/** @arg [name] - Description. */\n/** @arg [name] Description. */\n/** @arg name - Description. */\n/** @arg name Description. */\n/** @arg [name] */\n/** @arg name */\n";

        assert.deepEqual(tunic(arg), require('../expected/arg.json'));
    });

    it('should parse types', function() {
        var type = "/** @arg {Type} */\n/** @arg {String|Object} */\n/** @arg {Array.<Object.<String,Number>>} */\n/** @arg {Function(String, ...[Number]): Number} callback */\n";

        assert.deepEqual(tunic(type), require('../expected/type.json'));
    });

    it('should parse names', function() {
        var name = "/** @arg name */\n/** @arg [name] */\n/** @arg [name={}] */\n/** @arg [name=\"hello world\"] */\n";

        assert.deepEqual(tunic(name), require('../expected/name.json'));
    });

    it('should handle indention', function() {
        var indent = "/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */\n\n/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */\n\n/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */\n\n    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */\n\n    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */\n\n    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */\n";
        var standardParser = new Tunic();
        var tokens = standardParser.parse(indent, {
            raw: true
        });

        assert.deepEqual(tokens, require('../expected/indent.json'));
    });

    it('should use custom handlebars grammar', function() {
        var custom = "{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}\n\n{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}\n\n{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}\n\n    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}\n\n    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}\n\n    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n";

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
        var custom = "use strict;\nuse warnings;\n\nprint \"hello world\";\n\n=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = \"bar\";\n\n@tag\n\n=cut\n";

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

},{"../../lib/tunic":1,"../expected/arg.json":12,"../expected/custom-hbs.json":13,"../expected/custom-perl.json":14,"../expected/desc.json":15,"../expected/empty.json":16,"../expected/ignore.json":17,"../expected/indent.json":18,"../expected/name.json":19,"../expected/tag.json":20,"../expected/type.json":21,"assert":3,"fs":2}]},{},[22])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3RvZ2Fqcy90dW5pYy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi90b2dhanMvdHVuaWMvbGliL3R1bmljLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi90b2dhanMvdHVuaWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvdG9nYWpzL3R1bmljL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9hc3NlcnQvYXNzZXJ0LmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi90b2dhanMvdHVuaWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3RvZ2Fqcy90dW5pYy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3RvZ2Fqcy90dW5pYy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvdG9nYWpzL3R1bmljL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3RvZ2Fqcy90dW5pYy9ub2RlX21vZHVsZXMvbW91dC9vYmplY3QvZm9ySW4uanMiLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3RvZ2Fqcy90dW5pYy9ub2RlX21vZHVsZXMvbW91dC9vYmplY3QvZm9yT3duLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi90b2dhanMvdHVuaWMvbm9kZV9tb2R1bGVzL21vdXQvb2JqZWN0L2hhc093bi5qcyIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvdG9nYWpzL3R1bmljL25vZGVfbW9kdWxlcy9tb3V0L29iamVjdC9taXhJbi5qcyIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvdG9nYWpzL3R1bmljL3Rlc3QvZXhwZWN0ZWQvYXJnLmpzb24iLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3RvZ2Fqcy90dW5pYy90ZXN0L2V4cGVjdGVkL2N1c3RvbS1oYnMuanNvbiIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvdG9nYWpzL3R1bmljL3Rlc3QvZXhwZWN0ZWQvY3VzdG9tLXBlcmwuanNvbiIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvdG9nYWpzL3R1bmljL3Rlc3QvZXhwZWN0ZWQvZGVzYy5qc29uIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi90b2dhanMvdHVuaWMvdGVzdC9leHBlY3RlZC9lbXB0eS5qc29uIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi90b2dhanMvdHVuaWMvdGVzdC9leHBlY3RlZC9pZ25vcmUuanNvbiIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvdG9nYWpzL3R1bmljL3Rlc3QvZXhwZWN0ZWQvaW5kZW50Lmpzb24iLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3RvZ2Fqcy90dW5pYy90ZXN0L2V4cGVjdGVkL25hbWUuanNvbiIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvdG9nYWpzL3R1bmljL3Rlc3QvZXhwZWN0ZWQvdGFnLmpzb24iLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3RvZ2Fqcy90dW5pYy90ZXN0L2V4cGVjdGVkL3R5cGUuanNvbiIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvdG9nYWpzL3R1bmljL3Rlc3Qvc3BlYy90dW5pYy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1peEluID0gcmVxdWlyZSgnbW91dC9vYmplY3QvbWl4SW4nKTtcblxuLyoqXG4gKiBMaW5lIG1hdGNoaW5nIHBhdHRlcm5zLlxuICpcbiAqIEB0eXBlIHtPYmplY3QuPFN0cmluZyxSZWdFeHA+fVxuICovXG52YXIgbWF0Y2hMaW5lcyA9IHtcbiAgICBhbnk6IC9eL2dtLFxuICAgIGVtcHR5OiAvXiQvZ20sXG4gICAgZWRnZTogL15bXFx0IF0qXFxufFxcbltcXHQgXSokL2dcbn07XG5cbi8qKlxuICogRGVmYXVsdCBDLXN0eWxlIGdyYW1tYXIuXG4gKlxuICogQHR5cGUge09iamVjdC48U3RyaW5nLFJlZ0V4cD59XG4gKi9cbnZhciBkZWZhdWx0R3JhbW1hciA9IHtcbiAgICBibG9ja1NwbGl0OiAvKF5bXFx0IF0qXFwvXFwqXFwqKD8hXFwvKVtcXHNcXFNdKj9cXHMqXFwqXFwvKS9tLFxuICAgIGJsb2NrUGFyc2U6IC9eW1xcdCBdKlxcL1xcKlxcKig/IVxcLykoW1xcc1xcU10qPylcXHMqXFwqXFwvL20sXG4gICAgaW5kZW50OiAvXltcXHQgXFwqXS9nbSxcbiAgICB0YWdTcGxpdDogL15bXFx0IF0qQC9tLFxuICAgIHRhZ1BhcnNlOiAvXihcXHcrKVtcXHQgXFwtXSooXFx7W15cXH1dK1xcfSk/W1xcdCBcXC1dKihcXFtbXlxcXV0qXFxdXFwqP3xcXFMqKT9bXFx0IFxcLV0qKFtcXHNcXFNdKyk/JC9tLFxuICAgIG5hbWVkOiAvXihhcmcodW1lbnQpP3xhdWdtZW50c3xjbGFzc3xleHRlbmRzfG1ldGhvZHxwYXJhbXxwcm9wKGVydHkpPykkL1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IG9wdGlvbnMuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHJhdzogZmFsc2Vcbn07XG5cbi8qKlxuICogIyBUdW5pY1xuICpcbiAqIFRoZSBzdHVwaWQgZG9jLWJsb2NrIHBhcnNlci4gR2VuZXJhdGVzIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIGJhc2VkIG9uIGFcbiAqIGN1c3RvbWl6YWJsZSByZWd1bGFyLWV4cHJlc3Npb24gZ3JhbW1hci4gRGVmYXVsdHMgdG8gQy1zdHlsZSBjb21tZW50IGJsb2NrcyxcbiAqIHNvIGl0IHN1cHBvcnRzIEphdmFTY3JpcHQsIFBIUCwgQysrLCBhbmQgZXZlbiBDU1MgcmlnaHQgb3V0IG9mIHRoZSBib3guXG4gKlxuICogVGFncyBhcmUgcGFyc2VkIGdyZWVkaWx5LiBJZiBpdCBsb29rcyBsaWtlIGEgdGFnLCBpdCdzIGEgdGFnLiBXaGF0IHlvdSBkb1xuICogd2l0aCB0aGVtIGlzIGNvbXBsZXRlbHkgdXAgdG8geW91LiBSZW5kZXIgc29tZXRoaW5nIGh1bWFuLXJlYWRhYmxlLCBwZXJoYXBzP1xuICpcbiAqIEBjbGFzcyBUdW5pY1xuICogQHBhcmFtIHtTdHJpbmd9IFtibG9ja11cbiAqIEBwYXJhbSB7T2JqZWN0fSBbZ3JhbW1hcl1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUdW5pYyhibG9jaywgZ3JhbW1hcikge1xuICAgIC8vIE1ha2UgYGJsb2NrYCBvcHRpb25hbFxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiBibG9jayA9PT0gJ29iamVjdCcgJiYgYmxvY2spIHtcbiAgICAgICAgZ3JhbW1hciA9IGJsb2NrO1xuICAgICAgICBibG9jayA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvKiogU3VwcG9ydCBmdW5jdGlvbmFsIGV4ZWN1dGlvbjogYHR1bmljKGJsb2NrLCBncmFtbWFyKWAgKi9cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVHVuaWMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgVHVuaWMoZ3JhbW1hcikucGFyc2UoYmxvY2spO1xuICAgIH1cblxuICAgIC8vIFNldCBkZWZhdWx0c1xuICAgIHRoaXMuZ3JhbW1hciA9IG1peEluKHt9LCBkZWZhdWx0R3JhbW1hciwgZ3JhbW1hcik7XG4gICAgdGhpcy5vcHRpb25zID0gbWl4SW4oe30sIGRlZmF1bHRPcHRpb25zKTtcblxuICAgIC8vIEVuZm9yY2UgY29udGV4dFxuICAgIHRoaXMucGFyc2UgPSB0aGlzLnBhcnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJzZUJsb2NrID0gdGhpcy5wYXJzZUJsb2NrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJzZUNvZGUgPSB0aGlzLnBhcnNlQ29kZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucGFyc2VEb2NCbG9jayA9IHRoaXMucGFyc2VEb2NCbG9jay5iaW5kKHRoaXMpO1xuICAgIHRoaXMucGFyc2VUYWcgPSB0aGlzLnBhcnNlVGFnLmJpbmQodGhpcyk7XG59XG5cbnZhciBwcm90byA9IFR1bmljLnByb3RvdHlwZTtcblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlXG4gKiBAcGFyYW0ge1N0cmluZ30gYmxvY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc11cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xucHJvdG8ucGFyc2UgPSBmdW5jdGlvbihibG9jaywgb3B0aW9ucykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG1peEluKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZyhibG9jaylcbiAgICAgICAgLnNwbGl0KHRoaXMuZ3JhbW1hci5ibG9ja1NwbGl0KVxuICAgICAgICAubWFwKHRoaXMucGFyc2VCbG9jayk7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgcGFyc2VCbG9ja1xuICogQHBhcmFtIHtTdHJpbmd9IFtibG9ja11cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xucHJvdG8ucGFyc2VCbG9jayA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgaWYgKHRoaXMuZ3JhbW1hci5ibG9ja1BhcnNlLnRlc3QoYmxvY2spKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRG9jQmxvY2soYmxvY2spO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcnNlQ29kZShibG9jayk7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgcGFyc2VDb2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Jsb2NrXVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5wcm90by5wYXJzZUNvZGUgPSBmdW5jdGlvbihibG9jaykge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdDb2RlJyxcbiAgICAgICAgYm9keTogU3RyaW5nKGJsb2NrKVxuICAgIH07XG59O1xuXG4vKipcbiAqIEBtZXRob2QgcGFyc2VEb2NCbG9ja1xuICogQHBhcmFtIHtTdHJpbmd9IFtibG9ja11cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xucHJvdG8ucGFyc2VEb2NCbG9jayA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgYmxvY2sgPSBTdHJpbmcoYmxvY2spO1xuXG4gICAgdmFyIHRhZ3MgPSB0aGlzXG4gICAgICAgIC5ub3JtYWxpemVEb2NCbG9jayhibG9jaylcbiAgICAgICAgLnNwbGl0KHRoaXMuZ3JhbW1hci50YWdTcGxpdCk7XG5cbiAgICB2YXIgdG9rZW4gPSB7XG4gICAgICAgIHR5cGU6ICdEb2NCbG9jaycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiB0YWdzLnNoaWZ0KCksXG4gICAgICAgIHRhZ3M6IHRhZ3MubWFwKHRoaXMucGFyc2VUYWcpXG4gICAgfTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucmF3KSB7XG4gICAgICAgIHRva2VuLnJhdyA9IGJsb2NrO1xuICAgIH1cblxuICAgIHJldHVybiB0b2tlbjtcbn07XG5cbi8qKlxuICogQG1ldGhvZCBub3JtYWxpemVEb2NCbG9ja1xuICogQHBhcmFtIHtTdHJpbmd9IGJsb2NrXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbnByb3RvLm5vcm1hbGl6ZURvY0Jsb2NrID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgICB2YXIgZ3JhbW1hciA9IHRoaXMuZ3JhbW1hcjtcblxuICAgIC8vIFRyaW0gY29tbWVudCB3cmFwcGVyc1xuICAgIHZhciBibG9ja1BhcnNlID0gZ3JhbW1hci5ibG9ja1BhcnNlO1xuXG4gICAgYmxvY2sgPSBTdHJpbmcoYmxvY2spXG4gICAgICAgIC5yZXBsYWNlKGJsb2NrUGFyc2UsICckMScpXG4gICAgICAgIC5yZXBsYWNlKG1hdGNoTGluZXMuZWRnZSwgJycpO1xuXG4gICAgLy8gVW5pbmRlbnQgY29udGVudFxuICAgIHZhciBlbXB0eUxpbmVzO1xuICAgIHZhciBpbmRlbnRlZExpbmVzO1xuICAgIHZhciBpbmRlbnQgPSBncmFtbWFyLmluZGVudDtcbiAgICB2YXIgbGluZXMgPSBibG9jay5tYXRjaChtYXRjaExpbmVzLmFueSkubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGxpbmVzID4gMCkge1xuICAgICAgICBlbXB0eUxpbmVzID0gKGJsb2NrLm1hdGNoKG1hdGNoTGluZXMuZW1wdHkpIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgIGluZGVudGVkTGluZXMgPSAoYmxvY2subWF0Y2goaW5kZW50KSB8fCBbXSkubGVuZ3RoO1xuXG4gICAgICAgIGlmIChpbmRlbnRlZExpbmVzICYmIChlbXB0eUxpbmVzICsgaW5kZW50ZWRMaW5lcyA9PT0gbGluZXMpKSB7XG4gICAgICAgICAgICAvLyBTdHJpcCBsZWFkaW5nIGluZGVudCBjaGFyYWN0ZXJzXG4gICAgICAgICAgICBibG9jayA9IGJsb2NrLnJlcGxhY2UoaW5kZW50LCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBOb3QgaW5kZW50ZWQgYW55bW9yZVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmxvY2s7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgcGFyc2VUYWdcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbnByb3RvLnBhcnNlVGFnID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgICB2YXIgZ3JhbW1hciA9IHRoaXMuZ3JhbW1hcjtcbiAgICB2YXIgcGFydHMgPSBTdHJpbmcoYmxvY2spLm1hdGNoKGdyYW1tYXIudGFnUGFyc2UpO1xuICAgIHZhciB0YWcgPSBwYXJ0c1sxXTtcbiAgICB2YXIgdHlwZSA9IHBhcnRzWzJdO1xuICAgIHZhciBuYW1lID0gcGFydHNbM10gfHwgJyc7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gcGFydHNbNF0gfHwgJyc7XG4gICAgdmFyIHRva2VuID0ge307XG5cbiAgICAvLyBIYW5kbGUgbmFtZWQgdGFnc1xuXG4gICAgaWYgKCFncmFtbWFyLm5hbWVkLnRlc3QodGFnKSkge1xuICAgICAgICBpZiAobmFtZSAmJiBkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBuYW1lICsgJyAnICsgZGVzY3JpcHRpb247XG4gICAgICAgIH0gZWxzZSBpZiAobmFtZSkge1xuICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBuYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgbmFtZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBLZWVwIHRva2VucyBsaWdodFxuXG4gICAgaWYgKHRhZykge1xuICAgICAgICB0b2tlbi50YWcgPSB0YWc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUpIHtcbiAgICAgICAgdG9rZW4udHlwZSA9IHR5cGU7XG4gICAgfVxuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgICAgdG9rZW4ubmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRva2VuLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHRva2VuO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUdW5pYztcbiIsbnVsbCwiLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHdoZW4gdXNlZCBpbiBub2RlLCB0aGlzIHdpbGwgYWN0dWFsbHkgbG9hZCB0aGUgdXRpbCBtb2R1bGUgd2UgZGVwZW5kIG9uXG4vLyB2ZXJzdXMgbG9hZGluZyB0aGUgYnVpbHRpbiB1dGlsIG1vZHVsZSBhcyBoYXBwZW5zIG90aGVyd2lzZVxuLy8gdGhpcyBpcyBhIGJ1ZyBpbiBub2RlIG1vZHVsZSBsb2FkaW5nIGFzIGZhciBhcyBJIGFtIGNvbmNlcm5lZFxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsLycpO1xuXG52YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubWVzc2FnZSA9IGdldE1lc3NhZ2UodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgfVxuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIG5vbiB2OCBicm93c2VycyBzbyB3ZSBjYW4gaGF2ZSBhIHN0YWNrdHJhY2VcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgdmFyIG91dCA9IGVyci5zdGFjaztcblxuICAgICAgLy8gdHJ5IHRvIHN0cmlwIHVzZWxlc3MgZnJhbWVzXG4gICAgICB2YXIgZm5fbmFtZSA9IHN0YWNrU3RhcnRGdW5jdGlvbi5uYW1lO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICBpZiAodXRpbC5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gJycgKyB2YWx1ZTtcbiAgfVxuICBpZiAodXRpbC5pc051bWJlcih2YWx1ZSkgJiYgKGlzTmFOKHZhbHVlKSB8fCAhaXNGaW5pdGUodmFsdWUpKSkge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICB9XG4gIGlmICh1dGlsLmlzRnVuY3Rpb24odmFsdWUpIHx8IHV0aWwuaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh1dGlsLmlzU3RyaW5nKHMpKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1lc3NhZ2Uoc2VsZikge1xuICByZXR1cm4gdHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkoc2VsZi5hY3R1YWwsIHJlcGxhY2VyKSwgMTI4KSArICcgJyArXG4gICAgICAgICBzZWxmLm9wZXJhdG9yICsgJyAnICtcbiAgICAgICAgIHRydW5jYXRlKEpTT04uc3RyaW5naWZ5KHNlbGYuZXhwZWN0ZWQsIHJlcGxhY2VyKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0J1ZmZlcihhY3R1YWwpICYmIHV0aWwuaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgaWYgKGFjdHVhbC5sZW5ndGggIT0gZXhwZWN0ZWQubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdHVhbC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFjdHVhbFtpXSAhPT0gZXhwZWN0ZWRbaV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICAvLyA3LjIuIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIERhdGUgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0RhdGUoYWN0dWFsKSAmJiB1dGlsLmlzRGF0ZShleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMyBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kXG4gIC8vIHByb3BlcnRpZXMgKGBnbG9iYWxgLCBgbXVsdGlsaW5lYCwgYGxhc3RJbmRleGAsIGBpZ25vcmVDYXNlYCkuXG4gIH0gZWxzZSBpZiAodXRpbC5pc1JlZ0V4cChhY3R1YWwpICYmIHV0aWwuaXNSZWdFeHAoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb3VyY2UgPT09IGV4cGVjdGVkLnNvdXJjZSAmJlxuICAgICAgICAgICBhY3R1YWwuZ2xvYmFsID09PSBleHBlY3RlZC5nbG9iYWwgJiZcbiAgICAgICAgICAgYWN0dWFsLm11bHRpbGluZSA9PT0gZXhwZWN0ZWQubXVsdGlsaW5lICYmXG4gICAgICAgICAgIGFjdHVhbC5sYXN0SW5kZXggPT09IGV4cGVjdGVkLmxhc3RJbmRleCAmJlxuICAgICAgICAgICBhY3R1YWwuaWdub3JlQ2FzZSA9PT0gZXhwZWN0ZWQuaWdub3JlQ2FzZTtcblxuICAvLyA3LjQuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoIXV0aWwuaXNPYmplY3QoYWN0dWFsKSAmJiAhdXRpbC5pc09iamVjdChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIDcuNSBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIpIHtcbiAgaWYgKHV0aWwuaXNOdWxsT3JVbmRlZmluZWQoYSkgfHwgdXRpbC5pc051bGxPclVuZGVmaW5lZChiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS5cbiAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICAvL35+fkkndmUgbWFuYWdlZCB0byBicmVhayBPYmplY3Qua2V5cyB0aHJvdWdoIHNjcmV3eSBhcmd1bWVudHMgcGFzc2luZy5cbiAgLy8gICBDb252ZXJ0aW5nIHRvIGFycmF5IHNvbHZlcyB0aGUgcHJvYmxlbS5cbiAgaWYgKGlzQXJndW1lbnRzKGEpKSB7XG4gICAgaWYgKCFpc0FyZ3VtZW50cyhiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIpO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIGthID0gb2JqZWN0S2V5cyhhKSxcbiAgICAgICAga2IgPSBvYmplY3RLZXlzKGIpLFxuICAgICAgICBrZXksIGk7XG4gIH0gY2F0Y2ggKGUpIHsvL2hhcHBlbnMgd2hlbiBvbmUgaXMgYSBzdHJpbmcgbGl0ZXJhbCBhbmQgdGhlIG90aGVyIGlzbid0XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoa2V5cyBpbmNvcnBvcmF0ZXNcbiAgLy8gaGFzT3duUHJvcGVydHkpXG4gIGlmIChrYS5sZW5ndGggIT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIV9kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0pKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIDguIFRoZSBub24tZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGZvciBhbnkgZGVlcCBpbmVxdWFsaXR5LlxuLy8gYXNzZXJ0Lm5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3REZWVwRXF1YWwgPSBmdW5jdGlvbiBub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT09JywgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChleHBlY3RlZC5jYWxsKHt9LCBhY3R1YWwpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh1dGlsLmlzU3RyaW5nKGV4cGVjdGVkKSkge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICB0cnkge1xuICAgIGJsb2NrKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhY3R1YWwgPSBlO1xuICB9XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKS4nIDogJy4nKSArXG4gICAgICAgICAgICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoIXNob3VsZFRocm93ICYmIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmXG4gICAgICAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzLmFwcGx5KHRoaXMsIFt0cnVlXS5jb25jYXQocFNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbZmFsc2VdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB7dGhyb3cgZXJyO319O1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd24uY2FsbChvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsInZhciBwcm9jZXNzPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKSxnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9Oy8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsIlxuXG4gICAgdmFyIF9oYXNEb250RW51bUJ1ZyxcbiAgICAgICAgX2RvbnRFbnVtcztcblxuICAgIGZ1bmN0aW9uIGNoZWNrRG9udEVudW0oKXtcbiAgICAgICAgX2RvbnRFbnVtcyA9IFtcbiAgICAgICAgICAgICAgICAndG9TdHJpbmcnLFxuICAgICAgICAgICAgICAgICd0b0xvY2FsZVN0cmluZycsXG4gICAgICAgICAgICAgICAgJ3ZhbHVlT2YnLFxuICAgICAgICAgICAgICAgICdoYXNPd25Qcm9wZXJ0eScsXG4gICAgICAgICAgICAgICAgJ2lzUHJvdG90eXBlT2YnLFxuICAgICAgICAgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG4gICAgICAgICAgICAgICAgJ2NvbnN0cnVjdG9yJ1xuICAgICAgICAgICAgXTtcblxuICAgICAgICBfaGFzRG9udEVudW1CdWcgPSB0cnVlO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB7J3RvU3RyaW5nJzogbnVsbH0pIHtcbiAgICAgICAgICAgIF9oYXNEb250RW51bUJ1ZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2ltaWxhciB0byBBcnJheS9mb3JFYWNoIGJ1dCB3b3JrcyBvdmVyIG9iamVjdCBwcm9wZXJ0aWVzIGFuZCBmaXhlcyBEb24ndFxuICAgICAqIEVudW0gYnVnIG9uIElFLlxuICAgICAqIGJhc2VkIG9uOiBodHRwOi8vd2hhdHRoZWhlYWRzYWlkLmNvbS8yMDEwLzEwL2Etc2FmZXItb2JqZWN0LWtleXMtY29tcGF0aWJpbGl0eS1pbXBsZW1lbnRhdGlvblxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvckluKG9iaiwgZm4sIHRoaXNPYmope1xuICAgICAgICB2YXIga2V5LCBpID0gMDtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjaGVjayBpZiBhcmd1bWVudCBpcyBhIHJlYWwgb2JqZWN0IHRoYXQgd2F5IHdlIGNhbiB1c2VcbiAgICAgICAgLy8gaXQgZm9yIGFycmF5cywgZnVuY3Rpb25zLCBkYXRlLCBldGMuXG5cbiAgICAgICAgLy9wb3N0LXBvbmUgY2hlY2sgdGlsbCBuZWVkZWRcbiAgICAgICAgaWYgKF9oYXNEb250RW51bUJ1ZyA9PSBudWxsKSBjaGVja0RvbnRFbnVtKCk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAoZXhlYyhmbiwgb2JqLCBrZXksIHRoaXNPYmopID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9oYXNEb250RW51bUJ1Zykge1xuICAgICAgICAgICAgd2hpbGUgKGtleSA9IF9kb250RW51bXNbaSsrXSkge1xuICAgICAgICAgICAgICAgIC8vIHNpbmNlIHdlIGFyZW4ndCB1c2luZyBoYXNPd24gY2hlY2sgd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlXG4gICAgICAgICAgICAgICAgLy8gcHJvcGVydHkgd2FzIG92ZXJ3cml0dGVuXG4gICAgICAgICAgICAgICAgaWYgKG9ialtrZXldICE9PSBPYmplY3QucHJvdG90eXBlW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4ZWMoZm4sIG9iaiwga2V5LCB0aGlzT2JqKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhlYyhmbiwgb2JqLCBrZXksIHRoaXNPYmope1xuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzT2JqLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZm9ySW47XG5cblxuIiwidmFyIGhhc093biA9IHJlcXVpcmUoJy4vaGFzT3duJyk7XG52YXIgZm9ySW4gPSByZXF1aXJlKCcuL2ZvckluJyk7XG5cbiAgICAvKipcbiAgICAgKiBTaW1pbGFyIHRvIEFycmF5L2ZvckVhY2ggYnV0IHdvcmtzIG92ZXIgb2JqZWN0IHByb3BlcnRpZXMgYW5kIGZpeGVzIERvbid0XG4gICAgICogRW51bSBidWcgb24gSUUuXG4gICAgICogYmFzZWQgb246IGh0dHA6Ly93aGF0dGhlaGVhZHNhaWQuY29tLzIwMTAvMTAvYS1zYWZlci1vYmplY3Qta2V5cy1jb21wYXRpYmlsaXR5LWltcGxlbWVudGF0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9yT3duKG9iaiwgZm4sIHRoaXNPYmope1xuICAgICAgICBmb3JJbihvYmosIGZ1bmN0aW9uKHZhbCwga2V5KXtcbiAgICAgICAgICAgIGlmIChoYXNPd24ob2JqLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpc09iaiwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmb3JPd247XG5cblxuIiwiXG5cbiAgICAvKipcbiAgICAgKiBTYWZlciBPYmplY3QuaGFzT3duUHJvcGVydHlcbiAgICAgKi9cbiAgICAgZnVuY3Rpb24gaGFzT3duKG9iaiwgcHJvcCl7XG4gICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG4gICAgIH1cblxuICAgICBtb2R1bGUuZXhwb3J0cyA9IGhhc093bjtcblxuXG4iLCJ2YXIgZm9yT3duID0gcmVxdWlyZSgnLi9mb3JPd24nKTtcblxuICAgIC8qKlxuICAgICogQ29tYmluZSBwcm9wZXJ0aWVzIGZyb20gYWxsIHRoZSBvYmplY3RzIGludG8gZmlyc3Qgb25lLlxuICAgICogLSBUaGlzIG1ldGhvZCBhZmZlY3RzIHRhcmdldCBvYmplY3QgaW4gcGxhY2UsIGlmIHlvdSB3YW50IHRvIGNyZWF0ZSBhIG5ldyBPYmplY3QgcGFzcyBhbiBlbXB0eSBvYmplY3QgYXMgZmlyc3QgcGFyYW0uXG4gICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0ICAgIFRhcmdldCBPYmplY3RcbiAgICAqIEBwYXJhbSB7Li4ub2JqZWN0fSBvYmplY3RzICAgIE9iamVjdHMgdG8gYmUgY29tYmluZWQgKDAuLi5uIG9iamVjdHMpLlxuICAgICogQHJldHVybiB7b2JqZWN0fSBUYXJnZXQgT2JqZWN0LlxuICAgICovXG4gICAgZnVuY3Rpb24gbWl4SW4odGFyZ2V0LCBvYmplY3RzKXtcbiAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgbiA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgICAgICBvYmo7XG4gICAgICAgIHdoaWxlKCsraSA8IG4pe1xuICAgICAgICAgICAgb2JqID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKG9iaiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yT3duKG9iaiwgY29weVByb3AsIHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb3B5UHJvcCh2YWwsIGtleSl7XG4gICAgICAgIHRoaXNba2V5XSA9IHZhbDtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IG1peEluO1xuXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwiW25hbWVdXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbi5cIiB9XSB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlwiLCBcInRhZ3NcIjogW3sgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIltuYW1lXVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcIm5hbWVcIjogXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbi5cIiB9XSB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlwiLCBcInRhZ3NcIjogW3sgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uLlwiIH1dIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwiW25hbWVdXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcIm5hbWVcIjogXCJuYW1lXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwiYXJnXCIsIFwibmFtZVwiOiBcIltuYW1lXVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwiYXJnXCIsIFwibmFtZVwiOiBcIltuYW1lXVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwiYXJnXCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uLlwiIH1dIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbeyBcInRhZ1wiOiBcImFyZ1wiLCBcIm5hbWVcIjogXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbi5cIiB9XSB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlwiLCBcInRhZ3NcIjogW3sgXCJ0YWdcIjogXCJhcmdcIiwgXCJuYW1lXCI6IFwiW25hbWVdXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwiYXJnXCIsIFwibmFtZVwiOiBcIm5hbWVcIiB9XSB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlwiIH0sXG4gICAge1xuICAgICAgICBcInR5cGVcIjogXCJEb2NCbG9ja1wiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG5cXG5cIixcbiAgICAgICAgXCJ0YWdzXCI6IFtcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uLlxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcIm5hbWVcIjogXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImV4YW1wbGVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlxcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcInRhZ1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXFxuXCIgfVxuICAgICAgICBdLFxuICAgICAgICBcInJhd1wiOiBcInt7IS0tLVxcbiAgISAjIFRpdGxlXFxuICAhXFxuICAhIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgISBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICEgdHlwZSB0aGluZ3MuXFxuICAhXFxuICAhIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgIVxcbiAgISAqIExpa2VcXG4gICEgKiBMaXN0c1xcbiAgIVxcbiAgISAgICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG4gICFcXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAhXFxuICAhICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAgIVxcbiAgISBAZXhhbXBsZVxcbiAgIVxcbiAgISAgICAgPHVsPlxcbiAgISAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAhICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAhICAgICAgICAge3svZWFjaH19XFxuICAhICAgICA8L3VsPlxcbiAgIVxcbiAgISBAdGFnXFxuICAhLS19fVwiXG4gICAgfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXFxuXCIgfSxcbiAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCIjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcblwiLFxuICAgICAgICBcInRhZ3NcIjogW1xuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiZXhhbXBsZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwidGFnXCIgfVxuICAgICAgICBdLFxuICAgICAgICBcInJhd1wiOiBcInt7IS0tLVxcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG5AdGFnXFxuLS19fVwiXG4gICAgfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXFxuXCIgfSxcbiAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCIjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT57e3NhbXBsZXN9fTwvY29kZT5cXG5cXG5cIixcbiAgICAgICAgXCJ0YWdzXCI6IFtcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uLlxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcIm5hbWVcIjogXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImV4YW1wbGVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlxcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcInRhZ1wiIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJyYXdcIjogXCJ7eyEtLS1cXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIDxjb2RlPnt7c2FtcGxlc319PC9jb2RlPlxcblxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgIEBleGFtcGxlXFxuXFxuICAgICAgICA8dWw+XFxuICAgICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAgIDwvdWw+XFxuXFxuICAgIEB0YWdcXG4tLX19XCJcbiAgICB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cXG5cIiB9LFxuICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuXCIsXG4gICAgICAgIFwidGFnc1wiOiBbXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcIm5hbWVcIjogXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbi5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcIm5hbWVcIjogXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJleGFtcGxlXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcXG5cXG4gICAgPHVsPlxcbiAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAge3svZWFjaH19XFxuICAgIDwvdWw+XFxuXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJ0YWdcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlxcblwiIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJyYXdcIjogXCIgICAge3shLS0tXFxuICAgICAgISAjIFRpdGxlXFxuICAgICAgIVxcbiAgICAgICEgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAgISBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICAhIHR5cGUgdGhpbmdzLlxcbiAgICAgICFcXG4gICAgICAhIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgICAgICFcXG4gICAgICAhICogTGlrZVxcbiAgICAgICEgKiBMaXN0c1xcbiAgICAgICFcXG4gICAgICAhICAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcbiAgICAgICFcXG4gICAgICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAhXFxuICAgICAgISAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gICAgICAhXFxuICAgICAgISBAZXhhbXBsZVxcbiAgICAgICFcXG4gICAgICAhICAgICA8dWw+XFxuICAgICAgISAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgISAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICEgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAhICAgICA8L3VsPlxcbiAgICAgICFcXG4gICAgICAhIEB0YWdcXG4gICAgICAhLS19fVwiXG4gICAgfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXFxuXCIgfSxcbiAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCIjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcblwiLFxuICAgICAgICBcInRhZ3NcIjogW1xuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiZXhhbXBsZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwidGFnXCIgfVxuICAgICAgICBdLFxuICAgICAgICBcInJhd1wiOiBcIiAgICB7eyEtLS1cXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIDx1bD5cXG4gICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICAgPC91bD5cXG5cXG4gICAgQHRhZ1xcbiAgICAtLX19XCJcbiAgICB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cXG5cIiB9LFxuICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnt7c2FtcGxlc319PC9jb2RlPlxcblxcblwiLFxuICAgICAgICBcInRhZ3NcIjogW1xuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiZXhhbXBsZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwidGFnXCIgfVxuICAgICAgICBdLFxuICAgICAgICBcInJhd1wiOiBcIiAgICB7eyEtLS1cXG4gICAgICAgICMgVGl0bGVcXG5cXG4gICAgICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAgICAgKiBMaWtlXFxuICAgICAgICAqIExpc3RzXFxuXFxuICAgICAgICAgICAgPGNvZGU+e3tzYW1wbGVzfX08L2NvZGU+XFxuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgICAgIEBleGFtcGxlXFxuXFxuICAgICAgICAgICAgPHVsPlxcbiAgICAgICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgICAgICAgICAge3svZWFjaH19XFxuICAgICAgICAgICAgPC91bD5cXG5cXG4gICAgICAgIEB0YWdcXG4gICAgLS19fVwiXG4gICAgfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXFxue3shIGlnbm9yZSB9fVxcbnt7IS0tIGlnbm9yZSAtLX19XFxue3shXFxuICAhIGlnbm9yZVxcbiAgIX19XFxuPCEtLSB7eyEtLS0gaWdub3JlIC0tPlxcbjwhLS0gaWdub3JlIH19IC0tPlxcblwiIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwidXNlIHN0cmljdDtcXG51c2Ugd2FybmluZ3M7XFxuXFxucHJpbnQgXFxcImhlbGxvIHdvcmxkXFxcIjtcXG5cXG5cIiB9LFxuICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlxcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIG15ICRjb2RlID0gXFxcInNhbXBsZXNcXFwiO1xcblxcblwiLFxuICAgICAgICBcInRhZ3NcIjogW1xuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiZXhhbXBsZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiXFxuXFxuICAgIG15ICRmb28gPSBcXFwiYmFyXFxcIjtcXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcInRhZ1wiIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJyYXdcIjogXCI9cG9kXFxuXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgbXkgJGNvZGUgPSBcXFwic2FtcGxlc1xcXCI7XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICBteSAkZm9vID0gXFxcImJhclxcXCI7XFxuXFxuQHRhZ1xcblxcbj1jdXRcIlxuICAgIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblwiIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJkZXNjcmlwdGlvblwiLCBcInRhZ3NcIjogW10gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJkZXNjcmlwdGlvblwiLCBcInRhZ3NcIjogW10gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJkZXNjcmlwdGlvblwiLCBcInRhZ3NcIjogW10gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCIvKiovXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFtdIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbXSB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlwiLCBcInRhZ3NcIjogW10gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFtdIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblwiIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiLy8gaWdub3JlXFxuLyogaWdub3JlICovXFxuLyohIGlnbm9yZSAqL1xcblxcbi8vXFxuLy8gaWdub3JlXFxuLy9cXG4vKlxcbiAqIGlnbm9yZVxcbiAqL1xcbi8qIVxcbiAqIGlnbm9yZVxcbiAqL1xcblxcbi8vIC8qKiBpZ25vcmVcXG52YXIgaWdub3JlID0gJy8qKiBpZ25vcmUgKi8nO1xcbnZhciBmb28gPSBmdW5jdGlvbigvKiogaWdub3JlICovKSB7fTtcXG5jb25zb2xlLmxvZyhmb28oaWdub3JlKSk7XFxuLy8gaWdub3JlICovXFxuXCIgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcIiB9LFxuICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcblxcblwiLFxuICAgICAgICBcInRhZ3NcIjogW1xuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiZXhhbXBsZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiXFxuXFxuICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcInRhZ1wiIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJyYXdcIjogXCIvKipcXG4gKiAjIFRpdGxlXFxuICpcXG4gKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gKiBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gKiB0eXBlIHRoaW5ncy5cXG4gKlxcbiAqIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAqXFxuICogKiBMaWtlXFxuICogKiBMaXN0c1xcbiAqXFxuICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAqXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKlxcbiAqICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAqXFxuICogQGV4YW1wbGVcXG4gKlxcbiAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICpcXG4gKiBAdGFnXFxuICovXCJcbiAgICB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cXG5cIiB9LFxuICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcblxcblwiLFxuICAgICAgICBcInRhZ3NcIjogW1xuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiZXhhbXBsZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiXFxuXFxuICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcInRhZ1wiIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJyYXdcIjogXCIvKipcXG4jIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9ICdzYW1wbGVzJztcXG5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbkBleGFtcGxlXFxuXFxuICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG5AdGFnXFxuICovXCJcbiAgICB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cXG5cIiB9LFxuICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcblxcblwiLFxuICAgICAgICBcInRhZ3NcIjogW1xuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiZXhhbXBsZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiXFxuXFxuICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcInRhZ1wiIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJyYXdcIjogXCIvKipcXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcblxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgIEBleGFtcGxlXFxuXFxuICAgICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuXFxuICAgIEB0YWdcXG4gKi9cIlxuICAgIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblxcblwiIH0sXG4gICAge1xuICAgICAgICBcInR5cGVcIjogXCJEb2NCbG9ja1wiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuXCIsXG4gICAgICAgIFwidGFnc1wiOiBbXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcIm5hbWVcIjogXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbi5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcIm5hbWVcIjogXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJleGFtcGxlXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcXG5cXG4gICAgdmFyIGZvbyA9ICdiYXInO1xcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwidGFnXCIgfVxuICAgICAgICBdLFxuICAgICAgICBcInJhd1wiOiBcIiAgICAvKipcXG4gICAgICogIyBUaXRsZVxcbiAgICAgKlxcbiAgICAgKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICogbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAqIHR5cGUgdGhpbmdzLlxcbiAgICAgKlxcbiAgICAgKiBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICAgICpcXG4gICAgICogKiBMaWtlXFxuICAgICAqICogTGlzdHNcXG4gICAgICpcXG4gICAgICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAgICAgKlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICpcXG4gICAgICogICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAgICAqXFxuICAgICAqIEBleGFtcGxlXFxuICAgICAqXFxuICAgICAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICAgICAqXFxuICAgICAqIEB0YWdcXG4gICAgICovXCJcbiAgICB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cXG5cIiB9LFxuICAgIHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcblxcblwiLFxuICAgICAgICBcInRhZ3NcIjogW1xuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJuYW1lXCI6IFwibmFtZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiZXhhbXBsZVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiXFxuXFxuICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcInRhZ1wiIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJyYXdcIjogXCIgICAgLyoqXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICB2YXIgY29kZSA9ICdzYW1wbGVzJztcXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgdmFyIGZvbyA9ICdiYXInO1xcblxcbiAgICBAdGFnXFxuICAgICAqL1wiXG4gICAgfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXFxuXCIgfSxcbiAgICB7XG4gICAgICAgIFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCIjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9ICdzYW1wbGVzJztcXG5cXG5cIixcbiAgICAgICAgXCJ0YWdzXCI6IFtcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uLlxcblwiIH0sXG4gICAgICAgICAgICB7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcIm5hbWVcIjogXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIjogXCJEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIsIFwibmFtZVwiOiBcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5cIiB9LFxuICAgICAgICAgICAgeyBcInRhZ1wiOiBcImV4YW1wbGVcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlxcblxcbiAgICB2YXIgZm9vID0gJ2Jhcic7XFxuXFxuXCIgfSxcbiAgICAgICAgICAgIHsgXCJ0YWdcIjogXCJ0YWdcIiB9XG4gICAgICAgIF0sXG4gICAgICAgIFwicmF3XCI6IFwiICAgIC8qKlxcbiAgICAgICAgIyBUaXRsZVxcblxcbiAgICAgICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICAgICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICAgICAqIExpa2VcXG4gICAgICAgICogTGlzdHNcXG5cXG4gICAgICAgICAgICB2YXIgY29kZSA9ICdzYW1wbGVzJztcXG5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICAgICAgQGV4YW1wbGVcXG5cXG4gICAgICAgICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuXFxuICAgICAgICBAdGFnXFxuICAgICovXCJcbiAgICB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbeyBcInRhZ1wiOiBcImFyZ1wiLCBcIm5hbWVcIjogXCJuYW1lXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwiYXJnXCIsIFwibmFtZVwiOiBcIltuYW1lXVwiIH1dIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbeyBcInRhZ1wiOiBcImFyZ1wiLCBcIm5hbWVcIjogXCJbbmFtZT17fV1cIiB9XSB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlwiLCBcInRhZ3NcIjogW3sgXCJ0YWdcIjogXCJhcmdcIiwgXCJuYW1lXCI6IFwiW25hbWU9XFxcImhlbGxvIHdvcmxkXFxcIl1cIiB9XSB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbeyBcInRhZ1wiOiBcInRhZ1wiLCBcInR5cGVcIjogXCJ7VHlwZX1cIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uIGhlcmUuXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwidGFnXCIsIFwidHlwZVwiOiBcIntUeXBlfVwiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24gaGVyZS5cIiB9XSB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlwiLCBcInRhZ3NcIjogW3sgXCJ0YWdcIjogXCJ0YWdcIiwgXCJkZXNjcmlwdGlvblwiOiBcIkRlc2NyaXB0aW9uLlwiIH1dIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbeyBcInRhZ1wiOiBcInRhZ1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiRGVzY3JpcHRpb24uXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwidGFnXCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcIiB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiRG9jQmxvY2tcIiwgXCJkZXNjcmlwdGlvblwiOiBcIlwiLCBcInRhZ3NcIjogW3sgXCJ0YWdcIjogXCJhcmdcIiwgXCJ0eXBlXCI6IFwie1R5cGV9XCIgfV0gfSxcbiAgICB7IFwidHlwZVwiOiBcIkNvZGVcIiwgXCJib2R5XCI6IFwiXFxuXCIgfSxcbiAgICB7IFwidHlwZVwiOiBcIkRvY0Jsb2NrXCIsIFwiZGVzY3JpcHRpb25cIjogXCJcIiwgXCJ0YWdzXCI6IFt7IFwidGFnXCI6IFwiYXJnXCIsIFwidHlwZVwiOiBcIntTdHJpbmd8T2JqZWN0fVwiIH1dIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7QXJyYXkuPE9iamVjdC48U3RyaW5nLE51bWJlcj4+fVwiIH1dIH0sXG4gICAgeyBcInR5cGVcIjogXCJDb2RlXCIsIFwiYm9keVwiOiBcIlxcblwiIH0sXG4gICAgeyBcInR5cGVcIjogXCJEb2NCbG9ja1wiLCBcImRlc2NyaXB0aW9uXCI6IFwiXCIsIFwidGFnc1wiOiBbeyBcInRhZ1wiOiBcImFyZ1wiLCBcInR5cGVcIjogXCJ7RnVuY3Rpb24oU3RyaW5nLCAuLi5bTnVtYmVyXSk6IE51bWJlcn1cIiwgXCJuYW1lXCI6IFwiY2FsbGJhY2tcIiB9XSB9LFxuICAgIHsgXCJ0eXBlXCI6IFwiQ29kZVwiLCBcImJvZHlcIjogXCJcXG5cIiB9XG5dXG4iLCIvKmpzaGludCBtYXhsZW46ZmFsc2UgKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciB0dW5pYyA9IHJlcXVpcmUoJy4uLy4uL2xpYi90dW5pYycpO1xudmFyIFR1bmljID0gdHVuaWM7XG5cbmRlc2NyaWJlKCdUdW5pYycsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGlnbm9yZSBub24tYmxvY2tzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZ25vcmUgPSBcIi8vIGlnbm9yZVxcbi8qIGlnbm9yZSAqL1xcbi8qISBpZ25vcmUgKi9cXG5cXG4vL1xcbi8vIGlnbm9yZVxcbi8vXFxuLypcXG4gKiBpZ25vcmVcXG4gKi9cXG4vKiFcXG4gKiBpZ25vcmVcXG4gKi9cXG5cXG4vLyAvKiogaWdub3JlXFxudmFyIGlnbm9yZSA9ICcvKiogaWdub3JlICovJztcXG52YXIgZm9vID0gZnVuY3Rpb24oLyoqIGlnbm9yZSAqLykge307XFxuY29uc29sZS5sb2coZm9vKGlnbm9yZSkpO1xcbi8vIGlnbm9yZSAqL1xcblwiO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodHVuaWMoaWdub3JlKSwgcmVxdWlyZSgnLi4vZXhwZWN0ZWQvaWdub3JlLmpzb24nKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGVtcHR5IGJsb2NrcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZW1wdHkgPSBcIi8qKi9cXG4vKioqL1xcbi8qKiAqL1xcbi8qKlxcbiAqXFxuICovXFxuLyoqXFxuXFxuKi9cXG5cIjtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHR1bmljKCksIFt7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICd1bmRlZmluZWQnIH1dKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0dW5pYygnJyksIFt7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH1dKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0dW5pYyhudWxsKSwgW3sgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ251bGwnIH1dKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0dW5pYyhlbXB0eSksIHJlcXVpcmUoJy4uL2V4cGVjdGVkL2VtcHR5Lmpzb24nKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGRlc2NyaXB0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGVzYyA9IFwiLyoqIGRlc2NyaXB0aW9uICovXFxuLyoqXFxuICogZGVzY3JpcHRpb25cXG4gKi9cXG4vKipcXG5kZXNjcmlwdGlvblxcbiovXFxuXCI7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0dW5pYyhkZXNjKSwgcmVxdWlyZSgnLi4vZXhwZWN0ZWQvZGVzYy5qc29uJykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSB0YWdzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0YWcgPSBcIi8qKiBAdGFnIHtUeXBlfSAtIERlc2NyaXB0aW9uIGhlcmUuICovXFxuLyoqIEB0YWcge1R5cGV9IERlc2NyaXB0aW9uIGhlcmUuICovXFxuLyoqIEB0YWcgLSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQHRhZyBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQHRhZyAqL1xcblwiO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodHVuaWModGFnKSwgcmVxdWlyZSgnLi4vZXhwZWN0ZWQvdGFnLmpzb24nKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGFyZ3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZyA9IFwiLyoqIEBhcmcge1R5cGV9IFtuYW1lXSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIHtUeXBlfSBbbmFtZV0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcge1R5cGV9IG5hbWUgLSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyB7VHlwZX0gW25hbWVdICovXFxuLyoqIEBhcmcge1R5cGV9IG5hbWUgKi9cXG4vKiogQGFyZyBbbmFtZV0gLSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyBbbmFtZV0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcgbmFtZSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIG5hbWUgRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcgW25hbWVdICovXFxuLyoqIEBhcmcgbmFtZSAqL1xcblwiO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodHVuaWMoYXJnKSwgcmVxdWlyZSgnLi4vZXhwZWN0ZWQvYXJnLmpzb24nKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIHR5cGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0eXBlID0gXCIvKiogQGFyZyB7VHlwZX0gKi9cXG4vKiogQGFyZyB7U3RyaW5nfE9iamVjdH0gKi9cXG4vKiogQGFyZyB7QXJyYXkuPE9iamVjdC48U3RyaW5nLE51bWJlcj4+fSAqL1xcbi8qKiBAYXJnIHtGdW5jdGlvbihTdHJpbmcsIC4uLltOdW1iZXJdKTogTnVtYmVyfSBjYWxsYmFjayAqL1xcblwiO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodHVuaWModHlwZSksIHJlcXVpcmUoJy4uL2V4cGVjdGVkL3R5cGUuanNvbicpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgbmFtZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBcIi8qKiBAYXJnIG5hbWUgKi9cXG4vKiogQGFyZyBbbmFtZV0gKi9cXG4vKiogQGFyZyBbbmFtZT17fV0gKi9cXG4vKiogQGFyZyBbbmFtZT1cXFwiaGVsbG8gd29ybGRcXFwiXSAqL1xcblwiO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodHVuaWMobmFtZSksIHJlcXVpcmUoJy4uL2V4cGVjdGVkL25hbWUuanNvbicpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGluZGVudGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5kZW50ID0gXCIvKipcXG4gKiAjIFRpdGxlXFxuICpcXG4gKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gKiBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gKiB0eXBlIHRoaW5ncy5cXG4gKlxcbiAqIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAqXFxuICogKiBMaWtlXFxuICogKiBMaXN0c1xcbiAqXFxuICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAqXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKlxcbiAqICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAqXFxuICogQGV4YW1wbGVcXG4gKlxcbiAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICpcXG4gKiBAdGFnXFxuICovXFxuXFxuLyoqXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICB2YXIgZm9vID0gJ2Jhcic7XFxuXFxuQHRhZ1xcbiAqL1xcblxcbi8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgQHRhZ1xcbiAqL1xcblxcbiAgICAvKipcXG4gICAgICogIyBUaXRsZVxcbiAgICAgKlxcbiAgICAgKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICogbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAqIHR5cGUgdGhpbmdzLlxcbiAgICAgKlxcbiAgICAgKiBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICAgICpcXG4gICAgICogKiBMaWtlXFxuICAgICAqICogTGlzdHNcXG4gICAgICpcXG4gICAgICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAgICAgKlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICpcXG4gICAgICogICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAgICAqXFxuICAgICAqIEBleGFtcGxlXFxuICAgICAqXFxuICAgICAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICAgICAqXFxuICAgICAqIEB0YWdcXG4gICAgICovXFxuXFxuICAgIC8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgQHRhZ1xcbiAgICAgKi9cXG5cXG4gICAgLyoqXFxuICAgICAgICAjIFRpdGxlXFxuXFxuICAgICAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgICAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgICAgICogTGlrZVxcbiAgICAgICAgKiBMaXN0c1xcblxcbiAgICAgICAgICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcblxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgICAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgICAgIEB0YWdcXG4gICAgKi9cXG5cIjtcbiAgICAgICAgdmFyIHN0YW5kYXJkUGFyc2VyID0gbmV3IFR1bmljKCk7XG4gICAgICAgIHZhciB0b2tlbnMgPSBzdGFuZGFyZFBhcnNlci5wYXJzZShpbmRlbnQsIHtcbiAgICAgICAgICAgIHJhdzogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRva2VucywgcmVxdWlyZSgnLi4vZXhwZWN0ZWQvaW5kZW50Lmpzb24nKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBjdXN0b20gaGFuZGxlYmFycyBncmFtbWFyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdXN0b20gPSBcInt7IS0tLVxcbiAgISAjIFRpdGxlXFxuICAhXFxuICAhIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgISBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICEgdHlwZSB0aGluZ3MuXFxuICAhXFxuICAhIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgIVxcbiAgISAqIExpa2VcXG4gICEgKiBMaXN0c1xcbiAgIVxcbiAgISAgICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG4gICFcXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAhXFxuICAhICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAgIVxcbiAgISBAZXhhbXBsZVxcbiAgIVxcbiAgISAgICAgPHVsPlxcbiAgISAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAhICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAhICAgICAgICAge3svZWFjaH19XFxuICAhICAgICA8L3VsPlxcbiAgIVxcbiAgISBAdGFnXFxuICAhLS19fVxcblxcbnt7IS0tLVxcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG5AdGFnXFxuLS19fVxcblxcbnt7IS0tLVxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgPGNvZGU+e3tzYW1wbGVzfX08L2NvZGU+XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIDx1bD5cXG4gICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICAgPC91bD5cXG5cXG4gICAgQHRhZ1xcbi0tfX1cXG5cXG4gICAge3shLS0tXFxuICAgICAgISAjIFRpdGxlXFxuICAgICAgIVxcbiAgICAgICEgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAgISBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICAhIHR5cGUgdGhpbmdzLlxcbiAgICAgICFcXG4gICAgICAhIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgICAgICFcXG4gICAgICAhICogTGlrZVxcbiAgICAgICEgKiBMaXN0c1xcbiAgICAgICFcXG4gICAgICAhICAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcbiAgICAgICFcXG4gICAgICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAhXFxuICAgICAgISAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gICAgICAhXFxuICAgICAgISBAZXhhbXBsZVxcbiAgICAgICFcXG4gICAgICAhICAgICA8dWw+XFxuICAgICAgISAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgISAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICEgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAhICAgICA8L3VsPlxcbiAgICAgICFcXG4gICAgICAhIEB0YWdcXG4gICAgICAhLS19fVxcblxcbiAgICB7eyEtLS1cXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIDx1bD5cXG4gICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICAgPC91bD5cXG5cXG4gICAgQHRhZ1xcbiAgICAtLX19XFxuXFxuICAgIHt7IS0tLVxcbiAgICAgICAgIyBUaXRsZVxcblxcbiAgICAgICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICAgICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICAgICAqIExpa2VcXG4gICAgICAgICogTGlzdHNcXG5cXG4gICAgICAgICAgICA8Y29kZT57e3NhbXBsZXN9fTwvY29kZT5cXG5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICAgICAgQGV4YW1wbGVcXG5cXG4gICAgICAgICAgICA8dWw+XFxuICAgICAgICAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAgICAgICA8L3VsPlxcblxcbiAgICAgICAgQHRhZ1xcbiAgICAtLX19XFxuXFxue3shIGlnbm9yZSB9fVxcbnt7IS0tIGlnbm9yZSAtLX19XFxue3shXFxuICAhIGlnbm9yZVxcbiAgIX19XFxuPCEtLSB7eyEtLS0gaWdub3JlIC0tPlxcbjwhLS0gaWdub3JlIH19IC0tPlxcblwiO1xuXG4gICAgICAgIHZhciBoYW5kbGViYXJQYXJzZXIgPSBuZXcgVHVuaWMoe1xuICAgICAgICAgICAgYmxvY2tTcGxpdDogLyheW1xcdCBdKlxce1xceyEtLS0oPyEtKVtcXHNcXFNdKj9cXHMqLS1cXH1cXH0pL20sXG4gICAgICAgICAgICBibG9ja1BhcnNlOiAvXltcXHQgXSpcXHtcXHshLS0tKD8hLSkoW1xcc1xcU10qPylcXHMqLS1cXH1cXH0vbSxcbiAgICAgICAgICAgIGluZGVudDogL15bXFx0ICFdL2dtLFxuICAgICAgICAgICAgbmFtZWQ6IC9eKGFyZyhndW1lbnQpP3xkYXRhfHByb3AoZXJ0eSk/KSQvXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0b2tlbnMgPSBoYW5kbGViYXJQYXJzZXIucGFyc2UoY3VzdG9tLCB7XG4gICAgICAgICAgICByYXc6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0b2tlbnMsIHJlcXVpcmUoJy4uL2V4cGVjdGVkL2N1c3RvbS1oYnMuanNvbicpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdXNlIGN1c3RvbSBwZXJsIGdyYW1tYXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN1c3RvbSA9IFwidXNlIHN0cmljdDtcXG51c2Ugd2FybmluZ3M7XFxuXFxucHJpbnQgXFxcImhlbGxvIHdvcmxkXFxcIjtcXG5cXG49cG9kXFxuXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgbXkgJGNvZGUgPSBcXFwic2FtcGxlc1xcXCI7XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICBteSAkZm9vID0gXFxcImJhclxcXCI7XFxuXFxuQHRhZ1xcblxcbj1jdXRcXG5cIjtcblxuICAgICAgICB2YXIgcGVybFBhcnNlciA9IG5ldyBUdW5pYyh7XG4gICAgICAgICAgICBibG9ja1NwbGl0OiAvKF49cG9kW1xcc1xcU10qP1xcbj1jdXQkKS9tLFxuICAgICAgICAgICAgYmxvY2tQYXJzZTogL149cG9kKFtcXHNcXFNdKj8pXFxuPWN1dCQvbSxcbiAgICAgICAgICAgIG5hbWVkOiAvXihhcmcoZ3VtZW50KT98ZGF0YXxwcm9wKGVydHkpPykkL1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdG9rZW5zID0gcGVybFBhcnNlci5wYXJzZShjdXN0b20sIHtcbiAgICAgICAgICAgIHJhdzogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRva2VucywgcmVxdWlyZSgnLi4vZXhwZWN0ZWQvY3VzdG9tLXBlcmwuanNvbicpKTtcbiAgICB9KTtcbn0pO1xuIl19
