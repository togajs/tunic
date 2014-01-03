(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
 * Copies the enumerable properties of one or more objects to a target object.
 *
 * @type {Function}
 * @param {Object} target Target object.
 * @param {Object} [objs...] Objects with properties to copy.
 * @return {Object} Target object, augmented.
 */
var copier = function(target) {
    var arg;
    var key;
    var len = arguments.length;
    var i = 1;

    for (; i < len; i++) {
        arg = arguments[i];

        for (key in arg) {
            if (arg.hasOwnProperty(key)) {
                target[key] = arg[key];
            }
        }
    }

    return target;
};

/**
 * # Toga
 *
 * The stupid doc-block parser. Generates an abstract syntax tree based on a
 * customizable regular-expression grammar. Defaults to C-style comment blocks,
 * so it supports JavaScript, PHP, C++, and even CSS right out of the box.
 *
 * Tags are parsed greedily. If it looks like a tag, it's a tag. What you do
 * with them is completely up to you. Render something human-readable, perhaps?
 *
 * @class Toga
 * @param {String} [block]
 * @param {Object} [grammar]
 * @constructor
 */
function Toga(block, grammar) {
    // Make `block` optional
    if (arguments.length === 1 && typeof block === 'object' && block) {
        grammar = block;
        block = undefined;
    }

    // Support functional execution: `toga(block, grammar)`
    if (!(this instanceof Toga)) {
        return new Toga(grammar).parse(block);
    }

    // Set defaults
    this.grammar = copier({}, defaultGrammar, grammar);
    this.options = copier({}, defaultOptions);

    // Enforce context
    this.parse = this.parse.bind(this);
    this.parseBlock = this.parseBlock.bind(this);
    this.parseCode = this.parseCode.bind(this);
    this.parseDocBlock = this.parseDocBlock.bind(this);
    this.parseTag = this.parseTag.bind(this);
}

/**
 * @method parse
 * @param {String} block
 * @param {String} [options]
 * @return {String}
 */
Toga.prototype.parse = function(block, options) {
    if (arguments.length === 2) {
        this.options = copier({}, defaultOptions, options);
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
Toga.prototype.parseBlock = function(block) {
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
Toga.prototype.parseCode = function(block) {
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
Toga.prototype.parseDocBlock = function(block) {
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
Toga.prototype.normalizeDocBlock = function(block) {
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
Toga.prototype.parseTag = function(block) {
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

module.exports = Toga;

},{}],2:[function(require,module,exports){

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
            if (ev.source === window && ev.data === 'process-tick') {
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
/*jshint maxlen:false */
'use strict';

var assert = require('assert');
var fs = require('fs');
var toga = require('../../lib/toga');
var Toga = toga;

describe('Toga', function () {
    it('should ignore non-blocks', function() {
        var ignore = "// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n";

        assert.deepEqual(toga(ignore), [
            { 'type': 'Code', 'body': '// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = \'/** ignore */\';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n' }
        ]);
    });

    it('should parse empty blocks', function() {
        var empty = "/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n";

        assert.deepEqual(toga(), [
            { 'type': 'Code', 'body': 'undefined' }
        ]);

        assert.deepEqual(toga(null), [
            { 'type': 'Code', 'body': 'null' }
        ]);

        assert.deepEqual(toga(''), [
            { 'type': 'Code', 'body': '' }
        ]);

        assert.deepEqual(toga(empty), [
            { 'type': 'Code', 'body': '/**/\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse descriptions', function() {
        var desc = "/** description */\n/**\n * description\n */\n/**\ndescription\n*/\n";

        assert.deepEqual(toga(desc), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': 'description', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': 'description', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': 'description', 'tags': [] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse tags', function() {
        var tag = "/** @tag {Type} - Description here. */\n/** @tag {Type} Description here. */\n/** @tag - Description. */\n/** @tag Description. */\n/** @tag */\n";

        assert.deepEqual(toga(tag), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse args', function() {
        var arg = "/** @arg {Type} [name] - Description. */\n/** @arg {Type} [name] Description. */\n/** @arg {Type} name - Description. */\n/** @arg {Type} name Description. */\n/** @arg {Type} [name] */\n/** @arg {Type} name */\n/** @arg [name] - Description. */\n/** @arg [name] Description. */\n/** @arg name - Description. */\n/** @arg name Description. */\n/** @arg [name] */\n/** @arg name */\n";

        assert.deepEqual(toga(arg), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': 'name' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse types', function() {
        var type = "/** @arg {Type} */\n/** @arg {String|Object} */\n/** @arg {Array.<Object.<String,Number>>} */\n/** @arg {Function(String, ...[Number]): Number} callback */\n";

        assert.deepEqual(toga(type), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{String|Object}' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Array.<Object.<String,Number>>}' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Function(String, ...[Number]): Number}', 'name': 'callback' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse names', function() {
        var name = "/** @arg name */\n/** @arg [name] */\n/** @arg [name={}] */\n/** @arg [name=\"hello world\"] */\n";

        assert.deepEqual(toga(name), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name={}]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name="hello world"]' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should handle indention', function() {
        var indent = "/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */\n\n/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */\n\n/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */\n\n    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */\n\n    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */\n\n    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */\n";
        var standardParser = new Toga();
        var tokens = standardParser.parse(indent, {
            raw: true
        });

        assert.deepEqual(tokens, [
            { 'type': 'Code', 'body': '' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = \'samples\';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = \'bar\';\n *\n * @tag\n */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = \'bar\';\n\n@tag\n */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = \'samples\';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = \'bar\';\n     *\n     * @tag\n     */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n     */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = \'samples\';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = \'bar\';\n\n        @tag\n    */'
            },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should use custom handlebars grammar', function() {
        var custom = "{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}\n\n{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}\n\n{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}\n\n    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}\n\n    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}\n\n    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n";

        var handlebarParser = new Toga({
            blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
            blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
            indent: /^[\t !]/gm,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        });

        var tokens = handlebarParser.parse(custom, {
            raw: true
        });

        assert.deepEqual(tokens, [
            { 'type': 'Code', 'body': '' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag', 'description': '\n' }
                ],
                'raw': '{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag', 'description': '\n' }
                ],
                'raw': '    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}'
            },
            { 'type': 'Code', 'body': '\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n' }
        ]);
    });

    it('should use custom perl grammar', function() {
        var custom = "use strict;\nuse warnings;\n\nprint \"hello world\";\n\n=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = \"bar\";\n\n@tag\n\n=cut\n";

        var perlParser = new Toga({
            blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
            blockParse: /^=pod([\s\S]*?)\n=cut$/m,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        });

        var tokens = perlParser.parse(custom, {
            raw: true
        });

        assert.deepEqual(tokens, [
            { 'type': 'Code', 'body': 'use strict;\nuse warnings;\n\nprint "hello world";\n\n' },
            {
                'type': 'DocBlock',
                'description': '\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    my $foo = "bar";\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = "bar";\n\n@tag\n\n=cut'
            },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });
});

},{"../../lib/toga":1,"assert":3,"fs":2}]},{},[8])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3NoYW5ub25tb2VsbGVyL3RvZ2Evbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvc2hhbm5vbm1vZWxsZXIvdG9nYS9saWIvdG9nYS5qcyIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvc2hhbm5vbm1vZWxsZXIvdG9nYS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9hc3NlcnQvYXNzZXJ0LmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvc2hhbm5vbm1vZWxsZXIvdG9nYS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIi9Vc2Vycy9zbW9lbGxlci9SZXBvcy9naXRodWIvc2hhbm5vbm1vZWxsZXIvdG9nYS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL3Rlc3Qvc3BlYy90b2dhLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdQQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIExpbmUgbWF0Y2hpbmcgcGF0dGVybnMuXG4gKlxuICogQHR5cGUge09iamVjdC48U3RyaW5nLFJlZ0V4cD59XG4gKi9cbnZhciBtYXRjaExpbmVzID0ge1xuICAgIGFueTogL14vZ20sXG4gICAgZW1wdHk6IC9eJC9nbSxcbiAgICBlZGdlOiAvXltcXHQgXSpcXG58XFxuW1xcdCBdKiQvZ1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IEMtc3R5bGUgZ3JhbW1hci5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0LjxTdHJpbmcsUmVnRXhwPn1cbiAqL1xudmFyIGRlZmF1bHRHcmFtbWFyID0ge1xuICAgIGJsb2NrU3BsaXQ6IC8oXltcXHQgXSpcXC9cXCpcXCooPyFcXC8pW1xcc1xcU10qP1xccypcXCpcXC8pL20sXG4gICAgYmxvY2tQYXJzZTogL15bXFx0IF0qXFwvXFwqXFwqKD8hXFwvKShbXFxzXFxTXSo/KVxccypcXCpcXC8vbSxcbiAgICBpbmRlbnQ6IC9eW1xcdCBcXCpdL2dtLFxuICAgIHRhZ1NwbGl0OiAvXltcXHQgXSpAL20sXG4gICAgdGFnUGFyc2U6IC9eKFxcdyspW1xcdCBcXC1dKihcXHtbXlxcfV0rXFx9KT9bXFx0IFxcLV0qKFxcW1teXFxdXSpcXF1cXCo/fFxcUyopP1tcXHQgXFwtXSooW1xcc1xcU10rKT8kL20sXG4gICAgbmFtZWQ6IC9eKGFyZyh1bWVudCk/fGF1Z21lbnRzfGNsYXNzfGV4dGVuZHN8bWV0aG9kfHBhcmFtfHByb3AoZXJ0eSk/KSQvXG59O1xuXG4vKipcbiAqIERlZmF1bHQgb3B0aW9ucy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgcmF3OiBmYWxzZVxufTtcblxuLyoqXG4gKiBDb3BpZXMgdGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBvbmUgb3IgbW9yZSBvYmplY3RzIHRvIGEgdGFyZ2V0IG9iamVjdC5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IFRhcmdldCBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW29ianMuLi5dIE9iamVjdHMgd2l0aCBwcm9wZXJ0aWVzIHRvIGNvcHkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRhcmdldCBvYmplY3QsIGF1Z21lbnRlZC5cbiAqL1xudmFyIGNvcGllciA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIHZhciBhcmc7XG4gICAgdmFyIGtleTtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgaSA9IDE7XG5cbiAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGFyZyA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgICBmb3IgKGtleSBpbiBhcmcpIHtcbiAgICAgICAgICAgIGlmIChhcmcuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gYXJnW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuLyoqXG4gKiAjIFRvZ2FcbiAqXG4gKiBUaGUgc3R1cGlkIGRvYy1ibG9jayBwYXJzZXIuIEdlbmVyYXRlcyBhbiBhYnN0cmFjdCBzeW50YXggdHJlZSBiYXNlZCBvbiBhXG4gKiBjdXN0b21pemFibGUgcmVndWxhci1leHByZXNzaW9uIGdyYW1tYXIuIERlZmF1bHRzIHRvIEMtc3R5bGUgY29tbWVudCBibG9ja3MsXG4gKiBzbyBpdCBzdXBwb3J0cyBKYXZhU2NyaXB0LCBQSFAsIEMrKywgYW5kIGV2ZW4gQ1NTIHJpZ2h0IG91dCBvZiB0aGUgYm94LlxuICpcbiAqIFRhZ3MgYXJlIHBhcnNlZCBncmVlZGlseS4gSWYgaXQgbG9va3MgbGlrZSBhIHRhZywgaXQncyBhIHRhZy4gV2hhdCB5b3UgZG9cbiAqIHdpdGggdGhlbSBpcyBjb21wbGV0ZWx5IHVwIHRvIHlvdS4gUmVuZGVyIHNvbWV0aGluZyBodW1hbi1yZWFkYWJsZSwgcGVyaGFwcz9cbiAqXG4gKiBAY2xhc3MgVG9nYVxuICogQHBhcmFtIHtTdHJpbmd9IFtibG9ja11cbiAqIEBwYXJhbSB7T2JqZWN0fSBbZ3JhbW1hcl1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUb2dhKGJsb2NrLCBncmFtbWFyKSB7XG4gICAgLy8gTWFrZSBgYmxvY2tgIG9wdGlvbmFsXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGJsb2NrID09PSAnb2JqZWN0JyAmJiBibG9jaykge1xuICAgICAgICBncmFtbWFyID0gYmxvY2s7XG4gICAgICAgIGJsb2NrID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgZnVuY3Rpb25hbCBleGVjdXRpb246IGB0b2dhKGJsb2NrLCBncmFtbWFyKWBcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVG9nYSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUb2dhKGdyYW1tYXIpLnBhcnNlKGJsb2NrKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgZGVmYXVsdHNcbiAgICB0aGlzLmdyYW1tYXIgPSBjb3BpZXIoe30sIGRlZmF1bHRHcmFtbWFyLCBncmFtbWFyKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBjb3BpZXIoe30sIGRlZmF1bHRPcHRpb25zKTtcblxuICAgIC8vIEVuZm9yY2UgY29udGV4dFxuICAgIHRoaXMucGFyc2UgPSB0aGlzLnBhcnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJzZUJsb2NrID0gdGhpcy5wYXJzZUJsb2NrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJzZUNvZGUgPSB0aGlzLnBhcnNlQ29kZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucGFyc2VEb2NCbG9jayA9IHRoaXMucGFyc2VEb2NCbG9jay5iaW5kKHRoaXMpO1xuICAgIHRoaXMucGFyc2VUYWcgPSB0aGlzLnBhcnNlVGFnLmJpbmQodGhpcyk7XG59XG5cbi8qKlxuICogQG1ldGhvZCBwYXJzZVxuICogQHBhcmFtIHtTdHJpbmd9IGJsb2NrXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnNdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oYmxvY2ssIG9wdGlvbnMpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBjb3BpZXIoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gU3RyaW5nKGJsb2NrKVxuICAgICAgICAuc3BsaXQodGhpcy5ncmFtbWFyLmJsb2NrU3BsaXQpXG4gICAgICAgIC5tYXAodGhpcy5wYXJzZUJsb2NrKTtcbn07XG5cbi8qKlxuICogQG1ldGhvZCBwYXJzZUJsb2NrXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Jsb2NrXVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5Ub2dhLnByb3RvdHlwZS5wYXJzZUJsb2NrID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgICBpZiAodGhpcy5ncmFtbWFyLmJsb2NrUGFyc2UudGVzdChibG9jaykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEb2NCbG9jayhibG9jayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFyc2VDb2RlKGJsb2NrKTtcbn07XG5cbi8qKlxuICogQG1ldGhvZCBwYXJzZUNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlQ29kZSA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ0NvZGUnLFxuICAgICAgICBib2R5OiBTdHJpbmcoYmxvY2spXG4gICAgfTtcbn07XG5cbi8qKlxuICogQG1ldGhvZCBwYXJzZURvY0Jsb2NrXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Jsb2NrXVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5Ub2dhLnByb3RvdHlwZS5wYXJzZURvY0Jsb2NrID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgICBibG9jayA9IFN0cmluZyhibG9jayk7XG5cbiAgICB2YXIgdGFncyA9IHRoaXNcbiAgICAgICAgLm5vcm1hbGl6ZURvY0Jsb2NrKGJsb2NrKVxuICAgICAgICAuc3BsaXQodGhpcy5ncmFtbWFyLnRhZ1NwbGl0KTtcblxuICAgIHZhciB0b2tlbiA9IHtcbiAgICAgICAgdHlwZTogJ0RvY0Jsb2NrJyxcbiAgICAgICAgZGVzY3JpcHRpb246IHRhZ3Muc2hpZnQoKSxcbiAgICAgICAgdGFnczogdGFncy5tYXAodGhpcy5wYXJzZVRhZylcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yYXcpIHtcbiAgICAgICAgdG9rZW4ucmF3ID0gYmxvY2s7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRva2VuO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIG5vcm1hbGl6ZURvY0Jsb2NrXG4gKiBAcGFyYW0ge1N0cmluZ30gYmxvY2tcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuVG9nYS5wcm90b3R5cGUubm9ybWFsaXplRG9jQmxvY2sgPSBmdW5jdGlvbihibG9jaykge1xuICAgIHZhciBncmFtbWFyID0gdGhpcy5ncmFtbWFyO1xuXG4gICAgLy8gVHJpbSBjb21tZW50IHdyYXBwZXJzXG4gICAgdmFyIGJsb2NrUGFyc2UgPSBncmFtbWFyLmJsb2NrUGFyc2U7XG5cbiAgICBibG9jayA9IFN0cmluZyhibG9jaylcbiAgICAgICAgLnJlcGxhY2UoYmxvY2tQYXJzZSwgJyQxJylcbiAgICAgICAgLnJlcGxhY2UobWF0Y2hMaW5lcy5lZGdlLCAnJyk7XG5cbiAgICAvLyBVbmluZGVudCBjb250ZW50XG4gICAgdmFyIGVtcHR5TGluZXM7XG4gICAgdmFyIGluZGVudGVkTGluZXM7XG4gICAgdmFyIGluZGVudCA9IGdyYW1tYXIuaW5kZW50O1xuICAgIHZhciBsaW5lcyA9IGJsb2NrLm1hdGNoKG1hdGNoTGluZXMuYW55KS5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGluZXMgPiAwKSB7XG4gICAgICAgIGVtcHR5TGluZXMgPSAoYmxvY2subWF0Y2gobWF0Y2hMaW5lcy5lbXB0eSkgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgaW5kZW50ZWRMaW5lcyA9IChibG9jay5tYXRjaChpbmRlbnQpIHx8IFtdKS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGluZGVudGVkTGluZXMgJiYgKGVtcHR5TGluZXMgKyBpbmRlbnRlZExpbmVzID09PSBsaW5lcykpIHtcbiAgICAgICAgICAgIC8vIFN0cmlwIGxlYWRpbmcgaW5kZW50IGNoYXJhY3RlcnNcbiAgICAgICAgICAgIGJsb2NrID0gYmxvY2sucmVwbGFjZShpbmRlbnQsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vdCBpbmRlbnRlZCBhbnltb3JlXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBibG9jaztcbn07XG5cbi8qKlxuICogQG1ldGhvZCBwYXJzZVRhZ1xuICogQHBhcmFtIHtTdHJpbmd9IFtibG9ja11cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuVG9nYS5wcm90b3R5cGUucGFyc2VUYWcgPSBmdW5jdGlvbihibG9jaykge1xuICAgIHZhciBncmFtbWFyID0gdGhpcy5ncmFtbWFyO1xuICAgIHZhciBwYXJ0cyA9IFN0cmluZyhibG9jaykubWF0Y2goZ3JhbW1hci50YWdQYXJzZSk7XG4gICAgdmFyIHRhZyA9IHBhcnRzWzFdO1xuICAgIHZhciB0eXBlID0gcGFydHNbMl07XG4gICAgdmFyIG5hbWUgPSBwYXJ0c1szXSB8fCAnJztcbiAgICB2YXIgZGVzY3JpcHRpb24gPSBwYXJ0c1s0XSB8fCAnJztcbiAgICB2YXIgdG9rZW4gPSB7fTtcblxuICAgIC8vIEhhbmRsZSBuYW1lZCB0YWdzXG5cbiAgICBpZiAoIWdyYW1tYXIubmFtZWQudGVzdCh0YWcpKSB7XG4gICAgICAgIGlmIChuYW1lICYmIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbiA9IG5hbWUgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgICAgICAgfSBlbHNlIGlmIChuYW1lKSB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbiA9IG5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBuYW1lID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIEtlZXAgdG9rZW5zIGxpZ2h0XG5cbiAgICBpZiAodGFnKSB7XG4gICAgICAgIHRva2VuLnRhZyA9IHRhZztcbiAgICB9XG5cbiAgICBpZiAodHlwZSkge1xuICAgICAgICB0b2tlbi50eXBlID0gdHlwZTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSkge1xuICAgICAgICB0b2tlbi5uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdG9rZW4uZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9rZW47XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2E7XG4iLG51bGwsIi8vIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1VuaXRfVGVzdGluZy8xLjBcbi8vXG4vLyBUSElTIElTIE5PVCBURVNURUQgTk9SIExJS0VMWSBUTyBXT1JLIE9VVFNJREUgVjghXG4vL1xuLy8gT3JpZ2luYWxseSBmcm9tIG5hcndoYWwuanMgKGh0dHA6Ly9uYXJ3aGFsanMub3JnKVxuLy8gQ29weXJpZ2h0IChjKSAyMDA5IFRob21hcyBSb2JpbnNvbiA8Mjgwbm9ydGguY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0b1xuLy8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGVcbi8vIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vclxuLy8gc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbi8vIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyB3aGVuIHVzZWQgaW4gbm9kZSwgdGhpcyB3aWxsIGFjdHVhbGx5IGxvYWQgdGhlIHV0aWwgbW9kdWxlIHdlIGRlcGVuZCBvblxuLy8gdmVyc3VzIGxvYWRpbmcgdGhlIGJ1aWx0aW4gdXRpbCBtb2R1bGUgYXMgaGFwcGVucyBvdGhlcndpc2Vcbi8vIHRoaXMgaXMgYSBidWcgaW4gbm9kZSBtb2R1bGUgbG9hZGluZyBhcyBmYXIgYXMgSSBhbSBjb25jZXJuZWRcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbC8nKTtcblxudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vLyAxLiBUaGUgYXNzZXJ0IG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgdGhhdCB0aHJvd1xuLy8gQXNzZXJ0aW9uRXJyb3IncyB3aGVuIHBhcnRpY3VsYXIgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4gVGhlXG4vLyBhc3NlcnQgbW9kdWxlIG11c3QgY29uZm9ybSB0byB0aGUgZm9sbG93aW5nIGludGVyZmFjZS5cblxudmFyIGFzc2VydCA9IG1vZHVsZS5leHBvcnRzID0gb2s7XG5cbi8vIDIuIFRoZSBBc3NlcnRpb25FcnJvciBpcyBkZWZpbmVkIGluIGFzc2VydC5cbi8vIG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCB9KVxuXG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9ICdBc3NlcnRpb25FcnJvcic7XG4gIHRoaXMuYWN0dWFsID0gb3B0aW9ucy5hY3R1YWw7XG4gIHRoaXMuZXhwZWN0ZWQgPSBvcHRpb25zLmV4cGVjdGVkO1xuICB0aGlzLm9wZXJhdG9yID0gb3B0aW9ucy5vcGVyYXRvcjtcbiAgaWYgKG9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBnZXRNZXNzYWdlKHRoaXMpO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IHRydWU7XG4gIH1cbiAgdmFyIHN0YWNrU3RhcnRGdW5jdGlvbiA9IG9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9uIHx8IGZhaWw7XG5cbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBub24gdjggYnJvd3NlcnMgc28gd2UgY2FuIGhhdmUgYSBzdGFja3RyYWNlXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgIGlmIChlcnIuc3RhY2spIHtcbiAgICAgIHZhciBvdXQgPSBlcnIuc3RhY2s7XG5cbiAgICAgIC8vIHRyeSB0byBzdHJpcCB1c2VsZXNzIGZyYW1lc1xuICAgICAgdmFyIGZuX25hbWUgPSBzdGFja1N0YXJ0RnVuY3Rpb24ubmFtZTtcbiAgICAgIHZhciBpZHggPSBvdXQuaW5kZXhPZignXFxuJyArIGZuX25hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIC8vIG9uY2Ugd2UgaGF2ZSBsb2NhdGVkIHRoZSBmdW5jdGlvbiBmcmFtZVxuICAgICAgICAvLyB3ZSBuZWVkIHRvIHN0cmlwIG91dCBldmVyeXRoaW5nIGJlZm9yZSBpdCAoYW5kIGl0cyBsaW5lKVxuICAgICAgICB2YXIgbmV4dF9saW5lID0gb3V0LmluZGV4T2YoJ1xcbicsIGlkeCArIDEpO1xuICAgICAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKG5leHRfbGluZSArIDEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YWNrID0gb3V0O1xuICAgIH1cbiAgfVxufTtcblxuLy8gYXNzZXJ0LkFzc2VydGlvbkVycm9yIGluc3RhbmNlb2YgRXJyb3JcbnV0aWwuaW5oZXJpdHMoYXNzZXJ0LkFzc2VydGlvbkVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHtcbiAgaWYgKHV0aWwuaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuICcnICsgdmFsdWU7XG4gIH1cbiAgaWYgKHV0aWwuaXNOdW1iZXIodmFsdWUpICYmIChpc05hTih2YWx1ZSkgfHwgIWlzRmluaXRlKHZhbHVlKSkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxuICBpZiAodXRpbC5pc0Z1bmN0aW9uKHZhbHVlKSB8fCB1dGlsLmlzUmVnRXhwKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gdHJ1bmNhdGUocywgbikge1xuICBpZiAodXRpbC5pc1N0cmluZyhzKSkge1xuICAgIHJldHVybiBzLmxlbmd0aCA8IG4gPyBzIDogcy5zbGljZSgwLCBuKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRNZXNzYWdlKHNlbGYpIHtcbiAgcmV0dXJuIHRydW5jYXRlKEpTT04uc3RyaW5naWZ5KHNlbGYuYWN0dWFsLCByZXBsYWNlciksIDEyOCkgKyAnICcgK1xuICAgICAgICAgc2VsZi5vcGVyYXRvciArICcgJyArXG4gICAgICAgICB0cnVuY2F0ZShKU09OLnN0cmluZ2lmeShzZWxmLmV4cGVjdGVkLCByZXBsYWNlciksIDEyOCk7XG59XG5cbi8vIEF0IHByZXNlbnQgb25seSB0aGUgdGhyZWUga2V5cyBtZW50aW9uZWQgYWJvdmUgYXJlIHVzZWQgYW5kXG4vLyB1bmRlcnN0b29kIGJ5IHRoZSBzcGVjLiBJbXBsZW1lbnRhdGlvbnMgb3Igc3ViIG1vZHVsZXMgY2FuIHBhc3Ncbi8vIG90aGVyIGtleXMgdG8gdGhlIEFzc2VydGlvbkVycm9yJ3MgY29uc3RydWN0b3IgLSB0aGV5IHdpbGwgYmVcbi8vIGlnbm9yZWQuXG5cbi8vIDMuIEFsbCBvZiB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBtdXN0IHRocm93IGFuIEFzc2VydGlvbkVycm9yXG4vLyB3aGVuIGEgY29ycmVzcG9uZGluZyBjb25kaXRpb24gaXMgbm90IG1ldCwgd2l0aCBhIG1lc3NhZ2UgdGhhdFxuLy8gbWF5IGJlIHVuZGVmaW5lZCBpZiBub3QgcHJvdmlkZWQuICBBbGwgYXNzZXJ0aW9uIG1ldGhvZHMgcHJvdmlkZVxuLy8gYm90aCB0aGUgYWN0dWFsIGFuZCBleHBlY3RlZCB2YWx1ZXMgdG8gdGhlIGFzc2VydGlvbiBlcnJvciBmb3Jcbi8vIGRpc3BsYXkgcHVycG9zZXMuXG5cbmZ1bmN0aW9uIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgb3BlcmF0b3IsIHN0YWNrU3RhcnRGdW5jdGlvbikge1xuICB0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGFjdHVhbDogYWN0dWFsLFxuICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcbiAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBzdGFja1N0YXJ0RnVuY3Rpb25cbiAgfSk7XG59XG5cbi8vIEVYVEVOU0lPTiEgYWxsb3dzIGZvciB3ZWxsIGJlaGF2ZWQgZXJyb3JzIGRlZmluZWQgZWxzZXdoZXJlLlxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuXG4vLyA0LiBQdXJlIGFzc2VydGlvbiB0ZXN0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdHJ1dGh5LCBhcyBkZXRlcm1pbmVkXG4vLyBieSAhIWd1YXJkLlxuLy8gYXNzZXJ0Lm9rKGd1YXJkLCBtZXNzYWdlX29wdCk7XG4vLyBUaGlzIHN0YXRlbWVudCBpcyBlcXVpdmFsZW50IHRvIGFzc2VydC5lcXVhbCh0cnVlLCAhIWd1YXJkLFxuLy8gbWVzc2FnZV9vcHQpOy4gVG8gdGVzdCBzdHJpY3RseSBmb3IgdGhlIHZhbHVlIHRydWUsIHVzZVxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKHRydWUsIGd1YXJkLCBtZXNzYWdlX29wdCk7LlxuXG5mdW5jdGlvbiBvayh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQub2spO1xufVxuYXNzZXJ0Lm9rID0gb2s7XG5cbi8vIDUuIFRoZSBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc2hhbGxvdywgY29lcmNpdmUgZXF1YWxpdHkgd2l0aFxuLy8gPT0uXG4vLyBhc3NlcnQuZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZXF1YWwgPSBmdW5jdGlvbiBlcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT0gZXhwZWN0ZWQpIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09JywgYXNzZXJ0LmVxdWFsKTtcbn07XG5cbi8vIDYuIFRoZSBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciB3aGV0aGVyIHR3byBvYmplY3RzIGFyZSBub3QgZXF1YWxcbi8vIHdpdGggIT0gYXNzZXJ0Lm5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdEVxdWFsID0gZnVuY3Rpb24gbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT0nLCBhc3NlcnQubm90RXF1YWwpO1xuICB9XG59O1xuXG4vLyA3LiBUaGUgZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGEgZGVlcCBlcXVhbGl0eSByZWxhdGlvbi5cbi8vIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZGVlcEVxdWFsID0gZnVuY3Rpb24gZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkge1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKHV0aWwuaXNCdWZmZXIoYWN0dWFsKSAmJiB1dGlsLmlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIGlmIChhY3R1YWwubGVuZ3RoICE9IGV4cGVjdGVkLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3R1YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhY3R1YWxbaV0gIT09IGV4cGVjdGVkW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNEYXRlKGFjdHVhbCkgJiYgdXRpbC5pc0RhdGUoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMgSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBSZWdFeHAgb2JqZWN0IHdpdGggdGhlIHNhbWUgc291cmNlIGFuZFxuICAvLyBwcm9wZXJ0aWVzIChgZ2xvYmFsYCwgYG11bHRpbGluZWAsIGBsYXN0SW5kZXhgLCBgaWdub3JlQ2FzZWApLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNSZWdFeHAoYWN0dWFsKSAmJiB1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuc291cmNlID09PSBleHBlY3RlZC5zb3VyY2UgJiZcbiAgICAgICAgICAgYWN0dWFsLmdsb2JhbCA9PT0gZXhwZWN0ZWQuZ2xvYmFsICYmXG4gICAgICAgICAgIGFjdHVhbC5tdWx0aWxpbmUgPT09IGV4cGVjdGVkLm11bHRpbGluZSAmJlxuICAgICAgICAgICBhY3R1YWwubGFzdEluZGV4ID09PSBleHBlY3RlZC5sYXN0SW5kZXggJiZcbiAgICAgICAgICAgYWN0dWFsLmlnbm9yZUNhc2UgPT09IGV4cGVjdGVkLmlnbm9yZUNhc2U7XG5cbiAgLy8gNy40LiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKCF1dGlsLmlzT2JqZWN0KGFjdHVhbCkgJiYgIXV0aWwuaXNPYmplY3QoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAvLyA3LjUgRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiKSB7XG4gIGlmICh1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKGEpIHx8IHV0aWwuaXNOdWxsT3JVbmRlZmluZWQoYikpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuXG4gIGlmIChhLnByb3RvdHlwZSAhPT0gYi5wcm90b3R5cGUpIHJldHVybiBmYWxzZTtcbiAgLy9+fn5JJ3ZlIG1hbmFnZWQgdG8gYnJlYWsgT2JqZWN0LmtleXMgdGhyb3VnaCBzY3Jld3kgYXJndW1lbnRzIHBhc3NpbmcuXG4gIC8vICAgQ29udmVydGluZyB0byBhcnJheSBzb2x2ZXMgdGhlIHByb2JsZW0uXG4gIGlmIChpc0FyZ3VtZW50cyhhKSkge1xuICAgIGlmICghaXNBcmd1bWVudHMoYikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgYSA9IHBTbGljZS5jYWxsKGEpO1xuICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICByZXR1cm4gX2RlZXBFcXVhbChhLCBiKTtcbiAgfVxuICB0cnkge1xuICAgIHZhciBrYSA9IG9iamVjdEtleXMoYSksXG4gICAgICAgIGtiID0gb2JqZWN0S2V5cyhiKSxcbiAgICAgICAga2V5LCBpO1xuICB9IGNhdGNoIChlKSB7Ly9oYXBwZW5zIHdoZW4gb25lIGlzIGEgc3RyaW5nIGxpdGVyYWwgYW5kIHRoZSBvdGhlciBpc24ndFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwRXF1YWwnLCBhc3NlcnQubm90RGVlcEVxdWFsKTtcbiAgfVxufTtcblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9IGVsc2UgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoZXhwZWN0ZWQuY2FsbCh7fSwgYWN0dWFsKSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfdGhyb3dzKHNob3VsZFRocm93LCBibG9jaywgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGFjdHVhbDtcblxuICBpZiAodXRpbC5pc1N0cmluZyhleHBlY3RlZCkpIHtcbiAgICBtZXNzYWdlID0gZXhwZWN0ZWQ7XG4gICAgZXhwZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgYWN0dWFsID0gZTtcbiAgfVxuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKCFzaG91bGRUaHJvdyAmJiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbdHJ1ZV0uY29uY2F0KHBTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbi8vIEVYVEVOU0lPTiEgVGhpcyBpcyBhbm5veWluZyB0byB3cml0ZSBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuYXNzZXJ0LmRvZXNOb3RUaHJvdyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MuYXBwbHkodGhpcywgW2ZhbHNlXS5jb25jYXQocFNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xufTtcblxuYXNzZXJ0LmlmRXJyb3IgPSBmdW5jdGlvbihlcnIpIHsgaWYgKGVycikge3Rocm93IGVycjt9fTtcblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoZXYuc291cmNlID09PSB3aW5kb3cgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsInZhciBwcm9jZXNzPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKSxnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9Oy8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsIi8qanNoaW50IG1heGxlbjpmYWxzZSAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHRvZ2EgPSByZXF1aXJlKCcuLi8uLi9saWIvdG9nYScpO1xudmFyIFRvZ2EgPSB0b2dhO1xuXG5kZXNjcmliZSgnVG9nYScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGlnbm9yZSBub24tYmxvY2tzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZ25vcmUgPSBcIi8vIGlnbm9yZVxcbi8qIGlnbm9yZSAqL1xcbi8qISBpZ25vcmUgKi9cXG5cXG4vL1xcbi8vIGlnbm9yZVxcbi8vXFxuLypcXG4gKiBpZ25vcmVcXG4gKi9cXG4vKiFcXG4gKiBpZ25vcmVcXG4gKi9cXG5cXG4vLyAvKiogaWdub3JlXFxudmFyIGlnbm9yZSA9ICcvKiogaWdub3JlICovJztcXG52YXIgZm9vID0gZnVuY3Rpb24oLyoqIGlnbm9yZSAqLykge307XFxuY29uc29sZS5sb2coZm9vKGlnbm9yZSkpO1xcbi8vIGlnbm9yZSAqL1xcblwiO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodG9nYShpZ25vcmUpLCBbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcvLyBpZ25vcmVcXG4vKiBpZ25vcmUgKi9cXG4vKiEgaWdub3JlICovXFxuXFxuLy9cXG4vLyBpZ25vcmVcXG4vL1xcbi8qXFxuICogaWdub3JlXFxuICovXFxuLyohXFxuICogaWdub3JlXFxuICovXFxuXFxuLy8gLyoqIGlnbm9yZVxcbnZhciBpZ25vcmUgPSBcXCcvKiogaWdub3JlICovXFwnO1xcbnZhciBmb28gPSBmdW5jdGlvbigvKiogaWdub3JlICovKSB7fTtcXG5jb25zb2xlLmxvZyhmb28oaWdub3JlKSk7XFxuLy8gaWdub3JlICovXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBlbXB0eSBibG9ja3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVtcHR5ID0gXCIvKiovXFxuLyoqKi9cXG4vKiogKi9cXG4vKipcXG4gKlxcbiAqL1xcbi8qKlxcblxcbiovXFxuXCI7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0b2dhKCksIFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ3VuZGVmaW5lZCcgfVxuICAgICAgICBdKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRvZ2EobnVsbCksIFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ251bGwnIH1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0b2dhKCcnKSwgW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnJyB9XG4gICAgICAgIF0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodG9nYShlbXB0eSksIFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJy8qKi9cXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW10gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbXSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFtdIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW10gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgZGVzY3JpcHRpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkZXNjID0gXCIvKiogZGVzY3JpcHRpb24gKi9cXG4vKipcXG4gKiBkZXNjcmlwdGlvblxcbiAqL1xcbi8qKlxcbmRlc2NyaXB0aW9uXFxuKi9cXG5cIjtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRvZ2EoZGVzYyksIFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnZGVzY3JpcHRpb24nLCAndGFncyc6IFtdIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJ2Rlc2NyaXB0aW9uJywgJ3RhZ3MnOiBbXSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICdkZXNjcmlwdGlvbicsICd0YWdzJzogW10gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgdGFncycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGFnID0gXCIvKiogQHRhZyB7VHlwZX0gLSBEZXNjcmlwdGlvbiBoZXJlLiAqL1xcbi8qKiBAdGFnIHtUeXBlfSBEZXNjcmlwdGlvbiBoZXJlLiAqL1xcbi8qKiBAdGFnIC0gRGVzY3JpcHRpb24uICovXFxuLyoqIEB0YWcgRGVzY3JpcHRpb24uICovXFxuLyoqIEB0YWcgKi9cXG5cIjtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRvZ2EodGFnKSwgW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAndGFnJywgJ3R5cGUnOiAne1R5cGV9JywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIGhlcmUuJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAndGFnJywgJ3R5cGUnOiAne1R5cGV9JywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIGhlcmUuJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAndGFnJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ3RhZycsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICd0YWcnIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGFyZ3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZyA9IFwiLyoqIEBhcmcge1R5cGV9IFtuYW1lXSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIHtUeXBlfSBbbmFtZV0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcge1R5cGV9IG5hbWUgLSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyB7VHlwZX0gW25hbWVdICovXFxuLyoqIEBhcmcge1R5cGV9IG5hbWUgKi9cXG4vKiogQGFyZyBbbmFtZV0gLSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyBbbmFtZV0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcgbmFtZSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIG5hbWUgRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcgW25hbWVdICovXFxuLyoqIEBhcmcgbmFtZSAqL1xcblwiO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodG9nYShhcmcpLCBbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICdbbmFtZV0nLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnW25hbWVdJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICdbbmFtZV0nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWVdJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICduYW1lJzogJ1tuYW1lXScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWVdJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnbmFtZScgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgdHlwZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBcIi8qKiBAYXJnIHtUeXBlfSAqL1xcbi8qKiBAYXJnIHtTdHJpbmd8T2JqZWN0fSAqL1xcbi8qKiBAYXJnIHtBcnJheS48T2JqZWN0LjxTdHJpbmcsTnVtYmVyPj59ICovXFxuLyoqIEBhcmcge0Z1bmN0aW9uKFN0cmluZywgLi4uW051bWJlcl0pOiBOdW1iZXJ9IGNhbGxiYWNrICovXFxuXCI7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0b2dhKHR5cGUpLCBbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7U3RyaW5nfE9iamVjdH0nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7QXJyYXkuPE9iamVjdC48U3RyaW5nLE51bWJlcj4+fScgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tGdW5jdGlvbihTdHJpbmcsIC4uLltOdW1iZXJdKTogTnVtYmVyfScsICduYW1lJzogJ2NhbGxiYWNrJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBuYW1lcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbmFtZSA9IFwiLyoqIEBhcmcgbmFtZSAqL1xcbi8qKiBAYXJnIFtuYW1lXSAqL1xcbi8qKiBAYXJnIFtuYW1lPXt9XSAqL1xcbi8qKiBAYXJnIFtuYW1lPVxcXCJoZWxsbyB3b3JsZFxcXCJdICovXFxuXCI7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0b2dhKG5hbWUpLCBbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICduYW1lJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWVdJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWU9e31dJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWU9XCJoZWxsbyB3b3JsZFwiXScgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGluZGVudGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5kZW50ID0gXCIvKipcXG4gKiAjIFRpdGxlXFxuICpcXG4gKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gKiBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gKiB0eXBlIHRoaW5ncy5cXG4gKlxcbiAqIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAqXFxuICogKiBMaWtlXFxuICogKiBMaXN0c1xcbiAqXFxuICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAqXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gKlxcbiAqICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAqXFxuICogQGV4YW1wbGVcXG4gKlxcbiAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICpcXG4gKiBAdGFnXFxuICovXFxuXFxuLyoqXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICB2YXIgZm9vID0gJ2Jhcic7XFxuXFxuQHRhZ1xcbiAqL1xcblxcbi8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgQHRhZ1xcbiAqL1xcblxcbiAgICAvKipcXG4gICAgICogIyBUaXRsZVxcbiAgICAgKlxcbiAgICAgKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICogbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAqIHR5cGUgdGhpbmdzLlxcbiAgICAgKlxcbiAgICAgKiBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICAgICpcXG4gICAgICogKiBMaWtlXFxuICAgICAqICogTGlzdHNcXG4gICAgICpcXG4gICAgICogICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcbiAgICAgKlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICpcXG4gICAgICogICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAgICAqXFxuICAgICAqIEBleGFtcGxlXFxuICAgICAqXFxuICAgICAqICAgICB2YXIgZm9vID0gJ2Jhcic7XFxuICAgICAqXFxuICAgICAqIEB0YWdcXG4gICAgICovXFxuXFxuICAgIC8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgQHRhZ1xcbiAgICAgKi9cXG5cXG4gICAgLyoqXFxuICAgICAgICAjIFRpdGxlXFxuXFxuICAgICAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgICAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgICAgICogTGlrZVxcbiAgICAgICAgKiBMaXN0c1xcblxcbiAgICAgICAgICAgIHZhciBjb2RlID0gJ3NhbXBsZXMnO1xcblxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgICAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG4gICAgICAgIEB0YWdcXG4gICAgKi9cXG5cIjtcbiAgICAgICAgdmFyIHN0YW5kYXJkUGFyc2VyID0gbmV3IFRvZ2EoKTtcbiAgICAgICAgdmFyIHRva2VucyA9IHN0YW5kYXJkUGFyc2VyLnBhcnNlKGluZGVudCwge1xuICAgICAgICAgICAgcmF3OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodG9rZW5zLCBbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnLyoqXFxuICogIyBUaXRsZVxcbiAqXFxuICogTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICogbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICogdHlwZSB0aGluZ3MuXFxuICpcXG4gKiBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gKlxcbiAqICogTGlrZVxcbiAqICogTGlzdHNcXG4gKlxcbiAqICAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuICpcXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAqICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAqICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAqXFxuICogICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICpcXG4gKiBAZXhhbXBsZVxcbiAqXFxuICogICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuICpcXG4gKiBAdGFnXFxuICovJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcvKipcXG4jIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbkB0YWdcXG4gKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJy8qKlxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgIEBleGFtcGxlXFxuXFxuICAgICAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbiAgICBAdGFnXFxuICovJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcgICAgLyoqXFxuICAgICAqICMgVGl0bGVcXG4gICAgICpcXG4gICAgICogTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAqIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgKiB0eXBlIHRoaW5ncy5cXG4gICAgICpcXG4gICAgICogTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuICAgICAqXFxuICAgICAqICogTGlrZVxcbiAgICAgKiAqIExpc3RzXFxuICAgICAqXFxuICAgICAqICAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuICAgICAqXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAqICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgKlxcbiAgICAgKiAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gICAgICpcXG4gICAgICogQGV4YW1wbGVcXG4gICAgICpcXG4gICAgICogICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuICAgICAqXFxuICAgICAqIEB0YWdcXG4gICAgICovJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcgICAgLyoqXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuICAgIEB0YWdcXG4gICAgICovJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcgICAgLyoqXFxuICAgICAgICAjIFRpdGxlXFxuXFxuICAgICAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgICAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgICAgICogTGlrZVxcbiAgICAgICAgKiBMaXN0c1xcblxcbiAgICAgICAgICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICAgICAgQGV4YW1wbGVcXG5cXG4gICAgICAgICAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbiAgICAgICAgQHRhZ1xcbiAgICAqLydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBjdXN0b20gaGFuZGxlYmFycyBncmFtbWFyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdXN0b20gPSBcInt7IS0tLVxcbiAgISAjIFRpdGxlXFxuICAhXFxuICAhIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgISBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICEgdHlwZSB0aGluZ3MuXFxuICAhXFxuICAhIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgIVxcbiAgISAqIExpa2VcXG4gICEgKiBMaXN0c1xcbiAgIVxcbiAgISAgICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG4gICFcXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAhXFxuICAhICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAgIVxcbiAgISBAZXhhbXBsZVxcbiAgIVxcbiAgISAgICAgPHVsPlxcbiAgISAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAhICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAhICAgICAgICAge3svZWFjaH19XFxuICAhICAgICA8L3VsPlxcbiAgIVxcbiAgISBAdGFnXFxuICAhLS19fVxcblxcbnt7IS0tLVxcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG5AdGFnXFxuLS19fVxcblxcbnt7IS0tLVxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgPGNvZGU+e3tzYW1wbGVzfX08L2NvZGU+XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIDx1bD5cXG4gICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICAgPC91bD5cXG5cXG4gICAgQHRhZ1xcbi0tfX1cXG5cXG4gICAge3shLS0tXFxuICAgICAgISAjIFRpdGxlXFxuICAgICAgIVxcbiAgICAgICEgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAgISBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICAhIHR5cGUgdGhpbmdzLlxcbiAgICAgICFcXG4gICAgICAhIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgICAgICFcXG4gICAgICAhICogTGlrZVxcbiAgICAgICEgKiBMaXN0c1xcbiAgICAgICFcXG4gICAgICAhICAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcbiAgICAgICFcXG4gICAgICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAhXFxuICAgICAgISAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gICAgICAhXFxuICAgICAgISBAZXhhbXBsZVxcbiAgICAgICFcXG4gICAgICAhICAgICA8dWw+XFxuICAgICAgISAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgISAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICEgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAhICAgICA8L3VsPlxcbiAgICAgICFcXG4gICAgICAhIEB0YWdcXG4gICAgICAhLS19fVxcblxcbiAgICB7eyEtLS1cXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIDx1bD5cXG4gICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICAgPC91bD5cXG5cXG4gICAgQHRhZ1xcbiAgICAtLX19XFxuXFxuICAgIHt7IS0tLVxcbiAgICAgICAgIyBUaXRsZVxcblxcbiAgICAgICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgICAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICAgICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICAgICAqIExpa2VcXG4gICAgICAgICogTGlzdHNcXG5cXG4gICAgICAgICAgICA8Y29kZT57e3NhbXBsZXN9fTwvY29kZT5cXG5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gICAgICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICAgICAgQGV4YW1wbGVcXG5cXG4gICAgICAgICAgICA8dWw+XFxuICAgICAgICAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgICAgICB7ey9lYWNofX1cXG4gICAgICAgICAgICA8L3VsPlxcblxcbiAgICAgICAgQHRhZ1xcbiAgICAtLX19XFxuXFxue3shIGlnbm9yZSB9fVxcbnt7IS0tIGlnbm9yZSAtLX19XFxue3shXFxuICAhIGlnbm9yZVxcbiAgIX19XFxuPCEtLSB7eyEtLS0gaWdub3JlIC0tPlxcbjwhLS0gaWdub3JlIH19IC0tPlxcblwiO1xuXG4gICAgICAgIHZhciBoYW5kbGViYXJQYXJzZXIgPSBuZXcgVG9nYSh7XG4gICAgICAgICAgICBibG9ja1NwbGl0OiAvKF5bXFx0IF0qXFx7XFx7IS0tLSg/IS0pW1xcc1xcU10qP1xccyotLVxcfVxcfSkvbSxcbiAgICAgICAgICAgIGJsb2NrUGFyc2U6IC9eW1xcdCBdKlxce1xceyEtLS0oPyEtKShbXFxzXFxTXSo/KVxccyotLVxcfVxcfS9tLFxuICAgICAgICAgICAgaW5kZW50OiAvXltcXHQgIV0vZ20sXG4gICAgICAgICAgICBuYW1lZDogL14oYXJnKGd1bWVudCk/fGRhdGF8cHJvcChlcnR5KT8pJC9cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHRva2VucyA9IGhhbmRsZWJhclBhcnNlci5wYXJzZShjdXN0b20sIHtcbiAgICAgICAgICAgIHJhdzogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRva2VucywgW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnLCAnZGVzY3JpcHRpb24nOiAnXFxuJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJ3t7IS0tLVxcbiAgISAjIFRpdGxlXFxuICAhXFxuICAhIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgISBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICEgdHlwZSB0aGluZ3MuXFxuICAhXFxuICAhIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgIVxcbiAgISAqIExpa2VcXG4gICEgKiBMaXN0c1xcbiAgIVxcbiAgISAgICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG4gICFcXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAhXFxuICAhICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAgIVxcbiAgISBAZXhhbXBsZVxcbiAgIVxcbiAgISAgICAgPHVsPlxcbiAgISAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAhICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAhICAgICAgICAge3svZWFjaH19XFxuICAhICAgICA8L3VsPlxcbiAgIVxcbiAgISBAdGFnXFxuICAhLS19fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICd7eyEtLS1cXG4jIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuQGV4YW1wbGVcXG5cXG4gICAgPHVsPlxcbiAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAge3svZWFjaH19XFxuICAgIDwvdWw+XFxuXFxuQHRhZ1xcbi0tfX0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgPGNvZGU+e3tzYW1wbGVzfX08L2NvZGU+XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgPHVsPlxcbiAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAge3svZWFjaH19XFxuICAgIDwvdWw+XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJ3t7IS0tLVxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgPGNvZGU+e3tzYW1wbGVzfX08L2NvZGU+XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIDx1bD5cXG4gICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICAgPC91bD5cXG5cXG4gICAgQHRhZ1xcbi0tfX0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnLCAnZGVzY3JpcHRpb24nOiAnXFxuJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJyAgICB7eyEtLS1cXG4gICAgICAhICMgVGl0bGVcXG4gICAgICAhXFxuICAgICAgISBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICAhIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgICEgdHlwZSB0aGluZ3MuXFxuICAgICAgIVxcbiAgICAgICEgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuICAgICAgIVxcbiAgICAgICEgKiBMaWtlXFxuICAgICAgISAqIExpc3RzXFxuICAgICAgIVxcbiAgICAgICEgICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuICAgICAgIVxcbiAgICAgICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICFcXG4gICAgICAhICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAgICAgICFcXG4gICAgICAhIEBleGFtcGxlXFxuICAgICAgIVxcbiAgICAgICEgICAgIDx1bD5cXG4gICAgICAhICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAhICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgISAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICEgICAgIDwvdWw+XFxuICAgICAgIVxcbiAgICAgICEgQHRhZ1xcbiAgICAgICEtLX19J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgPHVsPlxcbiAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAge3svZWFjaH19XFxuICAgIDwvdWw+XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJyAgICB7eyEtLS1cXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIDx1bD5cXG4gICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICAgPC91bD5cXG5cXG4gICAgQHRhZ1xcbiAgICAtLX19J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnt7c2FtcGxlc319PC9jb2RlPlxcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcgICAge3shLS0tXFxuICAgICAgICAjIFRpdGxlXFxuXFxuICAgICAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgICAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgICAgICogTGlrZVxcbiAgICAgICAgKiBMaXN0c1xcblxcbiAgICAgICAgICAgIDxjb2RlPnt7c2FtcGxlc319PC9jb2RlPlxcblxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgICAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgICAgIDx1bD5cXG4gICAgICAgICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICAgICAgIDwvdWw+XFxuXFxuICAgICAgICBAdGFnXFxuICAgIC0tfX0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxue3shIGlnbm9yZSB9fVxcbnt7IS0tIGlnbm9yZSAtLX19XFxue3shXFxuICAhIGlnbm9yZVxcbiAgIX19XFxuPCEtLSB7eyEtLS0gaWdub3JlIC0tPlxcbjwhLS0gaWdub3JlIH19IC0tPlxcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdXNlIGN1c3RvbSBwZXJsIGdyYW1tYXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN1c3RvbSA9IFwidXNlIHN0cmljdDtcXG51c2Ugd2FybmluZ3M7XFxuXFxucHJpbnQgXFxcImhlbGxvIHdvcmxkXFxcIjtcXG5cXG49cG9kXFxuXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgbXkgJGNvZGUgPSBcXFwic2FtcGxlc1xcXCI7XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICBteSAkZm9vID0gXFxcImJhclxcXCI7XFxuXFxuQHRhZ1xcblxcbj1jdXRcXG5cIjtcblxuICAgICAgICB2YXIgcGVybFBhcnNlciA9IG5ldyBUb2dhKHtcbiAgICAgICAgICAgIGJsb2NrU3BsaXQ6IC8oXj1wb2RbXFxzXFxTXSo/XFxuPWN1dCQpL20sXG4gICAgICAgICAgICBibG9ja1BhcnNlOiAvXj1wb2QoW1xcc1xcU10qPylcXG49Y3V0JC9tLFxuICAgICAgICAgICAgbmFtZWQ6IC9eKGFyZyhndW1lbnQpP3xkYXRhfHByb3AoZXJ0eSk/KSQvXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0b2tlbnMgPSBwZXJsUGFyc2VyLnBhcnNlKGN1c3RvbSwge1xuICAgICAgICAgICAgcmF3OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodG9rZW5zLCBbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICd1c2Ugc3RyaWN0O1xcbnVzZSB3YXJuaW5ncztcXG5cXG5wcmludCBcImhlbGxvIHdvcmxkXCI7XFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgbXkgJGNvZGUgPSBcInNhbXBsZXNcIjtcXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICBteSAkZm9vID0gXCJiYXJcIjtcXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnPXBvZFxcblxcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIG15ICRjb2RlID0gXCJzYW1wbGVzXCI7XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICBteSAkZm9vID0gXCJiYXJcIjtcXG5cXG5AdGFnXFxuXFxuPWN1dCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
