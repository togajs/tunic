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
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"PcZj9L":[function(require,module,exports){
var TA = require('typedarray')
var xDataView = typeof DataView === 'undefined'
  ? TA.DataView : DataView
var xArrayBuffer = typeof ArrayBuffer === 'undefined'
  ? TA.ArrayBuffer : ArrayBuffer
var xUint8Array = typeof Uint8Array === 'undefined'
  ? TA.Uint8Array : Uint8Array

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

var browserSupport

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 *
 * Firefox is a special case because it doesn't allow augmenting "native" object
 * instances. See `ProxyBuffer` below for more details.
 */
function Buffer (subject, encoding) {
  var type = typeof subject

  // Work-around: node's base64 implementation
  // allows for non-padded strings while base64-js
  // does not..
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // Assume object is an array
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf = augment(new xUint8Array(length))
  if (Buffer.isBuffer(subject)) {
    // Speed optimization -- use set if we're copying from a Uint8Array
    buf.set(subject)
  } else if (isArrayIsh(subject)) {
    // Treat array-ish objects as a byte array.
    for (var i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function(encoding) {
  switch ((encoding + '').toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true

    default:
      return false
  }
}

Buffer.isBuffer = function isBuffer (b) {
  return b && b._isBuffer
}

Buffer.byteLength = function (str, encoding) {
  switch (encoding || 'utf8') {
    case 'hex':
      return str.length / 2

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length

    case 'ascii':
    case 'binary':
      return str.length

    case 'base64':
      return base64ToBytes(str).length

    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error('Usage: Buffer.concat(list, [totalLength])\n' +
        'list should be an Array.')
  }

  var i
  var buf

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      buf = list[i]
      totalLength += buf.length
    }
  }

  var buffer = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    buf = list[i]
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

// INSTANCE METHODS
// ================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
}

function _asciiWrite (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
}

function BufferWrite (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  switch (encoding) {
    case 'hex':
      return _hexWrite(this, string, offset, length)

    case 'utf8':
    case 'utf-8':
      return _utf8Write(this, string, offset, length)

    case 'ascii':
      return _asciiWrite(this, string, offset, length)

    case 'binary':
      return _binaryWrite(this, string, offset, length)

    case 'base64':
      return _base64Write(this, string, offset, length)

    default:
      throw new Error('Unknown encoding')
  }
}

function BufferToString (encoding, start, end) {
  var self = (this instanceof ProxyBuffer)
    ? this._proxy
    : this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  switch (encoding) {
    case 'hex':
      return _hexSlice(self, start, end)

    case 'utf8':
    case 'utf-8':
      return _utf8Slice(self, start, end)

    case 'ascii':
      return _asciiSlice(self, start, end)

    case 'binary':
      return _binarySlice(self, start, end)

    case 'base64':
      return _base64Slice(self, start, end)

    default:
      throw new Error('Unknown encoding')
  }
}

function BufferToJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
function BufferCopy (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start)
    throw new Error('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new Error('targetStart out of bounds')
  if (start < 0 || start >= source.length)
    throw new Error('sourceStart out of bounds')
  if (end < 0 || end > source.length)
    throw new Error('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  // copy!
  for (var i = 0; i < end - start; i++)
    target[i + target_start] = this[i + start]
}

function _base64Slice (buf, start, end) {
  var bytes = buf.slice(start, end)
  return require('base64-js').fromByteArray(bytes)
}

function _utf8Slice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  var tmp = ''
  var i = 0
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i])
      tmp = ''
    } else {
      tmp += '%' + bytes[i].toString(16)
    }

    i++
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var ret = ''
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

// TODO: add test that modifying the new buffer slice will modify memory in the
// original buffer! Use code from:
// http://nodejs.org/api/buffer.html#buffer_buf_slice_start_end
function BufferSlice (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)
  return augment(this.subarray(start, end)) // Uint8Array built-in method
}

function BufferReadUInt8 (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  return buf[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setUint8(0, buf[len - 1])
    return dv.getUint16(0, littleEndian)
  } else {
    return buf._dataview.getUint16(offset, littleEndian)
  }
}

function BufferReadUInt16LE (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

function BufferReadUInt16BE (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    for (var i = 0; i + offset < len; i++) {
      dv.setUint8(i, buf[i + offset])
    }
    return dv.getUint32(0, littleEndian)
  } else {
    return buf._dataview.getUint32(offset, littleEndian)
  }
}

function BufferReadUInt32LE (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

function BufferReadUInt32BE (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

function BufferReadInt8 (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  return buf._dataview.getInt8(offset)
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setUint8(0, buf[len - 1])
    return dv.getInt16(0, littleEndian)
  } else {
    return buf._dataview.getInt16(offset, littleEndian)
  }
}

function BufferReadInt16LE (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

function BufferReadInt16BE (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    for (var i = 0; i + offset < len; i++) {
      dv.setUint8(i, buf[i + offset])
    }
    return dv.getInt32(0, littleEndian)
  } else {
    return buf._dataview.getInt32(offset, littleEndian)
  }
}

function BufferReadInt32LE (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

function BufferReadInt32BE (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return buf._dataview.getFloat32(offset, littleEndian)
}

function BufferReadFloatLE (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

function BufferReadFloatBE (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return buf._dataview.getFloat64(offset, littleEndian)
}

function BufferReadDoubleLE (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

function BufferReadDoubleBE (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

function BufferWriteUInt8 (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= buf.length) return

  buf[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setUint16(0, value, littleEndian)
    buf[offset] = dv.getUint8(0)
  } else {
    buf._dataview.setUint16(offset, value, littleEndian)
  }
}

function BufferWriteUInt16LE (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

function BufferWriteUInt16BE (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    dv.setUint32(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setUint32(offset, value, littleEndian)
  }
}

function BufferWriteUInt32LE (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

function BufferWriteUInt32BE (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

function BufferWriteInt8 (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= buf.length) return

  buf._dataview.setInt8(offset, value)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setInt16(0, value, littleEndian)
    buf[offset] = dv.getUint8(0)
  } else {
    buf._dataview.setInt16(offset, value, littleEndian)
  }
}

function BufferWriteInt16LE (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

function BufferWriteInt16BE (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    dv.setInt32(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setInt32(offset, value, littleEndian)
  }
}

function BufferWriteInt32LE (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

function BufferWriteInt32BE (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    dv.setFloat32(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setFloat32(offset, value, littleEndian)
  }
}

function BufferWriteFloatLE (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

function BufferWriteFloatBE (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 7 >= len) {
    var dv = new xDataView(new xArrayBuffer(8))
    dv.setFloat64(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setFloat64(offset, value, littleEndian)
  }
}

function BufferWriteDoubleLE (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

function BufferWriteDoubleBE (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
function BufferFill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('value is not a number')
  }

  if (end < start) throw new Error('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds')
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds')
  }

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

function BufferInspect () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

// Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
// Added in Node 0.12.
function BufferToArrayBuffer () {
  return (new Buffer(this)).buffer
}


// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

/**
 * Check to see if the browser supports augmenting a `Uint8Array` instance.
 * @return {boolean}
 */
function _browserSupport () {
  var arr = new xUint8Array(0)
  arr.foo = function () { return 42 }

  try {
    return (42 === arr.foo())
  } catch (e) {
    return false
  }
}

/**
 * Class: ProxyBuffer
 * ==================
 *
 * Only used in Firefox, since Firefox does not allow augmenting "native"
 * objects (like Uint8Array instances) with new properties for some unknown
 * (probably silly) reason. So we'll use an ES6 Proxy (supported since
 * Firefox 18) to wrap the Uint8Array instance without actually adding any
 * properties to it.
 *
 * Instances of this "fake" Buffer class are the "target" of the
 * ES6 Proxy (see `augment` function).
 *
 * We couldn't just use the `Uint8Array` as the target of the `Proxy` because
 * Proxies have an important limitation on trapping the `toString` method.
 * `Object.prototype.toString.call(proxy)` gets called whenever something is
 * implicitly cast to a String. Unfortunately, with a `Proxy` this
 * unconditionally returns `Object.prototype.toString.call(target)` which would
 * always return "[object Uint8Array]" if we used the `Uint8Array` instance as
 * the target. And, remember, in Firefox we cannot redefine the `Uint8Array`
 * instance's `toString` method.
 *
 * So, we use this `ProxyBuffer` class as the proxy's "target". Since this class
 * has its own custom `toString` method, it will get called whenever `toString`
 * gets called, implicitly or explicitly, on the `Proxy` instance.
 *
 * We also have to define the Uint8Array methods `subarray` and `set` on
 * `ProxyBuffer` because if we didn't then `proxy.subarray(0)` would have its
 * `this` set to `proxy` (a `Proxy` instance) which throws an exception in
 * Firefox which expects it to be a `TypedArray` instance.
 */
function ProxyBuffer (arr) {
  this._arr = arr

  if (arr.byteLength !== 0)
    this._dataview = new xDataView(arr.buffer, arr.byteOffset, arr.byteLength)
}

ProxyBuffer.prototype.write = BufferWrite
ProxyBuffer.prototype.toString = BufferToString
ProxyBuffer.prototype.toLocaleString = BufferToString
ProxyBuffer.prototype.toJSON = BufferToJSON
ProxyBuffer.prototype.copy = BufferCopy
ProxyBuffer.prototype.slice = BufferSlice
ProxyBuffer.prototype.readUInt8 = BufferReadUInt8
ProxyBuffer.prototype.readUInt16LE = BufferReadUInt16LE
ProxyBuffer.prototype.readUInt16BE = BufferReadUInt16BE
ProxyBuffer.prototype.readUInt32LE = BufferReadUInt32LE
ProxyBuffer.prototype.readUInt32BE = BufferReadUInt32BE
ProxyBuffer.prototype.readInt8 = BufferReadInt8
ProxyBuffer.prototype.readInt16LE = BufferReadInt16LE
ProxyBuffer.prototype.readInt16BE = BufferReadInt16BE
ProxyBuffer.prototype.readInt32LE = BufferReadInt32LE
ProxyBuffer.prototype.readInt32BE = BufferReadInt32BE
ProxyBuffer.prototype.readFloatLE = BufferReadFloatLE
ProxyBuffer.prototype.readFloatBE = BufferReadFloatBE
ProxyBuffer.prototype.readDoubleLE = BufferReadDoubleLE
ProxyBuffer.prototype.readDoubleBE = BufferReadDoubleBE
ProxyBuffer.prototype.writeUInt8 = BufferWriteUInt8
ProxyBuffer.prototype.writeUInt16LE = BufferWriteUInt16LE
ProxyBuffer.prototype.writeUInt16BE = BufferWriteUInt16BE
ProxyBuffer.prototype.writeUInt32LE = BufferWriteUInt32LE
ProxyBuffer.prototype.writeUInt32BE = BufferWriteUInt32BE
ProxyBuffer.prototype.writeInt8 = BufferWriteInt8
ProxyBuffer.prototype.writeInt16LE = BufferWriteInt16LE
ProxyBuffer.prototype.writeInt16BE = BufferWriteInt16BE
ProxyBuffer.prototype.writeInt32LE = BufferWriteInt32LE
ProxyBuffer.prototype.writeInt32BE = BufferWriteInt32BE
ProxyBuffer.prototype.writeFloatLE = BufferWriteFloatLE
ProxyBuffer.prototype.writeFloatBE = BufferWriteFloatBE
ProxyBuffer.prototype.writeDoubleLE = BufferWriteDoubleLE
ProxyBuffer.prototype.writeDoubleBE = BufferWriteDoubleBE
ProxyBuffer.prototype.fill = BufferFill
ProxyBuffer.prototype.inspect = BufferInspect
ProxyBuffer.prototype.toArrayBuffer = BufferToArrayBuffer
ProxyBuffer.prototype._isBuffer = true
ProxyBuffer.prototype.subarray = function () {
  return this._arr.subarray.apply(this._arr, arguments)
}
ProxyBuffer.prototype.set = function () {
  return this._arr.set.apply(this._arr, arguments)
}

var ProxyHandler = {
  get: function (target, name) {
    if (name in target) return target[name]
    else return target._arr[name]
  },
  set: function (target, name, value) {
    target._arr[name] = value
  }
}

function augment (arr) {
  if (browserSupport === undefined) {
    browserSupport = _browserSupport()
  }

  if (browserSupport) {
    // Augment the Uint8Array *instance* (not the class!) with Buffer methods
    arr.write = BufferWrite
    arr.toString = BufferToString
    arr.toLocaleString = BufferToString
    arr.toJSON = BufferToJSON
    arr.copy = BufferCopy
    arr.slice = BufferSlice
    arr.readUInt8 = BufferReadUInt8
    arr.readUInt16LE = BufferReadUInt16LE
    arr.readUInt16BE = BufferReadUInt16BE
    arr.readUInt32LE = BufferReadUInt32LE
    arr.readUInt32BE = BufferReadUInt32BE
    arr.readInt8 = BufferReadInt8
    arr.readInt16LE = BufferReadInt16LE
    arr.readInt16BE = BufferReadInt16BE
    arr.readInt32LE = BufferReadInt32LE
    arr.readInt32BE = BufferReadInt32BE
    arr.readFloatLE = BufferReadFloatLE
    arr.readFloatBE = BufferReadFloatBE
    arr.readDoubleLE = BufferReadDoubleLE
    arr.readDoubleBE = BufferReadDoubleBE
    arr.writeUInt8 = BufferWriteUInt8
    arr.writeUInt16LE = BufferWriteUInt16LE
    arr.writeUInt16BE = BufferWriteUInt16BE
    arr.writeUInt32LE = BufferWriteUInt32LE
    arr.writeUInt32BE = BufferWriteUInt32BE
    arr.writeInt8 = BufferWriteInt8
    arr.writeInt16LE = BufferWriteInt16LE
    arr.writeInt16BE = BufferWriteInt16BE
    arr.writeInt32LE = BufferWriteInt32LE
    arr.writeInt32BE = BufferWriteInt32BE
    arr.writeFloatLE = BufferWriteFloatLE
    arr.writeFloatBE = BufferWriteFloatBE
    arr.writeDoubleLE = BufferWriteDoubleLE
    arr.writeDoubleBE = BufferWriteDoubleBE
    arr.fill = BufferFill
    arr.inspect = BufferInspect
    arr.toArrayBuffer = BufferToArrayBuffer
    arr._isBuffer = true

    if (arr.byteLength !== 0)
      arr._dataview = new xDataView(arr.buffer, arr.byteOffset, arr.byteLength)

    return arr

  } else {
    // This is a browser that doesn't support augmenting the `Uint8Array`
    // instance (*ahem* Firefox) so use an ES6 `Proxy`.
    var proxyBuffer = new ProxyBuffer(arr)
    var proxy = new Proxy(proxyBuffer, ProxyHandler)
    proxyBuffer._proxy = proxy
    return proxy
  }
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArrayIsh (subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }

  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }

  return byteArray
}

function base64ToBytes (str) {
  return require('base64-js').toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos, i = 0
  while (i < length) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break

    dst[i + offset] = src[i]
    i++
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint (value, max) {
  assert(typeof (value) == 'number', 'cannot write a non-number as a number')
  assert(value >= 0,
      'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert(typeof (value) == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754(value, max, min) {
  assert(typeof (value) == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":3,"typedarray":4}],"native-buffer-browserify":[function(require,module,exports){
module.exports=require('PcZj9L');
},{}],3:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],4:[function(require,module,exports){
var undefined = (void 0); // Paranoia

// Beyond this value, index getters/setters (i.e. array[0], array[1]) are so slow to
// create, and consume so much memory, that the browser appears frozen.
var MAX_ARRAY_LENGTH = 1e5;

// Approximations of internal ECMAScript conversion functions
var ECMAScript = (function() {
  // Stash a copy in case other scripts modify these
  var opts = Object.prototype.toString,
      ophop = Object.prototype.hasOwnProperty;

  return {
    // Class returns internal [[Class]] property, used to avoid cross-frame instanceof issues:
    Class: function(v) { return opts.call(v).replace(/^\[object *|\]$/g, ''); },
    HasProperty: function(o, p) { return p in o; },
    HasOwnProperty: function(o, p) { return ophop.call(o, p); },
    IsCallable: function(o) { return typeof o === 'function'; },
    ToInt32: function(v) { return v >> 0; },
    ToUint32: function(v) { return v >>> 0; }
  };
}());

// Snapshot intrinsics
var LN2 = Math.LN2,
    abs = Math.abs,
    floor = Math.floor,
    log = Math.log,
    min = Math.min,
    pow = Math.pow,
    round = Math.round;

// ES5: lock down object properties
function configureProperties(obj) {
  if (getOwnPropertyNames && defineProperty) {
    var props = getOwnPropertyNames(obj), i;
    for (i = 0; i < props.length; i += 1) {
      defineProperty(obj, props[i], {
        value: obj[props[i]],
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
}

// emulate ES5 getter/setter API using legacy APIs
// http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
// (second clause tests for Object.defineProperty() in IE<9 that only supports extending DOM prototypes, but
// note that IE<9 does not support __defineGetter__ or __defineSetter__ so it just renders the method harmless)
var defineProperty = Object.defineProperty || function(o, p, desc) {
  if (!o === Object(o)) throw new TypeError("Object.defineProperty called on non-object");
  if (ECMAScript.HasProperty(desc, 'get') && Object.prototype.__defineGetter__) { Object.prototype.__defineGetter__.call(o, p, desc.get); }
  if (ECMAScript.HasProperty(desc, 'set') && Object.prototype.__defineSetter__) { Object.prototype.__defineSetter__.call(o, p, desc.set); }
  if (ECMAScript.HasProperty(desc, 'value')) { o[p] = desc.value; }
  return o;
};

var getOwnPropertyNames = Object.getOwnPropertyNames || function getOwnPropertyNames(o) {
  if (o !== Object(o)) throw new TypeError("Object.getOwnPropertyNames called on non-object");
  var props = [], p;
  for (p in o) {
    if (ECMAScript.HasOwnProperty(o, p)) {
      props.push(p);
    }
  }
  return props;
};

// ES5: Make obj[index] an alias for obj._getter(index)/obj._setter(index, value)
// for index in 0 ... obj.length
function makeArrayAccessors(obj) {
  if (!defineProperty) { return; }

  if (obj.length > MAX_ARRAY_LENGTH) throw new RangeError("Array too large for polyfill");

  function makeArrayAccessor(index) {
    defineProperty(obj, index, {
      'get': function() { return obj._getter(index); },
      'set': function(v) { obj._setter(index, v); },
      enumerable: true,
      configurable: false
    });
  }

  var i;
  for (i = 0; i < obj.length; i += 1) {
    makeArrayAccessor(i);
  }
}

// Internal conversion functions:
//    pack<Type>()   - take a number (interpreted as Type), output a byte array
//    unpack<Type>() - take a byte array, output a Type-like number

function as_signed(value, bits) { var s = 32 - bits; return (value << s) >> s; }
function as_unsigned(value, bits) { var s = 32 - bits; return (value << s) >>> s; }

function packI8(n) { return [n & 0xff]; }
function unpackI8(bytes) { return as_signed(bytes[0], 8); }

function packU8(n) { return [n & 0xff]; }
function unpackU8(bytes) { return as_unsigned(bytes[0], 8); }

function packU8Clamped(n) { n = round(Number(n)); return [n < 0 ? 0 : n > 0xff ? 0xff : n & 0xff]; }

function packI16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
function unpackI16(bytes) { return as_signed(bytes[0] << 8 | bytes[1], 16); }

function packU16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
function unpackU16(bytes) { return as_unsigned(bytes[0] << 8 | bytes[1], 16); }

function packI32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
function unpackI32(bytes) { return as_signed(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }

function packU32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
function unpackU32(bytes) { return as_unsigned(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }

function packIEEE754(v, ebits, fbits) {

  var bias = (1 << (ebits - 1)) - 1,
      s, e, f, ln,
      i, bits, str, bytes;

  function roundToEven(n) {
    var w = floor(n), f = n - w;
    if (f < 0.5)
      return w;
    if (f > 0.5)
      return w + 1;
    return w % 2 ? w + 1 : w;
  }

  // Compute sign, exponent, fraction
  if (v !== v) {
    // NaN
    // http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping
    e = (1 << ebits) - 1; f = pow(2, fbits - 1); s = 0;
  } else if (v === Infinity || v === -Infinity) {
    e = (1 << ebits) - 1; f = 0; s = (v < 0) ? 1 : 0;
  } else if (v === 0) {
    e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
  } else {
    s = v < 0;
    v = abs(v);

    if (v >= pow(2, 1 - bias)) {
      e = min(floor(log(v) / LN2), 1023);
      f = roundToEven(v / pow(2, e) * pow(2, fbits));
      if (f / pow(2, fbits) >= 2) {
        e = e + 1;
        f = 1;
      }
      if (e > bias) {
        // Overflow
        e = (1 << ebits) - 1;
        f = 0;
      } else {
        // Normalized
        e = e + bias;
        f = f - pow(2, fbits);
      }
    } else {
      // Denormalized
      e = 0;
      f = roundToEven(v / pow(2, 1 - bias - fbits));
    }
  }

  // Pack sign, exponent, fraction
  bits = [];
  for (i = fbits; i; i -= 1) { bits.push(f % 2 ? 1 : 0); f = floor(f / 2); }
  for (i = ebits; i; i -= 1) { bits.push(e % 2 ? 1 : 0); e = floor(e / 2); }
  bits.push(s ? 1 : 0);
  bits.reverse();
  str = bits.join('');

  // Bits to bytes
  bytes = [];
  while (str.length) {
    bytes.push(parseInt(str.substring(0, 8), 2));
    str = str.substring(8);
  }
  return bytes;
}

function unpackIEEE754(bytes, ebits, fbits) {

  // Bytes to bits
  var bits = [], i, j, b, str,
      bias, s, e, f;

  for (i = bytes.length; i; i -= 1) {
    b = bytes[i - 1];
    for (j = 8; j; j -= 1) {
      bits.push(b % 2 ? 1 : 0); b = b >> 1;
    }
  }
  bits.reverse();
  str = bits.join('');

  // Unpack sign, exponent, fraction
  bias = (1 << (ebits - 1)) - 1;
  s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
  e = parseInt(str.substring(1, 1 + ebits), 2);
  f = parseInt(str.substring(1 + ebits), 2);

  // Produce number
  if (e === (1 << ebits) - 1) {
    return f !== 0 ? NaN : s * Infinity;
  } else if (e > 0) {
    // Normalized
    return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
  } else if (f !== 0) {
    // Denormalized
    return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
  } else {
    return s < 0 ? -0 : 0;
  }
}

function unpackF64(b) { return unpackIEEE754(b, 11, 52); }
function packF64(v) { return packIEEE754(v, 11, 52); }
function unpackF32(b) { return unpackIEEE754(b, 8, 23); }
function packF32(v) { return packIEEE754(v, 8, 23); }


//
// 3 The ArrayBuffer Type
//

(function() {

  /** @constructor */
  var ArrayBuffer = function ArrayBuffer(length) {
    length = ECMAScript.ToInt32(length);
    if (length < 0) throw new RangeError('ArrayBuffer size is not a small enough positive integer');

    this.byteLength = length;
    this._bytes = [];
    this._bytes.length = length;

    var i;
    for (i = 0; i < this.byteLength; i += 1) {
      this._bytes[i] = 0;
    }

    configureProperties(this);
  };

  exports.ArrayBuffer = exports.ArrayBuffer || ArrayBuffer;

  //
  // 4 The ArrayBufferView Type
  //

  // NOTE: this constructor is not exported
  /** @constructor */
  var ArrayBufferView = function ArrayBufferView() {
    //this.buffer = null;
    //this.byteOffset = 0;
    //this.byteLength = 0;
  };

  //
  // 5 The Typed Array View Types
  //

  function makeConstructor(bytesPerElement, pack, unpack) {
    // Each TypedArray type requires a distinct constructor instance with
    // identical logic, which this produces.

    var ctor;
    ctor = function(buffer, byteOffset, length) {
      var array, sequence, i, s;

      if (!arguments.length || typeof arguments[0] === 'number') {
        // Constructor(unsigned long length)
        this.length = ECMAScript.ToInt32(arguments[0]);
        if (length < 0) throw new RangeError('ArrayBufferView size is not a small enough positive integer');

        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;
      } else if (typeof arguments[0] === 'object' && arguments[0].constructor === ctor) {
        // Constructor(TypedArray array)
        array = arguments[0];

        this.length = array.length;
        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;

        for (i = 0; i < this.length; i += 1) {
          this._setter(i, array._getter(i));
        }
      } else if (typeof arguments[0] === 'object' &&
                 !(arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
        // Constructor(sequence<type> array)
        sequence = arguments[0];

        this.length = ECMAScript.ToUint32(sequence.length);
        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;

        for (i = 0; i < this.length; i += 1) {
          s = sequence[i];
          this._setter(i, Number(s));
        }
      } else if (typeof arguments[0] === 'object' &&
                 (arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
        // Constructor(ArrayBuffer buffer,
        //             optional unsigned long byteOffset, optional unsigned long length)
        this.buffer = buffer;

        this.byteOffset = ECMAScript.ToUint32(byteOffset);
        if (this.byteOffset > this.buffer.byteLength) {
          throw new RangeError("byteOffset out of range");
        }

        if (this.byteOffset % this.BYTES_PER_ELEMENT) {
          // The given byteOffset must be a multiple of the element
          // size of the specific type, otherwise an exception is raised.
          throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
        }

        if (arguments.length < 3) {
          this.byteLength = this.buffer.byteLength - this.byteOffset;

          if (this.byteLength % this.BYTES_PER_ELEMENT) {
            throw new RangeError("length of buffer minus byteOffset not a multiple of the element size");
          }
          this.length = this.byteLength / this.BYTES_PER_ELEMENT;
        } else {
          this.length = ECMAScript.ToUint32(length);
          this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        }

        if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
          throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
        }
      } else {
        throw new TypeError("Unexpected argument type(s)");
      }

      this.constructor = ctor;

      configureProperties(this);
      makeArrayAccessors(this);
    };

    ctor.prototype = new ArrayBufferView();
    ctor.prototype.BYTES_PER_ELEMENT = bytesPerElement;
    ctor.prototype._pack = pack;
    ctor.prototype._unpack = unpack;
    ctor.BYTES_PER_ELEMENT = bytesPerElement;

    // getter type (unsigned long index);
    ctor.prototype._getter = function(index) {
      if (arguments.length < 1) throw new SyntaxError("Not enough arguments");

      index = ECMAScript.ToUint32(index);
      if (index >= this.length) {
        return undefined;
      }

      var bytes = [], i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        bytes.push(this.buffer._bytes[o]);
      }
      return this._unpack(bytes);
    };

    // NONSTANDARD: convenience alias for getter: type get(unsigned long index);
    ctor.prototype.get = ctor.prototype._getter;

    // setter void (unsigned long index, type value);
    ctor.prototype._setter = function(index, value) {
      if (arguments.length < 2) throw new SyntaxError("Not enough arguments");

      index = ECMAScript.ToUint32(index);
      if (index >= this.length) {
        return undefined;
      }

      var bytes = this._pack(value), i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        this.buffer._bytes[o] = bytes[i];
      }
    };

    // void set(TypedArray array, optional unsigned long offset);
    // void set(sequence<type> array, optional unsigned long offset);
    ctor.prototype.set = function(index, value) {
      if (arguments.length < 1) throw new SyntaxError("Not enough arguments");
      var array, sequence, offset, len,
          i, s, d,
          byteOffset, byteLength, tmp;

      if (typeof arguments[0] === 'object' && arguments[0].constructor === this.constructor) {
        // void set(TypedArray array, optional unsigned long offset);
        array = arguments[0];
        offset = ECMAScript.ToUint32(arguments[1]);

        if (offset + array.length > this.length) {
          throw new RangeError("Offset plus length of array is out of range");
        }

        byteOffset = this.byteOffset + offset * this.BYTES_PER_ELEMENT;
        byteLength = array.length * this.BYTES_PER_ELEMENT;

        if (array.buffer === this.buffer) {
          tmp = [];
          for (i = 0, s = array.byteOffset; i < byteLength; i += 1, s += 1) {
            tmp[i] = array.buffer._bytes[s];
          }
          for (i = 0, d = byteOffset; i < byteLength; i += 1, d += 1) {
            this.buffer._bytes[d] = tmp[i];
          }
        } else {
          for (i = 0, s = array.byteOffset, d = byteOffset;
               i < byteLength; i += 1, s += 1, d += 1) {
            this.buffer._bytes[d] = array.buffer._bytes[s];
          }
        }
      } else if (typeof arguments[0] === 'object' && typeof arguments[0].length !== 'undefined') {
        // void set(sequence<type> array, optional unsigned long offset);
        sequence = arguments[0];
        len = ECMAScript.ToUint32(sequence.length);
        offset = ECMAScript.ToUint32(arguments[1]);

        if (offset + len > this.length) {
          throw new RangeError("Offset plus length of array is out of range");
        }

        for (i = 0; i < len; i += 1) {
          s = sequence[i];
          this._setter(offset + i, Number(s));
        }
      } else {
        throw new TypeError("Unexpected argument type(s)");
      }
    };

    // TypedArray subarray(long begin, optional long end);
    ctor.prototype.subarray = function(start, end) {
      function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

      start = ECMAScript.ToInt32(start);
      end = ECMAScript.ToInt32(end);

      if (arguments.length < 1) { start = 0; }
      if (arguments.length < 2) { end = this.length; }

      if (start < 0) { start = this.length + start; }
      if (end < 0) { end = this.length + end; }

      start = clamp(start, 0, this.length);
      end = clamp(end, 0, this.length);

      var len = end - start;
      if (len < 0) {
        len = 0;
      }

      return new this.constructor(
        this.buffer, this.byteOffset + start * this.BYTES_PER_ELEMENT, len);
    };

    return ctor;
  }

  var Int8Array = makeConstructor(1, packI8, unpackI8);
  var Uint8Array = makeConstructor(1, packU8, unpackU8);
  var Uint8ClampedArray = makeConstructor(1, packU8Clamped, unpackU8);
  var Int16Array = makeConstructor(2, packI16, unpackI16);
  var Uint16Array = makeConstructor(2, packU16, unpackU16);
  var Int32Array = makeConstructor(4, packI32, unpackI32);
  var Uint32Array = makeConstructor(4, packU32, unpackU32);
  var Float32Array = makeConstructor(4, packF32, unpackF32);
  var Float64Array = makeConstructor(8, packF64, unpackF64);

  exports.Int8Array = exports.Int8Array || Int8Array;
  exports.Uint8Array = exports.Uint8Array || Uint8Array;
  exports.Uint8ClampedArray = exports.Uint8ClampedArray || Uint8ClampedArray;
  exports.Int16Array = exports.Int16Array || Int16Array;
  exports.Uint16Array = exports.Uint16Array || Uint16Array;
  exports.Int32Array = exports.Int32Array || Int32Array;
  exports.Uint32Array = exports.Uint32Array || Uint32Array;
  exports.Float32Array = exports.Float32Array || Float32Array;
  exports.Float64Array = exports.Float64Array || Float64Array;
}());

//
// 6 The DataView View Type
//

(function() {
  function r(array, index) {
    return ECMAScript.IsCallable(array.get) ? array.get(index) : array[index];
  }

  var IS_BIG_ENDIAN = (function() {
    var u16array = new(exports.Uint16Array)([0x1234]),
        u8array = new(exports.Uint8Array)(u16array.buffer);
    return r(u8array, 0) === 0x12;
  }());

  // Constructor(ArrayBuffer buffer,
  //             optional unsigned long byteOffset,
  //             optional unsigned long byteLength)
  /** @constructor */
  var DataView = function DataView(buffer, byteOffset, byteLength) {
    if (arguments.length === 0) {
      buffer = new ArrayBuffer(0);
    } else if (!(buffer instanceof ArrayBuffer || ECMAScript.Class(buffer) === 'ArrayBuffer')) {
      throw new TypeError("TypeError");
    }

    this.buffer = buffer || new ArrayBuffer(0);

    this.byteOffset = ECMAScript.ToUint32(byteOffset);
    if (this.byteOffset > this.buffer.byteLength) {
      throw new RangeError("byteOffset out of range");
    }

    if (arguments.length < 3) {
      this.byteLength = this.buffer.byteLength - this.byteOffset;
    } else {
      this.byteLength = ECMAScript.ToUint32(byteLength);
    }

    if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
      throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
    }

    configureProperties(this);
  };

  function makeGetter(arrayType) {
    return function(byteOffset, littleEndian) {

      byteOffset = ECMAScript.ToUint32(byteOffset);

      if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
        throw new RangeError("Array index out of range");
      }
      byteOffset += this.byteOffset;

      var uint8Array = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT),
          bytes = [], i;
      for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
        bytes.push(r(uint8Array, i));
      }

      if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
        bytes.reverse();
      }

      return r(new arrayType(new Uint8Array(bytes).buffer), 0);
    };
  }

  DataView.prototype.getUint8 = makeGetter(exports.Uint8Array);
  DataView.prototype.getInt8 = makeGetter(exports.Int8Array);
  DataView.prototype.getUint16 = makeGetter(exports.Uint16Array);
  DataView.prototype.getInt16 = makeGetter(exports.Int16Array);
  DataView.prototype.getUint32 = makeGetter(exports.Uint32Array);
  DataView.prototype.getInt32 = makeGetter(exports.Int32Array);
  DataView.prototype.getFloat32 = makeGetter(exports.Float32Array);
  DataView.prototype.getFloat64 = makeGetter(exports.Float64Array);

  function makeSetter(arrayType) {
    return function(byteOffset, value, littleEndian) {

      byteOffset = ECMAScript.ToUint32(byteOffset);
      if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
        throw new RangeError("Array index out of range");
      }

      // Get bytes
      var typeArray = new arrayType([value]),
          byteArray = new Uint8Array(typeArray.buffer),
          bytes = [], i, byteView;

      for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
        bytes.push(r(byteArray, i));
      }

      // Flip if necessary
      if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
        bytes.reverse();
      }

      // Write them
      byteView = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT);
      byteView.set(bytes);
    };
  }

  DataView.prototype.setUint8 = makeSetter(exports.Uint8Array);
  DataView.prototype.setInt8 = makeSetter(exports.Int8Array);
  DataView.prototype.setUint16 = makeSetter(exports.Uint16Array);
  DataView.prototype.setInt16 = makeSetter(exports.Int16Array);
  DataView.prototype.setUint32 = makeSetter(exports.Uint32Array);
  DataView.prototype.setInt32 = makeSetter(exports.Int32Array);
  DataView.prototype.setFloat32 = makeSetter(exports.Float32Array);
  DataView.prototype.setFloat64 = makeSetter(exports.Float64Array);

  exports.DataView = exports.DataView || DataView;

}());

},{}]},{},[])
;;module.exports=require("native-buffer-browserify").Buffer

},{}],4:[function(require,module,exports){
var Buffer=require("__browserify_Buffer");
(function (global, module) {

  if ('undefined' == typeof module) {
    var module = { exports: {} }
      , exports = module.exports
  }

  /**
   * Exports.
   */

  module.exports = expect;
  expect.Assertion = Assertion;

  /**
   * Exports version.
   */

  expect.version = '0.1.2';

  /**
   * Possible assertion flags.
   */

  var flags = {
      not: ['to', 'be', 'have', 'include', 'only']
    , to: ['be', 'have', 'include', 'only', 'not']
    , only: ['have']
    , have: ['own']
    , be: ['an']
  };

  function expect (obj) {
    return new Assertion(obj);
  }

  /**
   * Constructor
   *
   * @api private
   */

  function Assertion (obj, flag, parent) {
    this.obj = obj;
    this.flags = {};

    if (undefined != parent) {
      this.flags[flag] = true;

      for (var i in parent.flags) {
        if (parent.flags.hasOwnProperty(i)) {
          this.flags[i] = true;
        }
      }
    }

    var $flags = flag ? flags[flag] : keys(flags)
      , self = this

    if ($flags) {
      for (var i = 0, l = $flags.length; i < l; i++) {
        // avoid recursion
        if (this.flags[$flags[i]]) continue;

        var name = $flags[i]
          , assertion = new Assertion(this.obj, name, this)

        if ('function' == typeof Assertion.prototype[name]) {
          // clone the function, make sure we dont touch the prot reference
          var old = this[name];
          this[name] = function () {
            return old.apply(self, arguments);
          }

          for (var fn in Assertion.prototype) {
            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
              this[name][fn] = bind(assertion[fn], assertion);
            }
          }
        } else {
          this[name] = assertion;
        }
      }
    }
  };

  /**
   * Performs an assertion
   *
   * @api private
   */

  Assertion.prototype.assert = function (truth, msg, error) {
    var msg = this.flags.not ? error : msg
      , ok = this.flags.not ? !truth : truth;

    if (!ok) {
      throw new Error(msg.call(this));
    }

    this.and = new Assertion(this.obj);
  };

  /**
   * Check if the value is truthy
   *
   * @api public
   */

  Assertion.prototype.ok = function () {
    this.assert(
        !!this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
  };

  /**
   * Assert that the function throws.
   *
   * @param {Function|RegExp} callback, or regexp to match error string against
   * @api public
   */

  Assertion.prototype.throwError =
  Assertion.prototype.throwException = function (fn) {
    expect(this.obj).to.be.a('function');

    var thrown = false
      , not = this.flags.not

    try {
      this.obj();
    } catch (e) {
      if ('function' == typeof fn) {
        fn(e);
      } else if ('object' == typeof fn) {
        var subject = 'string' == typeof e ? e : e.message;
        if (not) {
          expect(subject).to.not.match(fn);
        } else {
          expect(subject).to.match(fn);
        }
      }
      thrown = true;
    }

    if ('object' == typeof fn && not) {
      // in the presence of a matcher, ensure the `not` only applies to
      // the matching.
      this.flags.not = false;
    }

    var name = this.obj.name || 'fn';
    this.assert(
        thrown
      , function(){ return 'expected ' + name + ' to throw an exception' }
      , function(){ return 'expected ' + name + ' not to throw an exception' });
  };

  /**
   * Checks if the array is empty.
   *
   * @api public
   */

  Assertion.prototype.empty = function () {
    var expectation;

    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
      if ('number' == typeof this.obj.length) {
        expectation = !this.obj.length;
      } else {
        expectation = !keys(this.obj).length;
      }
    } else {
      if ('string' != typeof this.obj) {
        expect(this.obj).to.be.an('object');
      }

      expect(this.obj).to.have.property('length');
      expectation = !this.obj.length;
    }

    this.assert(
        expectation
      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
    return this;
  };

  /**
   * Checks if the obj exactly equals another.
   *
   * @api public
   */

  Assertion.prototype.be =
  Assertion.prototype.equal = function (obj) {
    this.assert(
        obj === this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
    return this;
  };

  /**
   * Checks if the obj sortof equals another.
   *
   * @api public
   */

  Assertion.prototype.eql = function (obj) {
    this.assert(
        expect.eql(obj, this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) });
    return this;
  };

  /**
   * Assert within start to finish (inclusive).
   *
   * @param {Number} start
   * @param {Number} finish
   * @api public
   */

  Assertion.prototype.within = function (start, finish) {
    var range = start + '..' + finish;
    this.assert(
        this.obj >= start && this.obj <= finish
      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
    return this;
  };

  /**
   * Assert typeof / instance of
   *
   * @api public
   */

  Assertion.prototype.a =
  Assertion.prototype.an = function (type) {
    if ('string' == typeof type) {
      // proper english in error msg
      var n = /^[aeiou]/.test(type) ? 'n' : '';

      // typeof with support for 'array'
      this.assert(
          'array' == type ? isArray(this.obj) :
            'object' == type
              ? 'object' == typeof this.obj && null !== this.obj
              : type == typeof this.obj
        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
    } else {
      // instanceof
      var name = type.name || 'supplied constructor';
      this.assert(
          this.obj instanceof type
        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
    }

    return this;
  };

  /**
   * Assert numeric value above _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.greaterThan =
  Assertion.prototype.above = function (n) {
    this.assert(
        this.obj > n
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
    return this;
  };

  /**
   * Assert numeric value below _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.lessThan =
  Assertion.prototype.below = function (n) {
    this.assert(
        this.obj < n
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
    return this;
  };

  /**
   * Assert string value matches _regexp_.
   *
   * @param {RegExp} regexp
   * @api public
   */

  Assertion.prototype.match = function (regexp) {
    this.assert(
        regexp.exec(this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
    return this;
  };

  /**
   * Assert property "length" exists and has value of _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.length = function (n) {
    expect(this.obj).to.have.property('length');
    var len = this.obj.length;
    this.assert(
        n == len
      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
    return this;
  };

  /**
   * Assert property _name_ exists, with optional _val_.
   *
   * @param {String} name
   * @param {Mixed} val
   * @api public
   */

  Assertion.prototype.property = function (name, val) {
    if (this.flags.own) {
      this.assert(
          Object.prototype.hasOwnProperty.call(this.obj, name)
        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
      return this;
    }

    if (this.flags.not && undefined !== val) {
      if (undefined === this.obj[name]) {
        throw new Error(i(this.obj) + ' has no property ' + i(name));
      }
    } else {
      var hasProp;
      try {
        hasProp = name in this.obj
      } catch (e) {
        hasProp = undefined !== this.obj[name]
      }

      this.assert(
          hasProp
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
    }

    if (undefined !== val) {
      this.assert(
          val === this.obj[name]
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
          + ' of ' + i(val) });
    }

    this.obj = this.obj[name];
    return this;
  };

  /**
   * Assert that the array contains _obj_ or string contains _obj_.
   *
   * @param {Mixed} obj|string
   * @api public
   */

  Assertion.prototype.string =
  Assertion.prototype.contain = function (obj) {
    if ('string' == typeof this.obj) {
      this.assert(
          ~this.obj.indexOf(obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    } else {
      this.assert(
          ~indexOf(this.obj, obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    }
    return this;
  };

  /**
   * Assert exact keys or inclusion of keys by using
   * the `.own` modifier.
   *
   * @param {Array|String ...} keys
   * @api public
   */

  Assertion.prototype.key =
  Assertion.prototype.keys = function ($keys) {
    var str
      , ok = true;

    $keys = isArray($keys)
      ? $keys
      : Array.prototype.slice.call(arguments);

    if (!$keys.length) throw new Error('keys required');

    var actual = keys(this.obj)
      , len = $keys.length;

    // Inclusion
    ok = every($keys, function (key) {
      return ~indexOf(actual, key);
    });

    // Strict
    if (!this.flags.not && this.flags.only) {
      ok = ok && $keys.length == actual.length;
    }

    // Key string
    if (len > 1) {
      $keys = map($keys, function (key) {
        return i(key);
      });
      var last = $keys.pop();
      str = $keys.join(', ') + ', and ' + last;
    } else {
      str = i($keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (!this.flags.only ? 'include ' : 'only have ') + str;

    // Assertion
    this.assert(
        ok
      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });

    return this;
  };
  /**
   * Assert a failure.
   *
   * @param {String ...} custom message
   * @api public
   */
  Assertion.prototype.fail = function (msg) {
    msg = msg || "explicit failure";
    this.assert(false, msg, msg);
    return this;
  };

  /**
   * Function bind implementation.
   */

  function bind (fn, scope) {
    return function () {
      return fn.apply(scope, arguments);
    }
  }

  /**
   * Array every compatibility
   *
   * @see bit.ly/5Fq1N2
   * @api public
   */

  function every (arr, fn, thisObj) {
    var scope = thisObj || global;
    for (var i = 0, j = arr.length; i < j; ++i) {
      if (!fn.call(scope, arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  };

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  function indexOf (arr, o, i) {
    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, o, i);
    }

    if (arr.length === undefined) {
      return -1;
    }

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
        ; i < j && arr[i] !== o; i++);

    return j <= i ? -1 : i;
  };

  // https://gist.github.com/1044128/
  var getOuterHTML = function(element) {
    if ('outerHTML' in element) return element.outerHTML;
    var ns = "http://www.w3.org/1999/xhtml";
    var container = document.createElementNS(ns, '_');
    var elemProto = (window.HTMLElement || window.Element).prototype;
    var xmlSerializer = new XMLSerializer();
    var html;
    if (document.xmlVersion) {
      return xmlSerializer.serializeToString(element);
    } else {
      container.appendChild(element.cloneNode(false));
      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
      container.innerHTML = '';
      return html;
    }
  };

  // Returns true if object is a DOM element.
  var isDOMElement = function (object) {
    if (typeof HTMLElement === 'object') {
      return object instanceof HTMLElement;
    } else {
      return object &&
        typeof object === 'object' &&
        object.nodeType === 1 &&
        typeof object.nodeName === 'string';
    }
  };

  /**
   * Inspects an object.
   *
   * @see taken from node.js `util` module (copyright Joyent, MIT license)
   * @api private
   */

  function i (obj, showHidden, depth) {
    var seen = [];

    function stylize (str) {
      return str;
    };

    function format (value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (value && typeof value.inspect === 'function' &&
          // Filter out the util module, it's inspect function is special
          value !== exports &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        return value.inspect(recurseTimes);
      }

      // Primitive types cannot have properties
      switch (typeof value) {
        case 'undefined':
          return stylize('undefined', 'undefined');

        case 'string':
          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
                                                   .replace(/'/g, "\\'")
                                                   .replace(/\\"/g, '"') + '\'';
          return stylize(simple, 'string');

        case 'number':
          return stylize('' + value, 'number');

        case 'boolean':
          return stylize('' + value, 'boolean');
      }
      // For some reason typeof null is "object", so special case here.
      if (value === null) {
        return stylize('null', 'null');
      }

      if (isDOMElement(value)) {
        return getOuterHTML(value);
      }

      // Look up the keys of the object.
      var visible_keys = keys(value);
      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

      // Functions without properties can be shortcutted.
      if (typeof value === 'function' && $keys.length === 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          var name = value.name ? ': ' + value.name : '';
          return stylize('[Function' + name + ']', 'special');
        }
      }

      // Dates without properties can be shortcutted
      if (isDate(value) && $keys.length === 0) {
        return stylize(value.toUTCString(), 'date');
      }

      var base, type, braces;
      // Determine the object type
      if (isArray(value)) {
        type = 'Array';
        braces = ['[', ']'];
      } else {
        type = 'Object';
        braces = ['{', '}'];
      }

      // Make functions say that they are functions
      if (typeof value === 'function') {
        var n = value.name ? ': ' + value.name : '';
        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
      } else {
        base = '';
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + value.toUTCString();
      }

      if ($keys.length === 0) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          return stylize('[Object]', 'special');
        }
      }

      seen.push(value);

      var output = map($keys, function (key) {
        var name, str;
        if (value.__lookupGetter__) {
          if (value.__lookupGetter__(key)) {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Getter/Setter]', 'special');
            } else {
              str = stylize('[Getter]', 'special');
            }
          } else {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Setter]', 'special');
            }
          }
        }
        if (indexOf(visible_keys, key) < 0) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (indexOf(seen, value[key]) < 0) {
            if (recurseTimes === null) {
              str = format(value[key]);
            } else {
              str = format(value[key], recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (isArray(value)) {
                str = map(str.split('\n'), function (line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + map(str.split('\n'), function (line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = stylize('[Circular]', 'special');
          }
        }
        if (typeof name === 'undefined') {
          if (type === 'Array' && key.match(/^\d+$/)) {
            return str;
          }
          name = json.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'")
                       .replace(/\\"/g, '"')
                       .replace(/(^"|"$)/g, "'");
            name = stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      });

      seen.pop();

      var numLinesEst = 0;
      var length = reduce(output, function (prev, cur) {
        numLinesEst++;
        if (indexOf(cur, '\n') >= 0) numLinesEst++;
        return prev + cur.length + 1;
      }, 0);

      if (length > 50) {
        output = braces[0] +
                 (base === '' ? '' : base + '\n ') +
                 ' ' +
                 output.join(',\n  ') +
                 ' ' +
                 braces[1];

      } else {
        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }

      return output;
    }
    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
  };

  function isArray (ar) {
    return Object.prototype.toString.call(ar) == '[object Array]';
  };

  function isRegExp(re) {
    var s;
    try {
      s = '' + re;
    } catch (e) {
      return false;
    }

    return re instanceof RegExp || // easy case
           // duck-type for context-switching evalcx case
           typeof(re) === 'function' &&
           re.constructor.name === 'RegExp' &&
           re.compile &&
           re.test &&
           re.exec &&
           s.match(/^\/.*\/[gim]{0,3}$/);
  };

  function isDate(d) {
    if (d instanceof Date) return true;
    return false;
  };

  function keys (obj) {
    if (Object.keys) {
      return Object.keys(obj);
    }

    var keys = [];

    for (var i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        keys.push(i);
      }
    }

    return keys;
  }

  function map (arr, mapper, that) {
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, mapper, that);
    }

    var other= new Array(arr.length);

    for (var i= 0, n = arr.length; i<n; i++)
      if (i in arr)
        other[i] = mapper.call(that, arr[i], i, arr);

    return other;
  };

  function reduce (arr, fun) {
    if (Array.prototype.reduce) {
      return Array.prototype.reduce.apply(
          arr
        , Array.prototype.slice.call(arguments, 1)
      );
    }

    var len = +this.length;

    if (typeof fun !== "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2) {
      var rv = arguments[1];
    } else {
      do {
        if (i in this) {
          rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      } while (true);
    }

    for (; i < len; i++) {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  };

  /**
   * Asserts deep equality
   *
   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
   * @api private
   */

  expect.eql = function eql (actual, expected) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    } else if ('undefined' != typeof Buffer
        && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
      if (actual.length != expected.length) return false;

      for (var i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) return false;
      }

      return true;

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    } else if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() === expected.getTime();

    // 7.3. Other pairs that do not both pass typeof value == "object",
    // equivalence is determined by ==.
    } else if (typeof actual != 'object' && typeof expected != 'object') {
      return actual == expected;

    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical "prototype" property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else {
      return objEquiv(actual, expected);
    }
  }

  function isUndefinedOrNull (value) {
    return value === null || value === undefined;
  }

  function isArguments (object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function objEquiv (a, b) {
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    // an identical "prototype" property.
    if (a.prototype !== b.prototype) return false;
    //~~~I've managed to break Object.keys through screwy arguments passing.
    //   Converting to array solves the problem.
    if (isArguments(a)) {
      if (!isArguments(b)) {
        return false;
      }
      a = pSlice.call(a);
      b = pSlice.call(b);
      return expect.eql(a, b);
    }
    try{
      var ka = keys(a),
        kb = keys(b),
        key, i;
    } catch (e) {//happens when one is a string literal and the other isn't
      return false;
    }
    // having the same number of owned properties (keys incorporates hasOwnProperty)
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
      if (!expect.eql(a[key], b[key]))
         return false;
    }
    return true;
  }

  var json = (function () {
    "use strict";

    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
      return {
          parse: nativeJSON.parse
        , stringify: nativeJSON.stringify
      }
    }

    var JSON = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    function date(d, key) {
      return isFinite(d.valueOf()) ?
          d.getUTCFullYear()     + '-' +
          f(d.getUTCMonth() + 1) + '-' +
          f(d.getUTCDate())      + 'T' +
          f(d.getUTCHours())     + ':' +
          f(d.getUTCMinutes())   + ':' +
          f(d.getUTCSeconds())   + 'Z' : null;
    };

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

  // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

  // If the value has a toJSON method, call it to obtain a replacement value.

        if (value instanceof Date) {
            value = date(key);
        }

  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

  // What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

  // JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.

            return String(value);

  // If the type is 'object', we might be dealing with an object or an array or
  // null.

        case 'object':

  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.

            if (!value) {
                return 'null';
            }

  // Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

  // Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

  // If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

  // Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

  // If the JSON object does not yet have a stringify method, give it one.

    JSON.stringify = function (value, replacer, space) {

  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

  // If the space parameter is a number, make an indent string containing that
  // many spaces.

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

  // If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === 'string') {
            indent = space;
        }

  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.

        return str('', {'': value});
    };

  // If the JSON object does not yet have a parse method, give it one.

    JSON.parse = function (text, reviver) {
    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

            return typeof reviver === 'function' ?
                walk({'': j}, '') : j;
        }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    };

    return JSON;
  })();

  if ('undefined' != typeof window) {
    window.expect = module.exports;
  }

})(
    this
  , 'undefined' != typeof module ? module : {}
  , 'undefined' != typeof exports ? exports : {}
);

},{"__browserify_Buffer":3}],5:[function(require,module,exports){
/*jshint maxlen:false */
'use strict';

var fs = require('fs');
var expect = require('expect.js');
var toga = require('../../lib/toga');
var Toga = toga;

describe('Toga', function () {
    it('should ignore non-blocks', function() {
        var ignore = "// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n";

        expect(toga(ignore)).to.eql([
            { 'type': 'Code', 'body': '// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = \'/** ignore */\';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n' }
        ]);
    });

    it('should parse empty blocks', function() {
        var empty = "/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n";

        expect(toga()).to.eql([
            { 'type': 'Code', 'body': 'undefined' }
        ]);

        expect(toga(null)).to.eql([
            { 'type': 'Code', 'body': 'null' }
        ]);

        expect(toga('')).to.eql([
            { 'type': 'Code', 'body': '' }
        ]);

        expect(toga(empty)).to.eql([
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

        expect(toga(desc)).to.eql([
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

        expect(toga(tag)).to.eql([
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

        expect(toga(arg)).to.eql([
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

        expect(toga(type)).to.eql([
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

        expect(toga(name)).to.eql([
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

        expect(tokens).to.eql([
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

        expect(tokens).to.eql([
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

        expect(tokens).to.eql([
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

},{"../../lib/toga":1,"expect.js":4,"fs":2}]},{},[5])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3NoYW5ub25tb2VsbGVyL3RvZ2EvbGliL3RvZ2EuanMiLCIvVXNlcnMvc21vZWxsZXIvUmVwb3MvZ2l0aHViL3NoYW5ub25tb2VsbGVyL3RvZ2Evbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvX2VtcHR5LmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvYnVmZmVyLmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL25vZGVfbW9kdWxlcy9leHBlY3QuanMvZXhwZWN0LmpzIiwiL1VzZXJzL3Ntb2VsbGVyL1JlcG9zL2dpdGh1Yi9zaGFubm9ubW9lbGxlci90b2dhL3Rlc3Qvc3BlYy90b2dhLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbnpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcnVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTGluZSBtYXRjaGluZyBwYXR0ZXJucy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0LjxTdHJpbmcsUmVnRXhwPn1cbiAqL1xudmFyIG1hdGNoTGluZXMgPSB7XG4gICAgYW55OiAvXi9nbSxcbiAgICBlbXB0eTogL14kL2dtLFxuICAgIGVkZ2U6IC9eW1xcdCBdKlxcbnxcXG5bXFx0IF0qJC9nXG59O1xuXG4vKipcbiAqIERlZmF1bHQgQy1zdHlsZSBncmFtbWFyLlxuICpcbiAqIEB0eXBlIHtPYmplY3QuPFN0cmluZyxSZWdFeHA+fVxuICovXG52YXIgZGVmYXVsdEdyYW1tYXIgPSB7XG4gICAgYmxvY2tTcGxpdDogLyheW1xcdCBdKlxcL1xcKlxcKig/IVxcLylbXFxzXFxTXSo/XFxzKlxcKlxcLykvbSxcbiAgICBibG9ja1BhcnNlOiAvXltcXHQgXSpcXC9cXCpcXCooPyFcXC8pKFtcXHNcXFNdKj8pXFxzKlxcKlxcLy9tLFxuICAgIGluZGVudDogL15bXFx0IFxcKl0vZ20sXG4gICAgdGFnU3BsaXQ6IC9eW1xcdCBdKkAvbSxcbiAgICB0YWdQYXJzZTogL14oXFx3KylbXFx0IFxcLV0qKFxce1teXFx9XStcXH0pP1tcXHQgXFwtXSooXFxbW15cXF1dKlxcXVxcKj98XFxTKik/W1xcdCBcXC1dKihbXFxzXFxTXSspPyQvbSxcbiAgICBuYW1lZDogL14oYXJnKHVtZW50KT98YXVnbWVudHN8Y2xhc3N8ZXh0ZW5kc3xtZXRob2R8cGFyYW18cHJvcChlcnR5KT8pJC9cbn07XG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICByYXc6IGZhbHNlXG59O1xuXG4vKipcbiAqIENvcGllcyB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIG9uZSBvciBtb3JlIG9iamVjdHMgdG8gYSB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgVGFyZ2V0IG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2Jqcy4uLl0gT2JqZWN0cyB3aXRoIHByb3BlcnRpZXMgdG8gY29weS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGFyZ2V0IG9iamVjdCwgYXVnbWVudGVkLlxuICovXG52YXIgY29waWVyID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdmFyIGFyZztcbiAgICB2YXIga2V5O1xuICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBpID0gMTtcblxuICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgYXJnID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICAgIGZvciAoa2V5IGluIGFyZykge1xuICAgICAgICAgICAgaWYgKGFyZy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBhcmdba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuXG4vKipcbiAqICMgVG9nYVxuICpcbiAqIFRoZSBzdHVwaWQgZG9jLWJsb2NrIHBhcnNlci4gR2VuZXJhdGVzIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIGJhc2VkIG9uIGFcbiAqIGN1c3RvbWl6YWJsZSByZWd1bGFyLWV4cHJlc3Npb24gZ3JhbW1hci4gRGVmYXVsdHMgdG8gQy1zdHlsZSBjb21tZW50IGJsb2NrcyxcbiAqIHNvIGl0IHN1cHBvcnRzIEphdmFTY3JpcHQsIFBIUCwgQysrLCBhbmQgZXZlbiBDU1MgcmlnaHQgb3V0IG9mIHRoZSBib3guXG4gKlxuICogVGFncyBhcmUgcGFyc2VkIGdyZWVkaWx5LiBJZiBpdCBsb29rcyBsaWtlIGEgdGFnLCBpdCdzIGEgdGFnLiBXaGF0IHlvdSBkb1xuICogd2l0aCB0aGVtIGlzIGNvbXBsZXRlbHkgdXAgdG8geW91LiBSZW5kZXIgc29tZXRoaW5nIGh1bWFuLXJlYWRhYmxlLCBwZXJoYXBzP1xuICpcbiAqIEBjbGFzcyBUb2dhXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Jsb2NrXVxuICogQHBhcmFtIHtPYmplY3R9IFtncmFtbWFyXVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRvZ2EoYmxvY2ssIGdyYW1tYXIpIHtcbiAgICAvLyBNYWtlIGBibG9ja2Agb3B0aW9uYWxcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYmxvY2sgPT09ICdvYmplY3QnICYmIGJsb2NrKSB7XG4gICAgICAgIGdyYW1tYXIgPSBibG9jaztcbiAgICAgICAgYmxvY2sgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gU3VwcG9ydCBmdW5jdGlvbmFsIGV4ZWN1dGlvbjogYHRvZ2EoYmxvY2ssIGdyYW1tYXIpYFxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUb2dhKSkge1xuICAgICAgICByZXR1cm4gbmV3IFRvZ2EoZ3JhbW1hcikucGFyc2UoYmxvY2spO1xuICAgIH1cblxuICAgIC8vIFNldCBkZWZhdWx0c1xuICAgIHRoaXMuZ3JhbW1hciA9IGNvcGllcih7fSwgZGVmYXVsdEdyYW1tYXIsIGdyYW1tYXIpO1xuICAgIHRoaXMub3B0aW9ucyA9IGNvcGllcih7fSwgZGVmYXVsdE9wdGlvbnMpO1xuXG4gICAgLy8gRW5mb3JjZSBjb250ZXh0XG4gICAgdGhpcy5wYXJzZSA9IHRoaXMucGFyc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLnBhcnNlQmxvY2sgPSB0aGlzLnBhcnNlQmxvY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnBhcnNlQ29kZSA9IHRoaXMucGFyc2VDb2RlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJzZURvY0Jsb2NrID0gdGhpcy5wYXJzZURvY0Jsb2NrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXJzZVRhZyA9IHRoaXMucGFyc2VUYWcuYmluZCh0aGlzKTtcbn1cblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlXG4gKiBAcGFyYW0ge1N0cmluZ30gYmxvY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc11cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuVG9nYS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihibG9jaywgb3B0aW9ucykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGNvcGllcih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBTdHJpbmcoYmxvY2spXG4gICAgICAgIC5zcGxpdCh0aGlzLmdyYW1tYXIuYmxvY2tTcGxpdClcbiAgICAgICAgLm1hcCh0aGlzLnBhcnNlQmxvY2spO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlQmxvY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlQmxvY2sgPSBmdW5jdGlvbihibG9jaykge1xuICAgIGlmICh0aGlzLmdyYW1tYXIuYmxvY2tQYXJzZS50ZXN0KGJsb2NrKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURvY0Jsb2NrKGJsb2NrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXJzZUNvZGUoYmxvY2spO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlQ29kZVxuICogQHBhcmFtIHtTdHJpbmd9IFtibG9ja11cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuVG9nYS5wcm90b3R5cGUucGFyc2VDb2RlID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnQ29kZScsXG4gICAgICAgIGJvZHk6IFN0cmluZyhibG9jaylcbiAgICB9O1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlRG9jQmxvY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYmxvY2tdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblRvZ2EucHJvdG90eXBlLnBhcnNlRG9jQmxvY2sgPSBmdW5jdGlvbihibG9jaykge1xuICAgIGJsb2NrID0gU3RyaW5nKGJsb2NrKTtcblxuICAgIHZhciB0YWdzID0gdGhpc1xuICAgICAgICAubm9ybWFsaXplRG9jQmxvY2soYmxvY2spXG4gICAgICAgIC5zcGxpdCh0aGlzLmdyYW1tYXIudGFnU3BsaXQpO1xuXG4gICAgdmFyIHRva2VuID0ge1xuICAgICAgICB0eXBlOiAnRG9jQmxvY2snLFxuICAgICAgICBkZXNjcmlwdGlvbjogdGFncy5zaGlmdCgpLFxuICAgICAgICB0YWdzOiB0YWdzLm1hcCh0aGlzLnBhcnNlVGFnKVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJhdykge1xuICAgICAgICB0b2tlbi5yYXcgPSBibG9jaztcbiAgICB9XG5cbiAgICByZXR1cm4gdG9rZW47XG59O1xuXG4vKipcbiAqIEBtZXRob2Qgbm9ybWFsaXplRG9jQmxvY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBibG9ja1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5Ub2dhLnByb3RvdHlwZS5ub3JtYWxpemVEb2NCbG9jayA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgdmFyIGdyYW1tYXIgPSB0aGlzLmdyYW1tYXI7XG5cbiAgICAvLyBUcmltIGNvbW1lbnQgd3JhcHBlcnNcbiAgICB2YXIgYmxvY2tQYXJzZSA9IGdyYW1tYXIuYmxvY2tQYXJzZTtcblxuICAgIGJsb2NrID0gU3RyaW5nKGJsb2NrKVxuICAgICAgICAucmVwbGFjZShibG9ja1BhcnNlLCAnJDEnKVxuICAgICAgICAucmVwbGFjZShtYXRjaExpbmVzLmVkZ2UsICcnKTtcblxuICAgIC8vIFVuaW5kZW50IGNvbnRlbnRcbiAgICB2YXIgZW1wdHlMaW5lcztcbiAgICB2YXIgaW5kZW50ZWRMaW5lcztcbiAgICB2YXIgaW5kZW50ID0gZ3JhbW1hci5pbmRlbnQ7XG4gICAgdmFyIGxpbmVzID0gYmxvY2subWF0Y2gobWF0Y2hMaW5lcy5hbnkpLmxlbmd0aDtcblxuICAgIHdoaWxlIChsaW5lcyA+IDApIHtcbiAgICAgICAgZW1wdHlMaW5lcyA9IChibG9jay5tYXRjaChtYXRjaExpbmVzLmVtcHR5KSB8fCBbXSkubGVuZ3RoO1xuICAgICAgICBpbmRlbnRlZExpbmVzID0gKGJsb2NrLm1hdGNoKGluZGVudCkgfHwgW10pLmxlbmd0aDtcblxuICAgICAgICBpZiAoaW5kZW50ZWRMaW5lcyAmJiAoZW1wdHlMaW5lcyArIGluZGVudGVkTGluZXMgPT09IGxpbmVzKSkge1xuICAgICAgICAgICAgLy8gU3RyaXAgbGVhZGluZyBpbmRlbnQgY2hhcmFjdGVyc1xuICAgICAgICAgICAgYmxvY2sgPSBibG9jay5yZXBsYWNlKGluZGVudCwgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTm90IGluZGVudGVkIGFueW1vcmVcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJsb2NrO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIHBhcnNlVGFnXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Jsb2NrXVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5Ub2dhLnByb3RvdHlwZS5wYXJzZVRhZyA9IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgdmFyIGdyYW1tYXIgPSB0aGlzLmdyYW1tYXI7XG4gICAgdmFyIHBhcnRzID0gU3RyaW5nKGJsb2NrKS5tYXRjaChncmFtbWFyLnRhZ1BhcnNlKTtcbiAgICB2YXIgdGFnID0gcGFydHNbMV07XG4gICAgdmFyIHR5cGUgPSBwYXJ0c1syXTtcbiAgICB2YXIgbmFtZSA9IHBhcnRzWzNdIHx8ICcnO1xuICAgIHZhciBkZXNjcmlwdGlvbiA9IHBhcnRzWzRdIHx8ICcnO1xuICAgIHZhciB0b2tlbiA9IHt9O1xuXG4gICAgLy8gSGFuZGxlIG5hbWVkIHRhZ3NcblxuICAgIGlmICghZ3JhbW1hci5uYW1lZC50ZXN0KHRhZykpIHtcbiAgICAgICAgaWYgKG5hbWUgJiYgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gbmFtZSArICcgJyArIGRlc2NyaXB0aW9uO1xuICAgICAgICB9IGVsc2UgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWUgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gS2VlcCB0b2tlbnMgbGlnaHRcblxuICAgIGlmICh0YWcpIHtcbiAgICAgICAgdG9rZW4udGFnID0gdGFnO1xuICAgIH1cblxuICAgIGlmICh0eXBlKSB7XG4gICAgICAgIHRva2VuLnR5cGUgPSB0eXBlO1xuICAgIH1cblxuICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHRva2VuLm5hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgICB0b2tlbi5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiB0b2tlbjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVG9nYTtcbiIsbnVsbCwicmVxdWlyZT0oZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7XCJQY1pqOUxcIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgVEEgPSByZXF1aXJlKCd0eXBlZGFycmF5JylcbnZhciB4RGF0YVZpZXcgPSB0eXBlb2YgRGF0YVZpZXcgPT09ICd1bmRlZmluZWQnXG4gID8gVEEuRGF0YVZpZXcgOiBEYXRhVmlld1xudmFyIHhBcnJheUJ1ZmZlciA9IHR5cGVvZiBBcnJheUJ1ZmZlciA9PT0gJ3VuZGVmaW5lZCdcbiAgPyBUQS5BcnJheUJ1ZmZlciA6IEFycmF5QnVmZmVyXG52YXIgeFVpbnQ4QXJyYXkgPSB0eXBlb2YgVWludDhBcnJheSA9PT0gJ3VuZGVmaW5lZCdcbiAgPyBUQS5VaW50OEFycmF5IDogVWludDhBcnJheVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxudmFyIGJyb3dzZXJTdXBwb3J0XG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICpcbiAqIEZpcmVmb3ggaXMgYSBzcGVjaWFsIGNhc2UgYmVjYXVzZSBpdCBkb2Vzbid0IGFsbG93IGF1Z21lbnRpbmcgXCJuYXRpdmVcIiBvYmplY3RcbiAqIGluc3RhbmNlcy4gU2VlIGBQcm94eUJ1ZmZlcmAgYmVsb3cgZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZykge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29yay1hcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb25cbiAgLy8gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3Mgd2hpbGUgYmFzZTY0LWpzXG4gIC8vIGRvZXMgbm90Li5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIEFzc3VtZSBvYmplY3QgaXMgYW4gYXJyYXlcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWYgPSBhdWdtZW50KG5ldyB4VWludDhBcnJheShsZW5ndGgpKVxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgVWludDhBcnJheVxuICAgIGJ1Zi5zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5SXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5LlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuIGIgJiYgYi5faXNCdWZmZXJcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gc3RyLmxlbmd0aCAvIDJcblxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXR1cm4gc3RyLmxlbmd0aFxuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG4gIH1cblxuICB2YXIgaVxuICB2YXIgYnVmXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBidWYgPSBsaXN0W2ldXG4gICAgICB0b3RhbExlbmd0aCArPSBidWYubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgYnVmID0gbGlzdFtpXVxuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG4vLyBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICB9XG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAoaXNOYU4oYnl0ZSkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGJ5dGVzLCBwb3NcbiAgcmV0dXJuIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBieXRlcywgcG9zXG4gIHJldHVybiBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBieXRlcywgcG9zXG4gIHJldHVybiBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0dXJuIF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0dXJuIF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclRvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9ICh0aGlzIGluc3RhbmNlb2YgUHJveHlCdWZmZXIpXG4gICAgPyB0aGlzLl9wcm94eVxuICAgIDogdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcblxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldHVybiBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJUb0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuZnVuY3Rpb24gQnVmZmVyQ29weSAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKGVuZCA8IHN0YXJ0KVxuICAgIHRocm93IG5ldyBFcnJvcignc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBpZiAodGFyZ2V0X3N0YXJ0IDwgMCB8fCB0YXJnZXRfc3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHNvdXJjZS5sZW5ndGgpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDAgfHwgZW5kID4gc291cmNlLmxlbmd0aClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICAvLyBjb3B5IVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyBpKyspXG4gICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICByZXR1cm4gcmVxdWlyZSgnYmFzZTY0LWpzJykuZnJvbUJ5dGVBcnJheShieXRlcylcbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGJ5dGVzLmxlbmd0aCkge1xuICAgIGlmIChieXRlc1tpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnl0ZXNbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuXG4gICAgaSsrXG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmV0ID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG4vLyBUT0RPOiBhZGQgdGVzdCB0aGF0IG1vZGlmeWluZyB0aGUgbmV3IGJ1ZmZlciBzbGljZSB3aWxsIG1vZGlmeSBtZW1vcnkgaW4gdGhlXG4vLyBvcmlnaW5hbCBidWZmZXIhIFVzZSBjb2RlIGZyb206XG4vLyBodHRwOi8vbm9kZWpzLm9yZy9hcGkvYnVmZmVyLmh0bWwjYnVmZmVyX2J1Zl9zbGljZV9zdGFydF9lbmRcbmZ1bmN0aW9uIEJ1ZmZlclNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG4gIHJldHVybiBhdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpIC8vIFVpbnQ4QXJyYXkgYnVpbHQtaW4gbWV0aG9kXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YXIgYnVmID0gdGhpc1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gYnVmLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gYnVmW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgMSA9PT0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDIpKVxuICAgIGR2LnNldFVpbnQ4KDAsIGJ1ZltsZW4gLSAxXSlcbiAgICByZXR1cm4gZHYuZ2V0VWludDE2KDAsIGxpdHRsZUVuZGlhbilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYnVmLl9kYXRhdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyAzID49IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcig0KSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSArIG9mZnNldCA8IGxlbjsgaSsrKSB7XG4gICAgICBkdi5zZXRVaW50OChpLCBidWZbaSArIG9mZnNldF0pXG4gICAgfVxuICAgIHJldHVybiBkdi5nZXRVaW50MzIoMCwgbGl0dGxlRW5kaWFuKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBidWYuX2RhdGF2aWV3LmdldFVpbnQzMihvZmZzZXQsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWYgPSB0aGlzXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSBidWYubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiBidWYuX2RhdGF2aWV3LmdldEludDgob2Zmc2V0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDEgPT09IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcigyKSlcbiAgICBkdi5zZXRVaW50OCgwLCBidWZbbGVuIC0gMV0pXG4gICAgcmV0dXJuIGR2LmdldEludDE2KDAsIGxpdHRsZUVuZGlhbilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYnVmLl9kYXRhdmlldy5nZXRJbnQxNihvZmZzZXQsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pIHtcbiAgICByZXR1cm5cbiAgfSBlbHNlIGlmIChvZmZzZXQgKyAzID49IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcig0KSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSArIG9mZnNldCA8IGxlbjsgaSsrKSB7XG4gICAgICBkdi5zZXRVaW50OChpLCBidWZbaSArIG9mZnNldF0pXG4gICAgfVxuICAgIHJldHVybiBkdi5nZXRJbnQzMigwLCBsaXR0bGVFbmRpYW4pXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJ1Zi5fZGF0YXZpZXcuZ2V0SW50MzIob2Zmc2V0LCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyUmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gYnVmLl9kYXRhdmlldy5nZXRGbG9hdDMyKG9mZnNldCwgbGl0dGxlRW5kaWFuKVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gYnVmLl9kYXRhdmlldy5nZXRGbG9hdDY0KG9mZnNldCwgbGl0dGxlRW5kaWFuKVxufVxuXG5mdW5jdGlvbiBCdWZmZXJSZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlclJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWYgPSB0aGlzXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gYnVmLmxlbmd0aCkgcmV0dXJuXG5cbiAgYnVmW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDEgPT09IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcigyKSlcbiAgICBkdi5zZXRVaW50MTYoMCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgICBidWZbb2Zmc2V0XSA9IGR2LmdldFVpbnQ4KDApXG4gIH0gZWxzZSB7XG4gICAgYnVmLl9kYXRhdmlldy5zZXRVaW50MTYob2Zmc2V0LCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiAobGl0dGxlRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgMyA+PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoNCkpXG4gICAgZHYuc2V0VWludDMyKDAsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgKyBvZmZzZXQgPCBsZW47IGkrKykge1xuICAgICAgYnVmW2kgKyBvZmZzZXRdID0gZHYuZ2V0VWludDgoaSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYnVmLl9kYXRhdmlldy5zZXRVaW50MzIob2Zmc2V0LCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YXIgYnVmID0gdGhpc1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSBidWYubGVuZ3RoKSByZXR1cm5cblxuICBidWYuX2RhdGF2aWV3LnNldEludDgob2Zmc2V0LCB2YWx1ZSlcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDEgPT09IGxlbikge1xuICAgIHZhciBkdiA9IG5ldyB4RGF0YVZpZXcobmV3IHhBcnJheUJ1ZmZlcigyKSlcbiAgICBkdi5zZXRJbnQxNigwLCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICAgIGJ1ZltvZmZzZXRdID0gZHYuZ2V0VWludDgoMClcbiAgfSBlbHNlIHtcbiAgICBidWYuX2RhdGF2aWV3LnNldEludDE2KG9mZnNldCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgMyA+PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoNCkpXG4gICAgZHYuc2V0SW50MzIoMCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgICBmb3IgKHZhciBpID0gMDsgaSArIG9mZnNldCA8IGxlbjsgaSsrKSB7XG4gICAgICBidWZbaSArIG9mZnNldF0gPSBkdi5nZXRVaW50OChpKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBidWYuX2RhdGF2aWV3LnNldEludDMyKG9mZnNldCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBCdWZmZXJXcml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIChsaXR0bGVFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAob2Zmc2V0ICsgMyA+PSBsZW4pIHtcbiAgICB2YXIgZHYgPSBuZXcgeERhdGFWaWV3KG5ldyB4QXJyYXlCdWZmZXIoNCkpXG4gICAgZHYuc2V0RmxvYXQzMigwLCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICAgIGZvciAodmFyIGkgPSAwOyBpICsgb2Zmc2V0IDwgbGVuOyBpKyspIHtcbiAgICAgIGJ1ZltpICsgb2Zmc2V0XSA9IGR2LmdldFVpbnQ4KGkpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGJ1Zi5fZGF0YXZpZXcuc2V0RmxvYXQzMihvZmZzZXQsIHZhbHVlLCBsaXR0bGVFbmRpYW4pXG4gIH1cbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgKGxpdHRsZUVuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbikge1xuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKG9mZnNldCArIDcgPj0gbGVuKSB7XG4gICAgdmFyIGR2ID0gbmV3IHhEYXRhVmlldyhuZXcgeEFycmF5QnVmZmVyKDgpKVxuICAgIGR2LnNldEZsb2F0NjQoMCwgdmFsdWUsIGxpdHRsZUVuZGlhbilcbiAgICBmb3IgKHZhciBpID0gMDsgaSArIG9mZnNldCA8IGxlbjsgaSsrKSB7XG4gICAgICBidWZbaSArIG9mZnNldF0gPSBkdi5nZXRVaW50OChpKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBidWYuX2RhdGF2aWV3LnNldEZsb2F0NjQob2Zmc2V0LCB2YWx1ZSwgbGl0dGxlRW5kaWFuKVxuICB9XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcldyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gQnVmZmVyV3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5mdW5jdGlvbiBCdWZmZXJGaWxsICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCBpc05hTih2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBFcnJvcignZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoZW5kIDwgMCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignZW5kIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5mdW5jdGlvbiBCdWZmZXJJbnNwZWN0ICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLy8gQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuLy8gQWRkZWQgaW4gTm9kZSAwLjEyLlxuZnVuY3Rpb24gQnVmZmVyVG9BcnJheUJ1ZmZlciAoKSB7XG4gIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG59XG5cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG4vKipcbiAqIENoZWNrIHRvIHNlZSBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBhdWdtZW50aW5nIGEgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLlxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gX2Jyb3dzZXJTdXBwb3J0ICgpIHtcbiAgdmFyIGFyciA9IG5ldyB4VWludDhBcnJheSgwKVxuICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuICg0MiA9PT0gYXJyLmZvbygpKVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzczogUHJveHlCdWZmZXJcbiAqID09PT09PT09PT09PT09PT09PVxuICpcbiAqIE9ubHkgdXNlZCBpbiBGaXJlZm94LCBzaW5jZSBGaXJlZm94IGRvZXMgbm90IGFsbG93IGF1Z21lbnRpbmcgXCJuYXRpdmVcIlxuICogb2JqZWN0cyAobGlrZSBVaW50OEFycmF5IGluc3RhbmNlcykgd2l0aCBuZXcgcHJvcGVydGllcyBmb3Igc29tZSB1bmtub3duXG4gKiAocHJvYmFibHkgc2lsbHkpIHJlYXNvbi4gU28gd2UnbGzCoHVzZSBhbiBFUzYgUHJveHkgKHN1cHBvcnRlZCBzaW5jZVxuICogRmlyZWZveCAxOCkgdG8gd3JhcCB0aGUgVWludDhBcnJheSBpbnN0YW5jZSB3aXRob3V0IGFjdHVhbGx5IGFkZGluZyBhbnlcbiAqIHByb3BlcnRpZXMgdG8gaXQuXG4gKlxuICogSW5zdGFuY2VzIG9mIHRoaXMgXCJmYWtlXCIgQnVmZmVyIGNsYXNzIGFyZSB0aGUgXCJ0YXJnZXRcIiBvZiB0aGVcbiAqIEVTNiBQcm94eSAoc2VlIGBhdWdtZW50YCBmdW5jdGlvbikuXG4gKlxuICogV2UgY291bGRuJ3QganVzdCB1c2UgdGhlIGBVaW50OEFycmF5YCBhcyB0aGUgdGFyZ2V0IG9mIHRoZSBgUHJveHlgIGJlY2F1c2VcbiAqIFByb3hpZXMgaGF2ZSBhbiBpbXBvcnRhbnQgbGltaXRhdGlvbiBvbiB0cmFwcGluZyB0aGUgYHRvU3RyaW5nYCBtZXRob2QuXG4gKiBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHByb3h5KWAgZ2V0cyBjYWxsZWQgd2hlbmV2ZXIgc29tZXRoaW5nIGlzXG4gKiBpbXBsaWNpdGx5IGNhc3QgdG8gYSBTdHJpbmcuIFVuZm9ydHVuYXRlbHksIHdpdGggYSBgUHJveHlgIHRoaXNcbiAqIHVuY29uZGl0aW9uYWxseSByZXR1cm5zIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGFyZ2V0KWAgd2hpY2ggd291bGRcbiAqIGFsd2F5cyByZXR1cm4gXCJbb2JqZWN0IFVpbnQ4QXJyYXldXCIgaWYgd2UgdXNlZCB0aGUgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGFzXG4gKiB0aGUgdGFyZ2V0LiBBbmQsIHJlbWVtYmVyLCBpbiBGaXJlZm94IHdlIGNhbm5vdCByZWRlZmluZSB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBpbnN0YW5jZSdzIGB0b1N0cmluZ2AgbWV0aG9kLlxuICpcbiAqIFNvLCB3ZSB1c2UgdGhpcyBgUHJveHlCdWZmZXJgIGNsYXNzIGFzIHRoZSBwcm94eSdzIFwidGFyZ2V0XCIuIFNpbmNlIHRoaXMgY2xhc3NcbiAqIGhhcyBpdHMgb3duIGN1c3RvbSBgdG9TdHJpbmdgIG1ldGhvZCwgaXQgd2lsbCBnZXQgY2FsbGVkIHdoZW5ldmVyIGB0b1N0cmluZ2BcbiAqIGdldHMgY2FsbGVkLCBpbXBsaWNpdGx5IG9yIGV4cGxpY2l0bHksIG9uIHRoZSBgUHJveHlgIGluc3RhbmNlLlxuICpcbiAqIFdlIGFsc28gaGF2ZSB0byBkZWZpbmUgdGhlIFVpbnQ4QXJyYXkgbWV0aG9kcyBgc3ViYXJyYXlgIGFuZCBgc2V0YCBvblxuICogYFByb3h5QnVmZmVyYCBiZWNhdXNlIGlmIHdlIGRpZG4ndCB0aGVuIGBwcm94eS5zdWJhcnJheSgwKWAgd291bGQgaGF2ZSBpdHNcbiAqIGB0aGlzYCBzZXQgdG8gYHByb3h5YCAoYSBgUHJveHlgIGluc3RhbmNlKSB3aGljaCB0aHJvd3MgYW4gZXhjZXB0aW9uIGluXG4gKiBGaXJlZm94IHdoaWNoIGV4cGVjdHMgaXQgdG8gYmUgYSBgVHlwZWRBcnJheWAgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIFByb3h5QnVmZmVyIChhcnIpIHtcbiAgdGhpcy5fYXJyID0gYXJyXG5cbiAgaWYgKGFyci5ieXRlTGVuZ3RoICE9PSAwKVxuICAgIHRoaXMuX2RhdGF2aWV3ID0gbmV3IHhEYXRhVmlldyhhcnIuYnVmZmVyLCBhcnIuYnl0ZU9mZnNldCwgYXJyLmJ5dGVMZW5ndGgpXG59XG5cblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IEJ1ZmZlcldyaXRlXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBCdWZmZXJUb1N0cmluZ1xuUHJveHlCdWZmZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nID0gQnVmZmVyVG9TdHJpbmdcblByb3h5QnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBCdWZmZXJUb0pTT05cblByb3h5QnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gQnVmZmVyQ29weVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnNsaWNlID0gQnVmZmVyU2xpY2VcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBCdWZmZXJSZWFkVUludDhcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBCdWZmZXJSZWFkVUludDE2TEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBCdWZmZXJSZWFkVUludDE2QkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBCdWZmZXJSZWFkVUludDMyTEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBCdWZmZXJSZWFkVUludDMyQkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IEJ1ZmZlclJlYWRJbnQ4XG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBCdWZmZXJSZWFkSW50MTZMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gQnVmZmVyUmVhZEludDE2QkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IEJ1ZmZlclJlYWRJbnQzMkxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBCdWZmZXJSZWFkSW50MzJCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gQnVmZmVyUmVhZEZsb2F0TEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IEJ1ZmZlclJlYWRGbG9hdEJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gQnVmZmVyUmVhZERvdWJsZUxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gQnVmZmVyUmVhZERvdWJsZUJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IEJ1ZmZlcldyaXRlVUludDhcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gQnVmZmVyV3JpdGVVSW50MTZMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBCdWZmZXJXcml0ZVVJbnQxNkJFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IEJ1ZmZlcldyaXRlVUludDMyTEVcblByb3h5QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gQnVmZmVyV3JpdGVVSW50MzJCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IEJ1ZmZlcldyaXRlSW50OFxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IEJ1ZmZlcldyaXRlSW50MTZMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IEJ1ZmZlcldyaXRlSW50MTZCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IEJ1ZmZlcldyaXRlSW50MzJMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IEJ1ZmZlcldyaXRlSW50MzJCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IEJ1ZmZlcldyaXRlRmxvYXRMRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IEJ1ZmZlcldyaXRlRmxvYXRCRVxuUHJveHlCdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBCdWZmZXJXcml0ZURvdWJsZUxFXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IEJ1ZmZlcldyaXRlRG91YmxlQkVcblByb3h5QnVmZmVyLnByb3RvdHlwZS5maWxsID0gQnVmZmVyRmlsbFxuUHJveHlCdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBCdWZmZXJJbnNwZWN0XG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IEJ1ZmZlclRvQXJyYXlCdWZmZXJcblByb3h5QnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUuc3ViYXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9hcnIuc3ViYXJyYXkuYXBwbHkodGhpcy5fYXJyLCBhcmd1bWVudHMpXG59XG5Qcm94eUJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fYXJyLnNldC5hcHBseSh0aGlzLl9hcnIsIGFyZ3VtZW50cylcbn1cblxudmFyIFByb3h5SGFuZGxlciA9IHtcbiAgZ2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgaW4gdGFyZ2V0KSByZXR1cm4gdGFyZ2V0W25hbWVdXG4gICAgZWxzZSByZXR1cm4gdGFyZ2V0Ll9hcnJbbmFtZV1cbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHRhcmdldC5fYXJyW25hbWVdID0gdmFsdWVcbiAgfVxufVxuXG5mdW5jdGlvbiBhdWdtZW50IChhcnIpIHtcbiAgaWYgKGJyb3dzZXJTdXBwb3J0ID09PSB1bmRlZmluZWQpIHtcbiAgICBicm93c2VyU3VwcG9ydCA9IF9icm93c2VyU3VwcG9ydCgpXG4gIH1cblxuICBpZiAoYnJvd3NlclN1cHBvcnQpIHtcbiAgICAvLyBBdWdtZW50IHRoZSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gICAgYXJyLndyaXRlID0gQnVmZmVyV3JpdGVcbiAgICBhcnIudG9TdHJpbmcgPSBCdWZmZXJUb1N0cmluZ1xuICAgIGFyci50b0xvY2FsZVN0cmluZyA9IEJ1ZmZlclRvU3RyaW5nXG4gICAgYXJyLnRvSlNPTiA9IEJ1ZmZlclRvSlNPTlxuICAgIGFyci5jb3B5ID0gQnVmZmVyQ29weVxuICAgIGFyci5zbGljZSA9IEJ1ZmZlclNsaWNlXG4gICAgYXJyLnJlYWRVSW50OCA9IEJ1ZmZlclJlYWRVSW50OFxuICAgIGFyci5yZWFkVUludDE2TEUgPSBCdWZmZXJSZWFkVUludDE2TEVcbiAgICBhcnIucmVhZFVJbnQxNkJFID0gQnVmZmVyUmVhZFVJbnQxNkJFXG4gICAgYXJyLnJlYWRVSW50MzJMRSA9IEJ1ZmZlclJlYWRVSW50MzJMRVxuICAgIGFyci5yZWFkVUludDMyQkUgPSBCdWZmZXJSZWFkVUludDMyQkVcbiAgICBhcnIucmVhZEludDggPSBCdWZmZXJSZWFkSW50OFxuICAgIGFyci5yZWFkSW50MTZMRSA9IEJ1ZmZlclJlYWRJbnQxNkxFXG4gICAgYXJyLnJlYWRJbnQxNkJFID0gQnVmZmVyUmVhZEludDE2QkVcbiAgICBhcnIucmVhZEludDMyTEUgPSBCdWZmZXJSZWFkSW50MzJMRVxuICAgIGFyci5yZWFkSW50MzJCRSA9IEJ1ZmZlclJlYWRJbnQzMkJFXG4gICAgYXJyLnJlYWRGbG9hdExFID0gQnVmZmVyUmVhZEZsb2F0TEVcbiAgICBhcnIucmVhZEZsb2F0QkUgPSBCdWZmZXJSZWFkRmxvYXRCRVxuICAgIGFyci5yZWFkRG91YmxlTEUgPSBCdWZmZXJSZWFkRG91YmxlTEVcbiAgICBhcnIucmVhZERvdWJsZUJFID0gQnVmZmVyUmVhZERvdWJsZUJFXG4gICAgYXJyLndyaXRlVUludDggPSBCdWZmZXJXcml0ZVVJbnQ4XG4gICAgYXJyLndyaXRlVUludDE2TEUgPSBCdWZmZXJXcml0ZVVJbnQxNkxFXG4gICAgYXJyLndyaXRlVUludDE2QkUgPSBCdWZmZXJXcml0ZVVJbnQxNkJFXG4gICAgYXJyLndyaXRlVUludDMyTEUgPSBCdWZmZXJXcml0ZVVJbnQzMkxFXG4gICAgYXJyLndyaXRlVUludDMyQkUgPSBCdWZmZXJXcml0ZVVJbnQzMkJFXG4gICAgYXJyLndyaXRlSW50OCA9IEJ1ZmZlcldyaXRlSW50OFxuICAgIGFyci53cml0ZUludDE2TEUgPSBCdWZmZXJXcml0ZUludDE2TEVcbiAgICBhcnIud3JpdGVJbnQxNkJFID0gQnVmZmVyV3JpdGVJbnQxNkJFXG4gICAgYXJyLndyaXRlSW50MzJMRSA9IEJ1ZmZlcldyaXRlSW50MzJMRVxuICAgIGFyci53cml0ZUludDMyQkUgPSBCdWZmZXJXcml0ZUludDMyQkVcbiAgICBhcnIud3JpdGVGbG9hdExFID0gQnVmZmVyV3JpdGVGbG9hdExFXG4gICAgYXJyLndyaXRlRmxvYXRCRSA9IEJ1ZmZlcldyaXRlRmxvYXRCRVxuICAgIGFyci53cml0ZURvdWJsZUxFID0gQnVmZmVyV3JpdGVEb3VibGVMRVxuICAgIGFyci53cml0ZURvdWJsZUJFID0gQnVmZmVyV3JpdGVEb3VibGVCRVxuICAgIGFyci5maWxsID0gQnVmZmVyRmlsbFxuICAgIGFyci5pbnNwZWN0ID0gQnVmZmVySW5zcGVjdFxuICAgIGFyci50b0FycmF5QnVmZmVyID0gQnVmZmVyVG9BcnJheUJ1ZmZlclxuICAgIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgICBpZiAoYXJyLmJ5dGVMZW5ndGggIT09IDApXG4gICAgICBhcnIuX2RhdGF2aWV3ID0gbmV3IHhEYXRhVmlldyhhcnIuYnVmZmVyLCBhcnIuYnl0ZU9mZnNldCwgYXJyLmJ5dGVMZW5ndGgpXG5cbiAgICByZXR1cm4gYXJyXG5cbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIGlzIGEgYnJvd3NlciB0aGF0IGRvZXNuJ3Qgc3VwcG9ydCBhdWdtZW50aW5nIHRoZSBgVWludDhBcnJheWBcbiAgICAvLyBpbnN0YW5jZSAoKmFoZW0qIEZpcmVmb3gpIHNvIHVzZSBhbiBFUzYgYFByb3h5YC5cbiAgICB2YXIgcHJveHlCdWZmZXIgPSBuZXcgUHJveHlCdWZmZXIoYXJyKVxuICAgIHZhciBwcm94eSA9IG5ldyBQcm94eShwcm94eUJ1ZmZlciwgUHJveHlIYW5kbGVyKVxuICAgIHByb3h5QnVmZmVyLl9wcm94eSA9IHByb3h5XG4gICAgcmV0dXJuIHByb3h5XG4gIH1cbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5SXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKylcbiAgICBpZiAoc3RyLmNoYXJDb2RlQXQoaSkgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLmNoYXJBdChpKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiByZXF1aXJlKCdiYXNlNjQtanMnKS50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zLCBpID0gMFxuICB3aGlsZSAoaSA8IGxlbmd0aCkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG5cbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgICBpKytcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKlxuICogICAgICB2YWx1ZSAgICAgICAgICAgVGhlIG51bWJlciB0byBjaGVjayBmb3IgdmFsaWRpdHlcbiAqXG4gKiAgICAgIG1heCAgICAgICAgICAgICBUaGUgbWF4aW11bSB2YWx1ZVxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiAodmFsdWUpID09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLFxuICAgICAgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG4vKlxuICogQSBzZXJpZXMgb2YgY2hlY2tzIHRvIG1ha2Ugc3VyZSB3ZSBhY3R1YWxseSBoYXZlIGEgc2lnbmVkIDMyLWJpdCBudW1iZXJcbiAqL1xuZnVuY3Rpb24gdmVyaWZzaW50KHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mICh2YWx1ZSkgPT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0KHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mICh2YWx1ZSkgPT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuXG59LHtcImJhc2U2NC1qc1wiOjMsXCJ0eXBlZGFycmF5XCI6NH1dLFwibmF0aXZlLWJ1ZmZlci1icm93c2VyaWZ5XCI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xubW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgnUGNaajlMJyk7XG59LHt9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbihmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheShiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFycjtcblx0XG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnO1xuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHRwbGFjZUhvbGRlcnMgPSBiNjQuaW5kZXhPZignPScpO1xuXHRcdHBsYWNlSG9sZGVycyA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gcGxhY2VIb2xkZXJzIDogMDtcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IFtdOy8vbmV3IFVpbnQ4QXJyYXkoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKTtcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aDtcblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChsb29rdXAuaW5kZXhPZihiNjRbaV0pIDw8IDE4KSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA8PCAxMikgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAyXSkgPDwgNikgfCBsb29rdXAuaW5kZXhPZihiNjRbaSArIDNdKTtcblx0XHRcdGFyci5wdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpO1xuXHRcdFx0YXJyLnB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOCk7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAyKSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA+PiA0KTtcblx0XHRcdGFyci5wdXNoKHRtcCAmIDB4RkYpO1xuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAxMCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAxXSkgPDwgNCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAyXSkgPj4gMik7XG5cdFx0XHRhcnIucHVzaCgodG1wID4+IDgpICYgMHhGRik7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyO1xuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoO1xuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXTtcblx0XHR9O1xuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSk7XG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApO1xuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwW3RlbXAgPj4gMl07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbKHRlbXAgPDwgNCkgJiAweDNGXTtcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFt0ZW1wID4+IDEwXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFsodGVtcCA+PiA0KSAmIDB4M0ZdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwWyh0ZW1wIDw8IDIpICYgMHgzRl07XG5cdFx0XHRcdG91dHB1dCArPSAnPSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5O1xuXHRtb2R1bGUuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NDtcbn0oKSk7XG5cbn0se31dLDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIHVuZGVmaW5lZCA9ICh2b2lkIDApOyAvLyBQYXJhbm9pYVxuXG4vLyBCZXlvbmQgdGhpcyB2YWx1ZSwgaW5kZXggZ2V0dGVycy9zZXR0ZXJzIChpLmUuIGFycmF5WzBdLCBhcnJheVsxXSkgYXJlIHNvIHNsb3cgdG9cbi8vIGNyZWF0ZSwgYW5kIGNvbnN1bWUgc28gbXVjaCBtZW1vcnksIHRoYXQgdGhlIGJyb3dzZXIgYXBwZWFycyBmcm96ZW4uXG52YXIgTUFYX0FSUkFZX0xFTkdUSCA9IDFlNTtcblxuLy8gQXBwcm94aW1hdGlvbnMgb2YgaW50ZXJuYWwgRUNNQVNjcmlwdCBjb252ZXJzaW9uIGZ1bmN0aW9uc1xudmFyIEVDTUFTY3JpcHQgPSAoZnVuY3Rpb24oKSB7XG4gIC8vIFN0YXNoIGEgY29weSBpbiBjYXNlIG90aGVyIHNjcmlwdHMgbW9kaWZ5IHRoZXNlXG4gIHZhciBvcHRzID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICAgIG9waG9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuICByZXR1cm4ge1xuICAgIC8vIENsYXNzIHJldHVybnMgaW50ZXJuYWwgW1tDbGFzc11dIHByb3BlcnR5LCB1c2VkIHRvIGF2b2lkIGNyb3NzLWZyYW1lIGluc3RhbmNlb2YgaXNzdWVzOlxuICAgIENsYXNzOiBmdW5jdGlvbih2KSB7IHJldHVybiBvcHRzLmNhbGwodikucmVwbGFjZSgvXlxcW29iamVjdCAqfFxcXSQvZywgJycpOyB9LFxuICAgIEhhc1Byb3BlcnR5OiBmdW5jdGlvbihvLCBwKSB7IHJldHVybiBwIGluIG87IH0sXG4gICAgSGFzT3duUHJvcGVydHk6IGZ1bmN0aW9uKG8sIHApIHsgcmV0dXJuIG9waG9wLmNhbGwobywgcCk7IH0sXG4gICAgSXNDYWxsYWJsZTogZnVuY3Rpb24obykgeyByZXR1cm4gdHlwZW9mIG8gPT09ICdmdW5jdGlvbic7IH0sXG4gICAgVG9JbnQzMjogZnVuY3Rpb24odikgeyByZXR1cm4gdiA+PiAwOyB9LFxuICAgIFRvVWludDMyOiBmdW5jdGlvbih2KSB7IHJldHVybiB2ID4+PiAwOyB9XG4gIH07XG59KCkpO1xuXG4vLyBTbmFwc2hvdCBpbnRyaW5zaWNzXG52YXIgTE4yID0gTWF0aC5MTjIsXG4gICAgYWJzID0gTWF0aC5hYnMsXG4gICAgZmxvb3IgPSBNYXRoLmZsb29yLFxuICAgIGxvZyA9IE1hdGgubG9nLFxuICAgIG1pbiA9IE1hdGgubWluLFxuICAgIHBvdyA9IE1hdGgucG93LFxuICAgIHJvdW5kID0gTWF0aC5yb3VuZDtcblxuLy8gRVM1OiBsb2NrIGRvd24gb2JqZWN0IHByb3BlcnRpZXNcbmZ1bmN0aW9uIGNvbmZpZ3VyZVByb3BlcnRpZXMob2JqKSB7XG4gIGlmIChnZXRPd25Qcm9wZXJ0eU5hbWVzICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgdmFyIHByb3BzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLCBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wc1tpXSwge1xuICAgICAgICB2YWx1ZTogb2JqW3Byb3BzW2ldXSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8vIGVtdWxhdGUgRVM1IGdldHRlci9zZXR0ZXIgQVBJIHVzaW5nIGxlZ2FjeSBBUElzXG4vLyBodHRwOi8vYmxvZ3MubXNkbi5jb20vYi9pZS9hcmNoaXZlLzIwMTAvMDkvMDcvdHJhbnNpdGlvbmluZy1leGlzdGluZy1jb2RlLXRvLXRoZS1lczUtZ2V0dGVyLXNldHRlci1hcGlzLmFzcHhcbi8vIChzZWNvbmQgY2xhdXNlIHRlc3RzIGZvciBPYmplY3QuZGVmaW5lUHJvcGVydHkoKSBpbiBJRTw5IHRoYXQgb25seSBzdXBwb3J0cyBleHRlbmRpbmcgRE9NIHByb3RvdHlwZXMsIGJ1dFxuLy8gbm90ZSB0aGF0IElFPDkgZG9lcyBub3Qgc3VwcG9ydCBfX2RlZmluZUdldHRlcl9fIG9yIF9fZGVmaW5lU2V0dGVyX18gc28gaXQganVzdCByZW5kZXJzIHRoZSBtZXRob2QgaGFybWxlc3MpXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgfHwgZnVuY3Rpb24obywgcCwgZGVzYykge1xuICBpZiAoIW8gPT09IE9iamVjdChvKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxsZWQgb24gbm9uLW9iamVjdFwiKTtcbiAgaWYgKEVDTUFTY3JpcHQuSGFzUHJvcGVydHkoZGVzYywgJ2dldCcpICYmIE9iamVjdC5wcm90b3R5cGUuX19kZWZpbmVHZXR0ZXJfXykgeyBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lR2V0dGVyX18uY2FsbChvLCBwLCBkZXNjLmdldCk7IH1cbiAgaWYgKEVDTUFTY3JpcHQuSGFzUHJvcGVydHkoZGVzYywgJ3NldCcpICYmIE9iamVjdC5wcm90b3R5cGUuX19kZWZpbmVTZXR0ZXJfXykgeyBPYmplY3QucHJvdG90eXBlLl9fZGVmaW5lU2V0dGVyX18uY2FsbChvLCBwLCBkZXNjLnNldCk7IH1cbiAgaWYgKEVDTUFTY3JpcHQuSGFzUHJvcGVydHkoZGVzYywgJ3ZhbHVlJykpIHsgb1twXSA9IGRlc2MudmFsdWU7IH1cbiAgcmV0dXJuIG87XG59O1xuXG52YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMobykge1xuICBpZiAobyAhPT0gT2JqZWN0KG8pKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgY2FsbGVkIG9uIG5vbi1vYmplY3RcIik7XG4gIHZhciBwcm9wcyA9IFtdLCBwO1xuICBmb3IgKHAgaW4gbykge1xuICAgIGlmIChFQ01BU2NyaXB0Lkhhc093blByb3BlcnR5KG8sIHApKSB7XG4gICAgICBwcm9wcy5wdXNoKHApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJvcHM7XG59O1xuXG4vLyBFUzU6IE1ha2Ugb2JqW2luZGV4XSBhbiBhbGlhcyBmb3Igb2JqLl9nZXR0ZXIoaW5kZXgpL29iai5fc2V0dGVyKGluZGV4LCB2YWx1ZSlcbi8vIGZvciBpbmRleCBpbiAwIC4uLiBvYmoubGVuZ3RoXG5mdW5jdGlvbiBtYWtlQXJyYXlBY2Nlc3NvcnMob2JqKSB7XG4gIGlmICghZGVmaW5lUHJvcGVydHkpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKG9iai5sZW5ndGggPiBNQVhfQVJSQVlfTEVOR1RIKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIkFycmF5IHRvbyBsYXJnZSBmb3IgcG9seWZpbGxcIik7XG5cbiAgZnVuY3Rpb24gbWFrZUFycmF5QWNjZXNzb3IoaW5kZXgpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShvYmosIGluZGV4LCB7XG4gICAgICAnZ2V0JzogZnVuY3Rpb24oKSB7IHJldHVybiBvYmouX2dldHRlcihpbmRleCk7IH0sXG4gICAgICAnc2V0JzogZnVuY3Rpb24odikgeyBvYmouX3NldHRlcihpbmRleCwgdik7IH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBtYWtlQXJyYXlBY2Nlc3NvcihpKTtcbiAgfVxufVxuXG4vLyBJbnRlcm5hbCBjb252ZXJzaW9uIGZ1bmN0aW9uczpcbi8vICAgIHBhY2s8VHlwZT4oKSAgIC0gdGFrZSBhIG51bWJlciAoaW50ZXJwcmV0ZWQgYXMgVHlwZSksIG91dHB1dCBhIGJ5dGUgYXJyYXlcbi8vICAgIHVucGFjazxUeXBlPigpIC0gdGFrZSBhIGJ5dGUgYXJyYXksIG91dHB1dCBhIFR5cGUtbGlrZSBudW1iZXJcblxuZnVuY3Rpb24gYXNfc2lnbmVkKHZhbHVlLCBiaXRzKSB7IHZhciBzID0gMzIgLSBiaXRzOyByZXR1cm4gKHZhbHVlIDw8IHMpID4+IHM7IH1cbmZ1bmN0aW9uIGFzX3Vuc2lnbmVkKHZhbHVlLCBiaXRzKSB7IHZhciBzID0gMzIgLSBiaXRzOyByZXR1cm4gKHZhbHVlIDw8IHMpID4+PiBzOyB9XG5cbmZ1bmN0aW9uIHBhY2tJOChuKSB7IHJldHVybiBbbiAmIDB4ZmZdOyB9XG5mdW5jdGlvbiB1bnBhY2tJOChieXRlcykgeyByZXR1cm4gYXNfc2lnbmVkKGJ5dGVzWzBdLCA4KTsgfVxuXG5mdW5jdGlvbiBwYWNrVTgobikgeyByZXR1cm4gW24gJiAweGZmXTsgfVxuZnVuY3Rpb24gdW5wYWNrVTgoYnl0ZXMpIHsgcmV0dXJuIGFzX3Vuc2lnbmVkKGJ5dGVzWzBdLCA4KTsgfVxuXG5mdW5jdGlvbiBwYWNrVThDbGFtcGVkKG4pIHsgbiA9IHJvdW5kKE51bWJlcihuKSk7IHJldHVybiBbbiA8IDAgPyAwIDogbiA+IDB4ZmYgPyAweGZmIDogbiAmIDB4ZmZdOyB9XG5cbmZ1bmN0aW9uIHBhY2tJMTYobikgeyByZXR1cm4gWyhuID4+IDgpICYgMHhmZiwgbiAmIDB4ZmZdOyB9XG5mdW5jdGlvbiB1bnBhY2tJMTYoYnl0ZXMpIHsgcmV0dXJuIGFzX3NpZ25lZChieXRlc1swXSA8PCA4IHwgYnl0ZXNbMV0sIDE2KTsgfVxuXG5mdW5jdGlvbiBwYWNrVTE2KG4pIHsgcmV0dXJuIFsobiA+PiA4KSAmIDB4ZmYsIG4gJiAweGZmXTsgfVxuZnVuY3Rpb24gdW5wYWNrVTE2KGJ5dGVzKSB7IHJldHVybiBhc191bnNpZ25lZChieXRlc1swXSA8PCA4IHwgYnl0ZXNbMV0sIDE2KTsgfVxuXG5mdW5jdGlvbiBwYWNrSTMyKG4pIHsgcmV0dXJuIFsobiA+PiAyNCkgJiAweGZmLCAobiA+PiAxNikgJiAweGZmLCAobiA+PiA4KSAmIDB4ZmYsIG4gJiAweGZmXTsgfVxuZnVuY3Rpb24gdW5wYWNrSTMyKGJ5dGVzKSB7IHJldHVybiBhc19zaWduZWQoYnl0ZXNbMF0gPDwgMjQgfCBieXRlc1sxXSA8PCAxNiB8IGJ5dGVzWzJdIDw8IDggfCBieXRlc1szXSwgMzIpOyB9XG5cbmZ1bmN0aW9uIHBhY2tVMzIobikgeyByZXR1cm4gWyhuID4+IDI0KSAmIDB4ZmYsIChuID4+IDE2KSAmIDB4ZmYsIChuID4+IDgpICYgMHhmZiwgbiAmIDB4ZmZdOyB9XG5mdW5jdGlvbiB1bnBhY2tVMzIoYnl0ZXMpIHsgcmV0dXJuIGFzX3Vuc2lnbmVkKGJ5dGVzWzBdIDw8IDI0IHwgYnl0ZXNbMV0gPDwgMTYgfCBieXRlc1syXSA8PCA4IHwgYnl0ZXNbM10sIDMyKTsgfVxuXG5mdW5jdGlvbiBwYWNrSUVFRTc1NCh2LCBlYml0cywgZmJpdHMpIHtcblxuICB2YXIgYmlhcyA9ICgxIDw8IChlYml0cyAtIDEpKSAtIDEsXG4gICAgICBzLCBlLCBmLCBsbixcbiAgICAgIGksIGJpdHMsIHN0ciwgYnl0ZXM7XG5cbiAgZnVuY3Rpb24gcm91bmRUb0V2ZW4obikge1xuICAgIHZhciB3ID0gZmxvb3IobiksIGYgPSBuIC0gdztcbiAgICBpZiAoZiA8IDAuNSlcbiAgICAgIHJldHVybiB3O1xuICAgIGlmIChmID4gMC41KVxuICAgICAgcmV0dXJuIHcgKyAxO1xuICAgIHJldHVybiB3ICUgMiA/IHcgKyAxIDogdztcbiAgfVxuXG4gIC8vIENvbXB1dGUgc2lnbiwgZXhwb25lbnQsIGZyYWN0aW9uXG4gIGlmICh2ICE9PSB2KSB7XG4gICAgLy8gTmFOXG4gICAgLy8gaHR0cDovL2Rldi53My5vcmcvMjAwNi93ZWJhcGkvV2ViSURMLyNlcy10eXBlLW1hcHBpbmdcbiAgICBlID0gKDEgPDwgZWJpdHMpIC0gMTsgZiA9IHBvdygyLCBmYml0cyAtIDEpOyBzID0gMDtcbiAgfSBlbHNlIGlmICh2ID09PSBJbmZpbml0eSB8fCB2ID09PSAtSW5maW5pdHkpIHtcbiAgICBlID0gKDEgPDwgZWJpdHMpIC0gMTsgZiA9IDA7IHMgPSAodiA8IDApID8gMSA6IDA7XG4gIH0gZWxzZSBpZiAodiA9PT0gMCkge1xuICAgIGUgPSAwOyBmID0gMDsgcyA9ICgxIC8gdiA9PT0gLUluZmluaXR5KSA/IDEgOiAwO1xuICB9IGVsc2Uge1xuICAgIHMgPSB2IDwgMDtcbiAgICB2ID0gYWJzKHYpO1xuXG4gICAgaWYgKHYgPj0gcG93KDIsIDEgLSBiaWFzKSkge1xuICAgICAgZSA9IG1pbihmbG9vcihsb2codikgLyBMTjIpLCAxMDIzKTtcbiAgICAgIGYgPSByb3VuZFRvRXZlbih2IC8gcG93KDIsIGUpICogcG93KDIsIGZiaXRzKSk7XG4gICAgICBpZiAoZiAvIHBvdygyLCBmYml0cykgPj0gMikge1xuICAgICAgICBlID0gZSArIDE7XG4gICAgICAgIGYgPSAxO1xuICAgICAgfVxuICAgICAgaWYgKGUgPiBiaWFzKSB7XG4gICAgICAgIC8vIE92ZXJmbG93XG4gICAgICAgIGUgPSAoMSA8PCBlYml0cykgLSAxO1xuICAgICAgICBmID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vcm1hbGl6ZWRcbiAgICAgICAgZSA9IGUgKyBiaWFzO1xuICAgICAgICBmID0gZiAtIHBvdygyLCBmYml0cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlbm9ybWFsaXplZFxuICAgICAgZSA9IDA7XG4gICAgICBmID0gcm91bmRUb0V2ZW4odiAvIHBvdygyLCAxIC0gYmlhcyAtIGZiaXRzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gUGFjayBzaWduLCBleHBvbmVudCwgZnJhY3Rpb25cbiAgYml0cyA9IFtdO1xuICBmb3IgKGkgPSBmYml0czsgaTsgaSAtPSAxKSB7IGJpdHMucHVzaChmICUgMiA/IDEgOiAwKTsgZiA9IGZsb29yKGYgLyAyKTsgfVxuICBmb3IgKGkgPSBlYml0czsgaTsgaSAtPSAxKSB7IGJpdHMucHVzaChlICUgMiA/IDEgOiAwKTsgZSA9IGZsb29yKGUgLyAyKTsgfVxuICBiaXRzLnB1c2gocyA/IDEgOiAwKTtcbiAgYml0cy5yZXZlcnNlKCk7XG4gIHN0ciA9IGJpdHMuam9pbignJyk7XG5cbiAgLy8gQml0cyB0byBieXRlc1xuICBieXRlcyA9IFtdO1xuICB3aGlsZSAoc3RyLmxlbmd0aCkge1xuICAgIGJ5dGVzLnB1c2gocGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCA4KSwgMikpO1xuICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoOCk7XG4gIH1cbiAgcmV0dXJuIGJ5dGVzO1xufVxuXG5mdW5jdGlvbiB1bnBhY2tJRUVFNzU0KGJ5dGVzLCBlYml0cywgZmJpdHMpIHtcblxuICAvLyBCeXRlcyB0byBiaXRzXG4gIHZhciBiaXRzID0gW10sIGksIGosIGIsIHN0cixcbiAgICAgIGJpYXMsIHMsIGUsIGY7XG5cbiAgZm9yIChpID0gYnl0ZXMubGVuZ3RoOyBpOyBpIC09IDEpIHtcbiAgICBiID0gYnl0ZXNbaSAtIDFdO1xuICAgIGZvciAoaiA9IDg7IGo7IGogLT0gMSkge1xuICAgICAgYml0cy5wdXNoKGIgJSAyID8gMSA6IDApOyBiID0gYiA+PiAxO1xuICAgIH1cbiAgfVxuICBiaXRzLnJldmVyc2UoKTtcbiAgc3RyID0gYml0cy5qb2luKCcnKTtcblxuICAvLyBVbnBhY2sgc2lnbiwgZXhwb25lbnQsIGZyYWN0aW9uXG4gIGJpYXMgPSAoMSA8PCAoZWJpdHMgLSAxKSkgLSAxO1xuICBzID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAxKSwgMikgPyAtMSA6IDE7XG4gIGUgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDEsIDEgKyBlYml0cyksIDIpO1xuICBmID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygxICsgZWJpdHMpLCAyKTtcblxuICAvLyBQcm9kdWNlIG51bWJlclxuICBpZiAoZSA9PT0gKDEgPDwgZWJpdHMpIC0gMSkge1xuICAgIHJldHVybiBmICE9PSAwID8gTmFOIDogcyAqIEluZmluaXR5O1xuICB9IGVsc2UgaWYgKGUgPiAwKSB7XG4gICAgLy8gTm9ybWFsaXplZFxuICAgIHJldHVybiBzICogcG93KDIsIGUgLSBiaWFzKSAqICgxICsgZiAvIHBvdygyLCBmYml0cykpO1xuICB9IGVsc2UgaWYgKGYgIT09IDApIHtcbiAgICAvLyBEZW5vcm1hbGl6ZWRcbiAgICByZXR1cm4gcyAqIHBvdygyLCAtKGJpYXMgLSAxKSkgKiAoZiAvIHBvdygyLCBmYml0cykpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzIDwgMCA/IC0wIDogMDtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnBhY2tGNjQoYikgeyByZXR1cm4gdW5wYWNrSUVFRTc1NChiLCAxMSwgNTIpOyB9XG5mdW5jdGlvbiBwYWNrRjY0KHYpIHsgcmV0dXJuIHBhY2tJRUVFNzU0KHYsIDExLCA1Mik7IH1cbmZ1bmN0aW9uIHVucGFja0YzMihiKSB7IHJldHVybiB1bnBhY2tJRUVFNzU0KGIsIDgsIDIzKTsgfVxuZnVuY3Rpb24gcGFja0YzMih2KSB7IHJldHVybiBwYWNrSUVFRTc1NCh2LCA4LCAyMyk7IH1cblxuXG4vL1xuLy8gMyBUaGUgQXJyYXlCdWZmZXIgVHlwZVxuLy9cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8qKiBAY29uc3RydWN0b3IgKi9cbiAgdmFyIEFycmF5QnVmZmVyID0gZnVuY3Rpb24gQXJyYXlCdWZmZXIobGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gRUNNQVNjcmlwdC5Ub0ludDMyKGxlbmd0aCk7XG4gICAgaWYgKGxlbmd0aCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdBcnJheUJ1ZmZlciBzaXplIGlzIG5vdCBhIHNtYWxsIGVub3VnaCBwb3NpdGl2ZSBpbnRlZ2VyJyk7XG5cbiAgICB0aGlzLmJ5dGVMZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5fYnl0ZXMgPSBbXTtcbiAgICB0aGlzLl9ieXRlcy5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5ieXRlTGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIHRoaXMuX2J5dGVzW2ldID0gMDtcbiAgICB9XG5cbiAgICBjb25maWd1cmVQcm9wZXJ0aWVzKHRoaXMpO1xuICB9O1xuXG4gIGV4cG9ydHMuQXJyYXlCdWZmZXIgPSBleHBvcnRzLkFycmF5QnVmZmVyIHx8IEFycmF5QnVmZmVyO1xuXG4gIC8vXG4gIC8vIDQgVGhlIEFycmF5QnVmZmVyVmlldyBUeXBlXG4gIC8vXG5cbiAgLy8gTk9URTogdGhpcyBjb25zdHJ1Y3RvciBpcyBub3QgZXhwb3J0ZWRcbiAgLyoqIEBjb25zdHJ1Y3RvciAqL1xuICB2YXIgQXJyYXlCdWZmZXJWaWV3ID0gZnVuY3Rpb24gQXJyYXlCdWZmZXJWaWV3KCkge1xuICAgIC8vdGhpcy5idWZmZXIgPSBudWxsO1xuICAgIC8vdGhpcy5ieXRlT2Zmc2V0ID0gMDtcbiAgICAvL3RoaXMuYnl0ZUxlbmd0aCA9IDA7XG4gIH07XG5cbiAgLy9cbiAgLy8gNSBUaGUgVHlwZWQgQXJyYXkgVmlldyBUeXBlc1xuICAvL1xuXG4gIGZ1bmN0aW9uIG1ha2VDb25zdHJ1Y3RvcihieXRlc1BlckVsZW1lbnQsIHBhY2ssIHVucGFjaykge1xuICAgIC8vIEVhY2ggVHlwZWRBcnJheSB0eXBlIHJlcXVpcmVzIGEgZGlzdGluY3QgY29uc3RydWN0b3IgaW5zdGFuY2Ugd2l0aFxuICAgIC8vIGlkZW50aWNhbCBsb2dpYywgd2hpY2ggdGhpcyBwcm9kdWNlcy5cblxuICAgIHZhciBjdG9yO1xuICAgIGN0b3IgPSBmdW5jdGlvbihidWZmZXIsIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICAgICAgdmFyIGFycmF5LCBzZXF1ZW5jZSwgaSwgcztcblxuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoIHx8IHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdudW1iZXInKSB7XG4gICAgICAgIC8vIENvbnN0cnVjdG9yKHVuc2lnbmVkIGxvbmcgbGVuZ3RoKVxuICAgICAgICB0aGlzLmxlbmd0aCA9IEVDTUFTY3JpcHQuVG9JbnQzMihhcmd1bWVudHNbMF0pO1xuICAgICAgICBpZiAobGVuZ3RoIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0FycmF5QnVmZmVyVmlldyBzaXplIGlzIG5vdCBhIHNtYWxsIGVub3VnaCBwb3NpdGl2ZSBpbnRlZ2VyJyk7XG5cbiAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gdGhpcy5sZW5ndGggKiB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLmJ5dGVMZW5ndGgpO1xuICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgPSAwO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JyAmJiBhcmd1bWVudHNbMF0uY29uc3RydWN0b3IgPT09IGN0b3IpIHtcbiAgICAgICAgLy8gQ29uc3RydWN0b3IoVHlwZWRBcnJheSBhcnJheSlcbiAgICAgICAgYXJyYXkgPSBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgdGhpcy5sZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IHRoaXMubGVuZ3RoICogdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5ieXRlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIHRoaXMuX3NldHRlcihpLCBhcnJheS5fZ2V0dGVyKGkpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAhKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8IEVDTUFTY3JpcHQuQ2xhc3MoYXJndW1lbnRzWzBdKSA9PT0gJ0FycmF5QnVmZmVyJykpIHtcbiAgICAgICAgLy8gQ29uc3RydWN0b3Ioc2VxdWVuY2U8dHlwZT4gYXJyYXkpXG4gICAgICAgIHNlcXVlbmNlID0gYXJndW1lbnRzWzBdO1xuXG4gICAgICAgIHRoaXMubGVuZ3RoID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihzZXF1ZW5jZS5sZW5ndGgpO1xuICAgICAgICB0aGlzLmJ5dGVMZW5ndGggPSB0aGlzLmxlbmd0aCAqIHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHRoaXMuYnl0ZUxlbmd0aCk7XG4gICAgICAgIHRoaXMuYnl0ZU9mZnNldCA9IDA7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBzID0gc2VxdWVuY2VbaV07XG4gICAgICAgICAgdGhpcy5fc2V0dGVyKGksIE51bWJlcihzKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgKGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8IEVDTUFTY3JpcHQuQ2xhc3MoYXJndW1lbnRzWzBdKSA9PT0gJ0FycmF5QnVmZmVyJykpIHtcbiAgICAgICAgLy8gQ29uc3RydWN0b3IoQXJyYXlCdWZmZXIgYnVmZmVyLFxuICAgICAgICAvLyAgICAgICAgICAgICBvcHRpb25hbCB1bnNpZ25lZCBsb25nIGJ5dGVPZmZzZXQsIG9wdGlvbmFsIHVuc2lnbmVkIGxvbmcgbGVuZ3RoKVxuICAgICAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcblxuICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgPSBFQ01BU2NyaXB0LlRvVWludDMyKGJ5dGVPZmZzZXQpO1xuICAgICAgICBpZiAodGhpcy5ieXRlT2Zmc2V0ID4gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiYnl0ZU9mZnNldCBvdXQgb2YgcmFuZ2VcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ieXRlT2Zmc2V0ICUgdGhpcy5CWVRFU19QRVJfRUxFTUVOVCkge1xuICAgICAgICAgIC8vIFRoZSBnaXZlbiBieXRlT2Zmc2V0IG11c3QgYmUgYSBtdWx0aXBsZSBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgIC8vIHNpemUgb2YgdGhlIHNwZWNpZmljIHR5cGUsIG90aGVyd2lzZSBhbiBleGNlcHRpb24gaXMgcmFpc2VkLlxuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiQXJyYXlCdWZmZXIgbGVuZ3RoIG1pbnVzIHRoZSBieXRlT2Zmc2V0IGlzIG5vdCBhIG11bHRpcGxlIG9mIHRoZSBlbGVtZW50IHNpemUuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCAtIHRoaXMuYnl0ZU9mZnNldDtcblxuICAgICAgICAgIGlmICh0aGlzLmJ5dGVMZW5ndGggJSB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcImxlbmd0aCBvZiBidWZmZXIgbWludXMgYnl0ZU9mZnNldCBub3QgYSBtdWx0aXBsZSBvZiB0aGUgZWxlbWVudCBzaXplXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuYnl0ZUxlbmd0aCAvIHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5sZW5ndGggPSBFQ01BU2NyaXB0LlRvVWludDMyKGxlbmd0aCk7XG4gICAgICAgICAgdGhpcy5ieXRlTGVuZ3RoID0gdGhpcy5sZW5ndGggKiB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCh0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLmJ5dGVMZW5ndGgpID4gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiYnl0ZU9mZnNldCBhbmQgbGVuZ3RoIHJlZmVyZW5jZSBhbiBhcmVhIGJleW9uZCB0aGUgZW5kIG9mIHRoZSBidWZmZXJcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmV4cGVjdGVkIGFyZ3VtZW50IHR5cGUocylcIik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBjdG9yO1xuXG4gICAgICBjb25maWd1cmVQcm9wZXJ0aWVzKHRoaXMpO1xuICAgICAgbWFrZUFycmF5QWNjZXNzb3JzKHRoaXMpO1xuICAgIH07XG5cbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBBcnJheUJ1ZmZlclZpZXcoKTtcbiAgICBjdG9yLnByb3RvdHlwZS5CWVRFU19QRVJfRUxFTUVOVCA9IGJ5dGVzUGVyRWxlbWVudDtcbiAgICBjdG9yLnByb3RvdHlwZS5fcGFjayA9IHBhY2s7XG4gICAgY3Rvci5wcm90b3R5cGUuX3VucGFjayA9IHVucGFjaztcbiAgICBjdG9yLkJZVEVTX1BFUl9FTEVNRU5UID0gYnl0ZXNQZXJFbGVtZW50O1xuXG4gICAgLy8gZ2V0dGVyIHR5cGUgKHVuc2lnbmVkIGxvbmcgaW5kZXgpO1xuICAgIGN0b3IucHJvdG90eXBlLl9nZXR0ZXIgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAxKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJOb3QgZW5vdWdoIGFyZ3VtZW50c1wiKTtcblxuICAgICAgaW5kZXggPSBFQ01BU2NyaXB0LlRvVWludDMyKGluZGV4KTtcbiAgICAgIGlmIChpbmRleCA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICB2YXIgYnl0ZXMgPSBbXSwgaSwgbztcbiAgICAgIGZvciAoaSA9IDAsIG8gPSB0aGlzLmJ5dGVPZmZzZXQgKyBpbmRleCAqIHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgICAgIGkgPCB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICAgICBpICs9IDEsIG8gKz0gMSkge1xuICAgICAgICBieXRlcy5wdXNoKHRoaXMuYnVmZmVyLl9ieXRlc1tvXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fdW5wYWNrKGJ5dGVzKTtcbiAgICB9O1xuXG4gICAgLy8gTk9OU1RBTkRBUkQ6IGNvbnZlbmllbmNlIGFsaWFzIGZvciBnZXR0ZXI6IHR5cGUgZ2V0KHVuc2lnbmVkIGxvbmcgaW5kZXgpO1xuICAgIGN0b3IucHJvdG90eXBlLmdldCA9IGN0b3IucHJvdG90eXBlLl9nZXR0ZXI7XG5cbiAgICAvLyBzZXR0ZXIgdm9pZCAodW5zaWduZWQgbG9uZyBpbmRleCwgdHlwZSB2YWx1ZSk7XG4gICAgY3Rvci5wcm90b3R5cGUuX3NldHRlciA9IGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJOb3QgZW5vdWdoIGFyZ3VtZW50c1wiKTtcblxuICAgICAgaW5kZXggPSBFQ01BU2NyaXB0LlRvVWludDMyKGluZGV4KTtcbiAgICAgIGlmIChpbmRleCA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICB2YXIgYnl0ZXMgPSB0aGlzLl9wYWNrKHZhbHVlKSwgaSwgbztcbiAgICAgIGZvciAoaSA9IDAsIG8gPSB0aGlzLmJ5dGVPZmZzZXQgKyBpbmRleCAqIHRoaXMuQllURVNfUEVSX0VMRU1FTlQ7XG4gICAgICAgICAgIGkgPCB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICAgICBpICs9IDEsIG8gKz0gMSkge1xuICAgICAgICB0aGlzLmJ1ZmZlci5fYnl0ZXNbb10gPSBieXRlc1tpXTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gdm9pZCBzZXQoVHlwZWRBcnJheSBhcnJheSwgb3B0aW9uYWwgdW5zaWduZWQgbG9uZyBvZmZzZXQpO1xuICAgIC8vIHZvaWQgc2V0KHNlcXVlbmNlPHR5cGU+IGFycmF5LCBvcHRpb25hbCB1bnNpZ25lZCBsb25nIG9mZnNldCk7XG4gICAgY3Rvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDEpIHRocm93IG5ldyBTeW50YXhFcnJvcihcIk5vdCBlbm91Z2ggYXJndW1lbnRzXCIpO1xuICAgICAgdmFyIGFycmF5LCBzZXF1ZW5jZSwgb2Zmc2V0LCBsZW4sXG4gICAgICAgICAgaSwgcywgZCxcbiAgICAgICAgICBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoLCB0bXA7XG5cbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JyAmJiBhcmd1bWVudHNbMF0uY29uc3RydWN0b3IgPT09IHRoaXMuY29uc3RydWN0b3IpIHtcbiAgICAgICAgLy8gdm9pZCBzZXQoVHlwZWRBcnJheSBhcnJheSwgb3B0aW9uYWwgdW5zaWduZWQgbG9uZyBvZmZzZXQpO1xuICAgICAgICBhcnJheSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgb2Zmc2V0ID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihhcmd1bWVudHNbMV0pO1xuXG4gICAgICAgIGlmIChvZmZzZXQgKyBhcnJheS5sZW5ndGggPiB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiT2Zmc2V0IHBsdXMgbGVuZ3RoIG9mIGFycmF5IGlzIG91dCBvZiByYW5nZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ5dGVPZmZzZXQgPSB0aGlzLmJ5dGVPZmZzZXQgKyBvZmZzZXQgKiB0aGlzLkJZVEVTX1BFUl9FTEVNRU5UO1xuICAgICAgICBieXRlTGVuZ3RoID0gYXJyYXkubGVuZ3RoICogdGhpcy5CWVRFU19QRVJfRUxFTUVOVDtcblxuICAgICAgICBpZiAoYXJyYXkuYnVmZmVyID09PSB0aGlzLmJ1ZmZlcikge1xuICAgICAgICAgIHRtcCA9IFtdO1xuICAgICAgICAgIGZvciAoaSA9IDAsIHMgPSBhcnJheS5ieXRlT2Zmc2V0OyBpIDwgYnl0ZUxlbmd0aDsgaSArPSAxLCBzICs9IDEpIHtcbiAgICAgICAgICAgIHRtcFtpXSA9IGFycmF5LmJ1ZmZlci5fYnl0ZXNbc107XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaSA9IDAsIGQgPSBieXRlT2Zmc2V0OyBpIDwgYnl0ZUxlbmd0aDsgaSArPSAxLCBkICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyLl9ieXRlc1tkXSA9IHRtcFtpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChpID0gMCwgcyA9IGFycmF5LmJ5dGVPZmZzZXQsIGQgPSBieXRlT2Zmc2V0O1xuICAgICAgICAgICAgICAgaSA8IGJ5dGVMZW5ndGg7IGkgKz0gMSwgcyArPSAxLCBkICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyLl9ieXRlc1tkXSA9IGFycmF5LmJ1ZmZlci5fYnl0ZXNbc107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnICYmIHR5cGVvZiBhcmd1bWVudHNbMF0ubGVuZ3RoICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyB2b2lkIHNldChzZXF1ZW5jZTx0eXBlPiBhcnJheSwgb3B0aW9uYWwgdW5zaWduZWQgbG9uZyBvZmZzZXQpO1xuICAgICAgICBzZXF1ZW5jZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgbGVuID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihzZXF1ZW5jZS5sZW5ndGgpO1xuICAgICAgICBvZmZzZXQgPSBFQ01BU2NyaXB0LlRvVWludDMyKGFyZ3VtZW50c1sxXSk7XG5cbiAgICAgICAgaWYgKG9mZnNldCArIGxlbiA+IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJPZmZzZXQgcGx1cyBsZW5ndGggb2YgYXJyYXkgaXMgb3V0IG9mIHJhbmdlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgcyA9IHNlcXVlbmNlW2ldO1xuICAgICAgICAgIHRoaXMuX3NldHRlcihvZmZzZXQgKyBpLCBOdW1iZXIocykpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5leHBlY3RlZCBhcmd1bWVudCB0eXBlKHMpXCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUeXBlZEFycmF5IHN1YmFycmF5KGxvbmcgYmVnaW4sIG9wdGlvbmFsIGxvbmcgZW5kKTtcbiAgICBjdG9yLnByb3RvdHlwZS5zdWJhcnJheSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIGZ1bmN0aW9uIGNsYW1wKHYsIG1pbiwgbWF4KSB7IHJldHVybiB2IDwgbWluID8gbWluIDogdiA+IG1heCA/IG1heCA6IHY7IH1cblxuICAgICAgc3RhcnQgPSBFQ01BU2NyaXB0LlRvSW50MzIoc3RhcnQpO1xuICAgICAgZW5kID0gRUNNQVNjcmlwdC5Ub0ludDMyKGVuZCk7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMSkgeyBzdGFydCA9IDA7IH1cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgeyBlbmQgPSB0aGlzLmxlbmd0aDsgfVxuXG4gICAgICBpZiAoc3RhcnQgPCAwKSB7IHN0YXJ0ID0gdGhpcy5sZW5ndGggKyBzdGFydDsgfVxuICAgICAgaWYgKGVuZCA8IDApIHsgZW5kID0gdGhpcy5sZW5ndGggKyBlbmQ7IH1cblxuICAgICAgc3RhcnQgPSBjbGFtcChzdGFydCwgMCwgdGhpcy5sZW5ndGgpO1xuICAgICAgZW5kID0gY2xhbXAoZW5kLCAwLCB0aGlzLmxlbmd0aCk7XG5cbiAgICAgIHZhciBsZW4gPSBlbmQgLSBzdGFydDtcbiAgICAgIGlmIChsZW4gPCAwKSB7XG4gICAgICAgIGxlbiA9IDA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgdGhpcy5idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCArIHN0YXJ0ICogdGhpcy5CWVRFU19QRVJfRUxFTUVOVCwgbGVuKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGN0b3I7XG4gIH1cblxuICB2YXIgSW50OEFycmF5ID0gbWFrZUNvbnN0cnVjdG9yKDEsIHBhY2tJOCwgdW5wYWNrSTgpO1xuICB2YXIgVWludDhBcnJheSA9IG1ha2VDb25zdHJ1Y3RvcigxLCBwYWNrVTgsIHVucGFja1U4KTtcbiAgdmFyIFVpbnQ4Q2xhbXBlZEFycmF5ID0gbWFrZUNvbnN0cnVjdG9yKDEsIHBhY2tVOENsYW1wZWQsIHVucGFja1U4KTtcbiAgdmFyIEludDE2QXJyYXkgPSBtYWtlQ29uc3RydWN0b3IoMiwgcGFja0kxNiwgdW5wYWNrSTE2KTtcbiAgdmFyIFVpbnQxNkFycmF5ID0gbWFrZUNvbnN0cnVjdG9yKDIsIHBhY2tVMTYsIHVucGFja1UxNik7XG4gIHZhciBJbnQzMkFycmF5ID0gbWFrZUNvbnN0cnVjdG9yKDQsIHBhY2tJMzIsIHVucGFja0kzMik7XG4gIHZhciBVaW50MzJBcnJheSA9IG1ha2VDb25zdHJ1Y3Rvcig0LCBwYWNrVTMyLCB1bnBhY2tVMzIpO1xuICB2YXIgRmxvYXQzMkFycmF5ID0gbWFrZUNvbnN0cnVjdG9yKDQsIHBhY2tGMzIsIHVucGFja0YzMik7XG4gIHZhciBGbG9hdDY0QXJyYXkgPSBtYWtlQ29uc3RydWN0b3IoOCwgcGFja0Y2NCwgdW5wYWNrRjY0KTtcblxuICBleHBvcnRzLkludDhBcnJheSA9IGV4cG9ydHMuSW50OEFycmF5IHx8IEludDhBcnJheTtcbiAgZXhwb3J0cy5VaW50OEFycmF5ID0gZXhwb3J0cy5VaW50OEFycmF5IHx8IFVpbnQ4QXJyYXk7XG4gIGV4cG9ydHMuVWludDhDbGFtcGVkQXJyYXkgPSBleHBvcnRzLlVpbnQ4Q2xhbXBlZEFycmF5IHx8IFVpbnQ4Q2xhbXBlZEFycmF5O1xuICBleHBvcnRzLkludDE2QXJyYXkgPSBleHBvcnRzLkludDE2QXJyYXkgfHwgSW50MTZBcnJheTtcbiAgZXhwb3J0cy5VaW50MTZBcnJheSA9IGV4cG9ydHMuVWludDE2QXJyYXkgfHwgVWludDE2QXJyYXk7XG4gIGV4cG9ydHMuSW50MzJBcnJheSA9IGV4cG9ydHMuSW50MzJBcnJheSB8fCBJbnQzMkFycmF5O1xuICBleHBvcnRzLlVpbnQzMkFycmF5ID0gZXhwb3J0cy5VaW50MzJBcnJheSB8fCBVaW50MzJBcnJheTtcbiAgZXhwb3J0cy5GbG9hdDMyQXJyYXkgPSBleHBvcnRzLkZsb2F0MzJBcnJheSB8fCBGbG9hdDMyQXJyYXk7XG4gIGV4cG9ydHMuRmxvYXQ2NEFycmF5ID0gZXhwb3J0cy5GbG9hdDY0QXJyYXkgfHwgRmxvYXQ2NEFycmF5O1xufSgpKTtcblxuLy9cbi8vIDYgVGhlIERhdGFWaWV3IFZpZXcgVHlwZVxuLy9cblxuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiByKGFycmF5LCBpbmRleCkge1xuICAgIHJldHVybiBFQ01BU2NyaXB0LklzQ2FsbGFibGUoYXJyYXkuZ2V0KSA/IGFycmF5LmdldChpbmRleCkgOiBhcnJheVtpbmRleF07XG4gIH1cblxuICB2YXIgSVNfQklHX0VORElBTiA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgdTE2YXJyYXkgPSBuZXcoZXhwb3J0cy5VaW50MTZBcnJheSkoWzB4MTIzNF0pLFxuICAgICAgICB1OGFycmF5ID0gbmV3KGV4cG9ydHMuVWludDhBcnJheSkodTE2YXJyYXkuYnVmZmVyKTtcbiAgICByZXR1cm4gcih1OGFycmF5LCAwKSA9PT0gMHgxMjtcbiAgfSgpKTtcblxuICAvLyBDb25zdHJ1Y3RvcihBcnJheUJ1ZmZlciBidWZmZXIsXG4gIC8vICAgICAgICAgICAgIG9wdGlvbmFsIHVuc2lnbmVkIGxvbmcgYnl0ZU9mZnNldCxcbiAgLy8gICAgICAgICAgICAgb3B0aW9uYWwgdW5zaWduZWQgbG9uZyBieXRlTGVuZ3RoKVxuICAvKiogQGNvbnN0cnVjdG9yICovXG4gIHZhciBEYXRhVmlldyA9IGZ1bmN0aW9uIERhdGFWaWV3KGJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMCk7XG4gICAgfSBlbHNlIGlmICghKGJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8IEVDTUFTY3JpcHQuQ2xhc3MoYnVmZmVyKSA9PT0gJ0FycmF5QnVmZmVyJykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJUeXBlRXJyb3JcIik7XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXIgPSBidWZmZXIgfHwgbmV3IEFycmF5QnVmZmVyKDApO1xuXG4gICAgdGhpcy5ieXRlT2Zmc2V0ID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihieXRlT2Zmc2V0KTtcbiAgICBpZiAodGhpcy5ieXRlT2Zmc2V0ID4gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJieXRlT2Zmc2V0IG91dCBvZiByYW5nZVwiKTtcbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGggLSB0aGlzLmJ5dGVPZmZzZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnl0ZUxlbmd0aCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoYnl0ZUxlbmd0aCk7XG4gICAgfVxuXG4gICAgaWYgKCh0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLmJ5dGVMZW5ndGgpID4gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJieXRlT2Zmc2V0IGFuZCBsZW5ndGggcmVmZXJlbmNlIGFuIGFyZWEgYmV5b25kIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclwiKTtcbiAgICB9XG5cbiAgICBjb25maWd1cmVQcm9wZXJ0aWVzKHRoaXMpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VHZXR0ZXIoYXJyYXlUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGJ5dGVPZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuXG4gICAgICBieXRlT2Zmc2V0ID0gRUNNQVNjcmlwdC5Ub1VpbnQzMihieXRlT2Zmc2V0KTtcblxuICAgICAgaWYgKGJ5dGVPZmZzZXQgKyBhcnJheVR5cGUuQllURVNfUEVSX0VMRU1FTlQgPiB0aGlzLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJBcnJheSBpbmRleCBvdXQgb2YgcmFuZ2VcIik7XG4gICAgICB9XG4gICAgICBieXRlT2Zmc2V0ICs9IHRoaXMuYnl0ZU9mZnNldDtcblxuICAgICAgdmFyIHVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheSh0aGlzLmJ1ZmZlciwgYnl0ZU9mZnNldCwgYXJyYXlUeXBlLkJZVEVTX1BFUl9FTEVNRU5UKSxcbiAgICAgICAgICBieXRlcyA9IFtdLCBpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGFycmF5VHlwZS5CWVRFU19QRVJfRUxFTUVOVDsgaSArPSAxKSB7XG4gICAgICAgIGJ5dGVzLnB1c2gocih1aW50OEFycmF5LCBpKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChCb29sZWFuKGxpdHRsZUVuZGlhbikgPT09IEJvb2xlYW4oSVNfQklHX0VORElBTikpIHtcbiAgICAgICAgYnl0ZXMucmV2ZXJzZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcihuZXcgYXJyYXlUeXBlKG5ldyBVaW50OEFycmF5KGJ5dGVzKS5idWZmZXIpLCAwKTtcbiAgICB9O1xuICB9XG5cbiAgRGF0YVZpZXcucHJvdG90eXBlLmdldFVpbnQ4ID0gbWFrZUdldHRlcihleHBvcnRzLlVpbnQ4QXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuZ2V0SW50OCA9IG1ha2VHZXR0ZXIoZXhwb3J0cy5JbnQ4QXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuZ2V0VWludDE2ID0gbWFrZUdldHRlcihleHBvcnRzLlVpbnQxNkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLmdldEludDE2ID0gbWFrZUdldHRlcihleHBvcnRzLkludDE2QXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuZ2V0VWludDMyID0gbWFrZUdldHRlcihleHBvcnRzLlVpbnQzMkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLmdldEludDMyID0gbWFrZUdldHRlcihleHBvcnRzLkludDMyQXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuZ2V0RmxvYXQzMiA9IG1ha2VHZXR0ZXIoZXhwb3J0cy5GbG9hdDMyQXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuZ2V0RmxvYXQ2NCA9IG1ha2VHZXR0ZXIoZXhwb3J0cy5GbG9hdDY0QXJyYXkpO1xuXG4gIGZ1bmN0aW9uIG1ha2VTZXR0ZXIoYXJyYXlUeXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGJ5dGVPZmZzZXQsIHZhbHVlLCBsaXR0bGVFbmRpYW4pIHtcblxuICAgICAgYnl0ZU9mZnNldCA9IEVDTUFTY3JpcHQuVG9VaW50MzIoYnl0ZU9mZnNldCk7XG4gICAgICBpZiAoYnl0ZU9mZnNldCArIGFycmF5VHlwZS5CWVRFU19QRVJfRUxFTUVOVCA+IHRoaXMuYnl0ZUxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIkFycmF5IGluZGV4IG91dCBvZiByYW5nZVwiKTtcbiAgICAgIH1cblxuICAgICAgLy8gR2V0IGJ5dGVzXG4gICAgICB2YXIgdHlwZUFycmF5ID0gbmV3IGFycmF5VHlwZShbdmFsdWVdKSxcbiAgICAgICAgICBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheSh0eXBlQXJyYXkuYnVmZmVyKSxcbiAgICAgICAgICBieXRlcyA9IFtdLCBpLCBieXRlVmlldztcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGFycmF5VHlwZS5CWVRFU19QRVJfRUxFTUVOVDsgaSArPSAxKSB7XG4gICAgICAgIGJ5dGVzLnB1c2gocihieXRlQXJyYXksIGkpKTtcbiAgICAgIH1cblxuICAgICAgLy8gRmxpcCBpZiBuZWNlc3NhcnlcbiAgICAgIGlmIChCb29sZWFuKGxpdHRsZUVuZGlhbikgPT09IEJvb2xlYW4oSVNfQklHX0VORElBTikpIHtcbiAgICAgICAgYnl0ZXMucmV2ZXJzZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBXcml0ZSB0aGVtXG4gICAgICBieXRlVmlldyA9IG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyLCBieXRlT2Zmc2V0LCBhcnJheVR5cGUuQllURVNfUEVSX0VMRU1FTlQpO1xuICAgICAgYnl0ZVZpZXcuc2V0KGJ5dGVzKTtcbiAgICB9O1xuICB9XG5cbiAgRGF0YVZpZXcucHJvdG90eXBlLnNldFVpbnQ4ID0gbWFrZVNldHRlcihleHBvcnRzLlVpbnQ4QXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuc2V0SW50OCA9IG1ha2VTZXR0ZXIoZXhwb3J0cy5JbnQ4QXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuc2V0VWludDE2ID0gbWFrZVNldHRlcihleHBvcnRzLlVpbnQxNkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLnNldEludDE2ID0gbWFrZVNldHRlcihleHBvcnRzLkludDE2QXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuc2V0VWludDMyID0gbWFrZVNldHRlcihleHBvcnRzLlVpbnQzMkFycmF5KTtcbiAgRGF0YVZpZXcucHJvdG90eXBlLnNldEludDMyID0gbWFrZVNldHRlcihleHBvcnRzLkludDMyQXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuc2V0RmxvYXQzMiA9IG1ha2VTZXR0ZXIoZXhwb3J0cy5GbG9hdDMyQXJyYXkpO1xuICBEYXRhVmlldy5wcm90b3R5cGUuc2V0RmxvYXQ2NCA9IG1ha2VTZXR0ZXIoZXhwb3J0cy5GbG9hdDY0QXJyYXkpO1xuXG4gIGV4cG9ydHMuRGF0YVZpZXcgPSBleHBvcnRzLkRhdGFWaWV3IHx8IERhdGFWaWV3O1xuXG59KCkpO1xuXG59LHt9XX0se30sW10pXG47O21vZHVsZS5leHBvcnRzPXJlcXVpcmUoXCJuYXRpdmUtYnVmZmVyLWJyb3dzZXJpZnlcIikuQnVmZmVyXG4iLCJ2YXIgQnVmZmVyPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfQnVmZmVyXCIpO1xuKGZ1bmN0aW9uIChnbG9iYWwsIG1vZHVsZSkge1xuXG4gIGlmICgndW5kZWZpbmVkJyA9PSB0eXBlb2YgbW9kdWxlKSB7XG4gICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfVxuICAgICAgLCBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHNcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvcnRzLlxuICAgKi9cblxuICBtb2R1bGUuZXhwb3J0cyA9IGV4cGVjdDtcbiAgZXhwZWN0LkFzc2VydGlvbiA9IEFzc2VydGlvbjtcblxuICAvKipcbiAgICogRXhwb3J0cyB2ZXJzaW9uLlxuICAgKi9cblxuICBleHBlY3QudmVyc2lvbiA9ICcwLjEuMic7XG5cbiAgLyoqXG4gICAqIFBvc3NpYmxlIGFzc2VydGlvbiBmbGFncy5cbiAgICovXG5cbiAgdmFyIGZsYWdzID0ge1xuICAgICAgbm90OiBbJ3RvJywgJ2JlJywgJ2hhdmUnLCAnaW5jbHVkZScsICdvbmx5J11cbiAgICAsIHRvOiBbJ2JlJywgJ2hhdmUnLCAnaW5jbHVkZScsICdvbmx5JywgJ25vdCddXG4gICAgLCBvbmx5OiBbJ2hhdmUnXVxuICAgICwgaGF2ZTogWydvd24nXVxuICAgICwgYmU6IFsnYW4nXVxuICB9O1xuXG4gIGZ1bmN0aW9uIGV4cGVjdCAob2JqKSB7XG4gICAgcmV0dXJuIG5ldyBBc3NlcnRpb24ob2JqKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gQXNzZXJ0aW9uIChvYmosIGZsYWcsIHBhcmVudCkge1xuICAgIHRoaXMub2JqID0gb2JqO1xuICAgIHRoaXMuZmxhZ3MgPSB7fTtcblxuICAgIGlmICh1bmRlZmluZWQgIT0gcGFyZW50KSB7XG4gICAgICB0aGlzLmZsYWdzW2ZsYWddID0gdHJ1ZTtcblxuICAgICAgZm9yICh2YXIgaSBpbiBwYXJlbnQuZmxhZ3MpIHtcbiAgICAgICAgaWYgKHBhcmVudC5mbGFncy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgIHRoaXMuZmxhZ3NbaV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyICRmbGFncyA9IGZsYWcgPyBmbGFnc1tmbGFnXSA6IGtleXMoZmxhZ3MpXG4gICAgICAsIHNlbGYgPSB0aGlzXG5cbiAgICBpZiAoJGZsYWdzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9ICRmbGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgLy8gYXZvaWQgcmVjdXJzaW9uXG4gICAgICAgIGlmICh0aGlzLmZsYWdzWyRmbGFnc1tpXV0pIGNvbnRpbnVlO1xuXG4gICAgICAgIHZhciBuYW1lID0gJGZsYWdzW2ldXG4gICAgICAgICAgLCBhc3NlcnRpb24gPSBuZXcgQXNzZXJ0aW9uKHRoaXMub2JqLCBuYW1lLCB0aGlzKVxuXG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBBc3NlcnRpb24ucHJvdG90eXBlW25hbWVdKSB7XG4gICAgICAgICAgLy8gY2xvbmUgdGhlIGZ1bmN0aW9uLCBtYWtlIHN1cmUgd2UgZG9udCB0b3VjaCB0aGUgcHJvdCByZWZlcmVuY2VcbiAgICAgICAgICB2YXIgb2xkID0gdGhpc1tuYW1lXTtcbiAgICAgICAgICB0aGlzW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG9sZC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAodmFyIGZuIGluIEFzc2VydGlvbi5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIGlmIChBc3NlcnRpb24ucHJvdG90eXBlLmhhc093blByb3BlcnR5KGZuKSAmJiBmbiAhPSBuYW1lKSB7XG4gICAgICAgICAgICAgIHRoaXNbbmFtZV1bZm5dID0gYmluZChhc3NlcnRpb25bZm5dLCBhc3NlcnRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW25hbWVdID0gYXNzZXJ0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiBhc3NlcnRpb25cbiAgICpcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYXNzZXJ0ID0gZnVuY3Rpb24gKHRydXRoLCBtc2csIGVycm9yKSB7XG4gICAgdmFyIG1zZyA9IHRoaXMuZmxhZ3Mubm90ID8gZXJyb3IgOiBtc2dcbiAgICAgICwgb2sgPSB0aGlzLmZsYWdzLm5vdCA/ICF0cnV0aCA6IHRydXRoO1xuXG4gICAgaWYgKCFvaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZy5jYWxsKHRoaXMpKTtcbiAgICB9XG5cbiAgICB0aGlzLmFuZCA9IG5ldyBBc3NlcnRpb24odGhpcy5vYmopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5XG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICEhdGhpcy5vYmpcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIHRydXRoeScgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgZmFsc3knIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCB0aGUgZnVuY3Rpb24gdGhyb3dzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFJlZ0V4cH0gY2FsbGJhY2ssIG9yIHJlZ2V4cCB0byBtYXRjaCBlcnJvciBzdHJpbmcgYWdhaW5zdFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLnRocm93RXJyb3IgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLnRocm93RXhjZXB0aW9uID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgZXhwZWN0KHRoaXMub2JqKS50by5iZS5hKCdmdW5jdGlvbicpO1xuXG4gICAgdmFyIHRocm93biA9IGZhbHNlXG4gICAgICAsIG5vdCA9IHRoaXMuZmxhZ3Mubm90XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5vYmooKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZm4pIHtcbiAgICAgICAgZm4oZSk7XG4gICAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBmbikge1xuICAgICAgICB2YXIgc3ViamVjdCA9ICdzdHJpbmcnID09IHR5cGVvZiBlID8gZSA6IGUubWVzc2FnZTtcbiAgICAgICAgaWYgKG5vdCkge1xuICAgICAgICAgIGV4cGVjdChzdWJqZWN0KS50by5ub3QubWF0Y2goZm4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cGVjdChzdWJqZWN0KS50by5tYXRjaChmbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93biA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCdvYmplY3QnID09IHR5cGVvZiBmbiAmJiBub3QpIHtcbiAgICAgIC8vIGluIHRoZSBwcmVzZW5jZSBvZiBhIG1hdGNoZXIsIGVuc3VyZSB0aGUgYG5vdGAgb25seSBhcHBsaWVzIHRvXG4gICAgICAvLyB0aGUgbWF0Y2hpbmcuXG4gICAgICB0aGlzLmZsYWdzLm5vdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBuYW1lID0gdGhpcy5vYmoubmFtZSB8fCAnZm4nO1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICB0aHJvd25cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgbmFtZSArICcgdG8gdGhyb3cgYW4gZXhjZXB0aW9uJyB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIG5hbWUgKyAnIG5vdCB0byB0aHJvdyBhbiBleGNlcHRpb24nIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGFycmF5IGlzIGVtcHR5LlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHBlY3RhdGlvbjtcblxuICAgIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgdGhpcy5vYmogJiYgbnVsbCAhPT0gdGhpcy5vYmogJiYgIWlzQXJyYXkodGhpcy5vYmopKSB7XG4gICAgICBpZiAoJ251bWJlcicgPT0gdHlwZW9mIHRoaXMub2JqLmxlbmd0aCkge1xuICAgICAgICBleHBlY3RhdGlvbiA9ICF0aGlzLm9iai5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBlY3RhdGlvbiA9ICFrZXlzKHRoaXMub2JqKS5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdGhpcy5vYmopIHtcbiAgICAgICAgZXhwZWN0KHRoaXMub2JqKS50by5iZS5hbignb2JqZWN0Jyk7XG4gICAgICB9XG5cbiAgICAgIGV4cGVjdCh0aGlzLm9iaikudG8uaGF2ZS5wcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gICAgICBleHBlY3RhdGlvbiA9ICF0aGlzLm9iai5sZW5ndGg7XG4gICAgfVxuXG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIGV4cGVjdGF0aW9uXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBlbXB0eScgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGJlIGVtcHR5JyB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBvYmogZXhhY3RseSBlcXVhbHMgYW5vdGhlci5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5iZSA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZXF1YWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIG9iaiA9PT0gdGhpcy5vYmpcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGVxdWFsICcgKyBpKG9iaikgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGVxdWFsICcgKyBpKG9iaikgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgb2JqIHNvcnRvZiBlcXVhbHMgYW5vdGhlci5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5lcWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIGV4cGVjdC5lcWwob2JqLCB0aGlzLm9iailcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIHNvcnQgb2YgZXF1YWwgJyArIGkob2JqKSB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBzb3J0IG9mIG5vdCBlcXVhbCAnICsgaShvYmopIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgd2l0aGluIHN0YXJ0IHRvIGZpbmlzaCAoaW5jbHVzaXZlKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmaW5pc2hcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS53aXRoaW4gPSBmdW5jdGlvbiAoc3RhcnQsIGZpbmlzaCkge1xuICAgIHZhciByYW5nZSA9IHN0YXJ0ICsgJy4uJyArIGZpbmlzaDtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhpcy5vYmogPj0gc3RhcnQgJiYgdGhpcy5vYmogPD0gZmluaXNoXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSB3aXRoaW4gJyArIHJhbmdlIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBiZSB3aXRoaW4gJyArIHJhbmdlIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgdHlwZW9mIC8gaW5zdGFuY2Ugb2ZcbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5hID1cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5hbiA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB0eXBlKSB7XG4gICAgICAvLyBwcm9wZXIgZW5nbGlzaCBpbiBlcnJvciBtc2dcbiAgICAgIHZhciBuID0gL15bYWVpb3VdLy50ZXN0KHR5cGUpID8gJ24nIDogJyc7XG5cbiAgICAgIC8vIHR5cGVvZiB3aXRoIHN1cHBvcnQgZm9yICdhcnJheSdcbiAgICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAgICdhcnJheScgPT0gdHlwZSA/IGlzQXJyYXkodGhpcy5vYmopIDpcbiAgICAgICAgICAgICdvYmplY3QnID09IHR5cGVcbiAgICAgICAgICAgICAgPyAnb2JqZWN0JyA9PSB0eXBlb2YgdGhpcy5vYmogJiYgbnVsbCAhPT0gdGhpcy5vYmpcbiAgICAgICAgICAgICAgOiB0eXBlID09IHR5cGVvZiB0aGlzLm9ialxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBhJyArIG4gKyAnICcgKyB0eXBlIH1cbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgbm90IHRvIGJlIGEnICsgbiArICcgJyArIHR5cGUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGluc3RhbmNlb2ZcbiAgICAgIHZhciBuYW1lID0gdHlwZS5uYW1lIHx8ICdzdXBwbGllZCBjb25zdHJ1Y3Rvcic7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB0aGlzLm9iaiBpbnN0YW5jZW9mIHR5cGVcbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgJyArIG5hbWUgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyBub3QgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgJyArIG5hbWUgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBudW1lcmljIHZhbHVlIGFib3ZlIF9uXy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5ncmVhdGVyVGhhbiA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYWJvdmUgPSBmdW5jdGlvbiAobikge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICB0aGlzLm9iaiA+IG5cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGFib3ZlICcgKyBuIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGJlbG93ICcgKyBuIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgbnVtZXJpYyB2YWx1ZSBiZWxvdyBfbl8uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUubGVzc1RoYW4gPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmJlbG93ID0gZnVuY3Rpb24gKG4pIHtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhpcy5vYmogPCBuXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBiZWxvdyAnICsgbiB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBhYm92ZSAnICsgbiB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHN0cmluZyB2YWx1ZSBtYXRjaGVzIF9yZWdleHBfLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlZ0V4cH0gcmVnZXhwXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbiAocmVnZXhwKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIHJlZ2V4cC5leGVjKHRoaXMub2JqKVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbWF0Y2ggJyArIHJlZ2V4cCB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyBub3QgdG8gbWF0Y2ggJyArIHJlZ2V4cCB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHByb3BlcnR5IFwibGVuZ3RoXCIgZXhpc3RzIGFuZCBoYXMgdmFsdWUgb2YgX25fLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gblxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgZXhwZWN0KHRoaXMub2JqKS50by5oYXZlLnByb3BlcnR5KCdsZW5ndGgnKTtcbiAgICB2YXIgbGVuID0gdGhpcy5vYmoubGVuZ3RoO1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICBuID09IGxlblxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gaGF2ZSBhIGxlbmd0aCBvZiAnICsgbiArICcgYnV0IGdvdCAnICsgbGVuIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBoYXZlIGEgbGVuZ3RoIG9mICcgKyBsZW4gfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBwcm9wZXJ0eSBfbmFtZV8gZXhpc3RzLCB3aXRoIG9wdGlvbmFsIF92YWxfLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge01peGVkfSB2YWxcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5wcm9wZXJ0eSA9IGZ1bmN0aW9uIChuYW1lLCB2YWwpIHtcbiAgICBpZiAodGhpcy5mbGFncy5vd24pIHtcbiAgICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLm9iaiwgbmFtZSlcbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gaGF2ZSBvd24gcHJvcGVydHkgJyArIGkobmFtZSkgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBvd24gcHJvcGVydHkgJyArIGkobmFtZSkgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mbGFncy5ub3QgJiYgdW5kZWZpbmVkICE9PSB2YWwpIHtcbiAgICAgIGlmICh1bmRlZmluZWQgPT09IHRoaXMub2JqW25hbWVdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihpKHRoaXMub2JqKSArICcgaGFzIG5vIHByb3BlcnR5ICcgKyBpKG5hbWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGhhc1Byb3A7XG4gICAgICB0cnkge1xuICAgICAgICBoYXNQcm9wID0gbmFtZSBpbiB0aGlzLm9ialxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBoYXNQcm9wID0gdW5kZWZpbmVkICE9PSB0aGlzLm9ialtuYW1lXVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICBoYXNQcm9wXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgYSBwcm9wZXJ0eSAnICsgaShuYW1lKSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBoYXZlIGEgcHJvcGVydHkgJyArIGkobmFtZSkgfSk7XG4gICAgfVxuXG4gICAgaWYgKHVuZGVmaW5lZCAhPT0gdmFsKSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB2YWwgPT09IHRoaXMub2JqW25hbWVdXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgYSBwcm9wZXJ0eSAnICsgaShuYW1lKVxuICAgICAgICAgICsgJyBvZiAnICsgaSh2YWwpICsgJywgYnV0IGdvdCAnICsgaSh0aGlzLm9ialtuYW1lXSkgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBhIHByb3BlcnR5ICcgKyBpKG5hbWUpXG4gICAgICAgICAgKyAnIG9mICcgKyBpKHZhbCkgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vYmogPSB0aGlzLm9ialtuYW1lXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgdGhlIGFycmF5IGNvbnRhaW5zIF9vYmpfIG9yIHN0cmluZyBjb250YWlucyBfb2JqXy5cbiAgICpcbiAgICogQHBhcmFtIHtNaXhlZH0gb2JqfHN0cmluZ1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLnN0cmluZyA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuY29udGFpbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHRoaXMub2JqKSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB+dGhpcy5vYmouaW5kZXhPZihvYmopXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGNvbnRhaW4gJyArIGkob2JqKSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBjb250YWluICcgKyBpKG9iaikgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAgIH5pbmRleE9mKHRoaXMub2JqLCBvYmopXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGNvbnRhaW4gJyArIGkob2JqKSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBjb250YWluICcgKyBpKG9iaikgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZXhhY3Qga2V5cyBvciBpbmNsdXNpb24gb2Yga2V5cyBieSB1c2luZ1xuICAgKiB0aGUgYC5vd25gIG1vZGlmaWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fFN0cmluZyAuLi59IGtleXNcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5rZXkgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoJGtleXMpIHtcbiAgICB2YXIgc3RyXG4gICAgICAsIG9rID0gdHJ1ZTtcblxuICAgICRrZXlzID0gaXNBcnJheSgka2V5cylcbiAgICAgID8gJGtleXNcbiAgICAgIDogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIGlmICghJGtleXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ2tleXMgcmVxdWlyZWQnKTtcblxuICAgIHZhciBhY3R1YWwgPSBrZXlzKHRoaXMub2JqKVxuICAgICAgLCBsZW4gPSAka2V5cy5sZW5ndGg7XG5cbiAgICAvLyBJbmNsdXNpb25cbiAgICBvayA9IGV2ZXJ5KCRrZXlzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gfmluZGV4T2YoYWN0dWFsLCBrZXkpO1xuICAgIH0pO1xuXG4gICAgLy8gU3RyaWN0XG4gICAgaWYgKCF0aGlzLmZsYWdzLm5vdCAmJiB0aGlzLmZsYWdzLm9ubHkpIHtcbiAgICAgIG9rID0gb2sgJiYgJGtleXMubGVuZ3RoID09IGFjdHVhbC5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gS2V5IHN0cmluZ1xuICAgIGlmIChsZW4gPiAxKSB7XG4gICAgICAka2V5cyA9IG1hcCgka2V5cywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gaShrZXkpO1xuICAgICAgfSk7XG4gICAgICB2YXIgbGFzdCA9ICRrZXlzLnBvcCgpO1xuICAgICAgc3RyID0gJGtleXMuam9pbignLCAnKSArICcsIGFuZCAnICsgbGFzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gaSgka2V5c1swXSk7XG4gICAgfVxuXG4gICAgLy8gRm9ybVxuICAgIHN0ciA9IChsZW4gPiAxID8gJ2tleXMgJyA6ICdrZXkgJykgKyBzdHI7XG5cbiAgICAvLyBIYXZlIC8gaW5jbHVkZVxuICAgIHN0ciA9ICghdGhpcy5mbGFncy5vbmx5ID8gJ2luY2x1ZGUgJyA6ICdvbmx5IGhhdmUgJykgKyBzdHI7XG5cbiAgICAvLyBBc3NlcnRpb25cbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgb2tcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvICcgKyBzdHIgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90ICcgKyBzdHIgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXG4gICAqIEFzc2VydCBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nIC4uLn0gY3VzdG9tIG1lc3NhZ2VcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZmFpbCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBtc2cgPSBtc2cgfHwgXCJleHBsaWNpdCBmYWlsdXJlXCI7XG4gICAgdGhpcy5hc3NlcnQoZmFsc2UsIG1zZywgbXNnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogRnVuY3Rpb24gYmluZCBpbXBsZW1lbnRhdGlvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gYmluZCAoZm4sIHNjb3BlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseShzY29wZSwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXJyYXkgZXZlcnkgY29tcGF0aWJpbGl0eVxuICAgKlxuICAgKiBAc2VlIGJpdC5seS81RnExTjJcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gZXZlcnkgKGFyciwgZm4sIHRoaXNPYmopIHtcbiAgICB2YXIgc2NvcGUgPSB0aGlzT2JqIHx8IGdsb2JhbDtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFyci5sZW5ndGg7IGkgPCBqOyArK2kpIHtcbiAgICAgIGlmICghZm4uY2FsbChzY29wZSwgYXJyW2ldLCBpLCBhcnIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFycmF5IGluZGV4T2YgY29tcGF0aWJpbGl0eS5cbiAgICpcbiAgICogQHNlZSBiaXQubHkvYTVEeGEyXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGluZGV4T2YgKGFyciwgbywgaSkge1xuICAgIGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYXJyLCBvLCBpKTtcbiAgICB9XG5cbiAgICBpZiAoYXJyLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaiA9IGFyci5sZW5ndGgsIGkgPSBpIDwgMCA/IGkgKyBqIDwgMCA/IDAgOiBpICsgaiA6IGkgfHwgMFxuICAgICAgICA7IGkgPCBqICYmIGFycltpXSAhPT0gbzsgaSsrKTtcblxuICAgIHJldHVybiBqIDw9IGkgPyAtMSA6IGk7XG4gIH07XG5cbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTA0NDEyOC9cbiAgdmFyIGdldE91dGVySFRNTCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBpZiAoJ291dGVySFRNTCcgaW4gZWxlbWVudCkgcmV0dXJuIGVsZW1lbnQub3V0ZXJIVE1MO1xuICAgIHZhciBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdfJyk7XG4gICAgdmFyIGVsZW1Qcm90byA9ICh3aW5kb3cuSFRNTEVsZW1lbnQgfHwgd2luZG93LkVsZW1lbnQpLnByb3RvdHlwZTtcbiAgICB2YXIgeG1sU2VyaWFsaXplciA9IG5ldyBYTUxTZXJpYWxpemVyKCk7XG4gICAgdmFyIGh0bWw7XG4gICAgaWYgKGRvY3VtZW50LnhtbFZlcnNpb24pIHtcbiAgICAgIHJldHVybiB4bWxTZXJpYWxpemVyLnNlcmlhbGl6ZVRvU3RyaW5nKGVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudC5jbG9uZU5vZGUoZmFsc2UpKTtcbiAgICAgIGh0bWwgPSBjb250YWluZXIuaW5uZXJIVE1MLnJlcGxhY2UoJz48JywgJz4nICsgZWxlbWVudC5pbm5lckhUTUwgKyAnPCcpO1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgYSBET00gZWxlbWVudC5cbiAgdmFyIGlzRE9NRWxlbWVudCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICBpZiAodHlwZW9mIEhUTUxFbGVtZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqZWN0ICYmXG4gICAgICAgIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICAgIG9iamVjdC5ub2RlVHlwZSA9PT0gMSAmJlxuICAgICAgICB0eXBlb2Ygb2JqZWN0Lm5vZGVOYW1lID09PSAnc3RyaW5nJztcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEluc3BlY3RzIGFuIG9iamVjdC5cbiAgICpcbiAgICogQHNlZSB0YWtlbiBmcm9tIG5vZGUuanMgYHV0aWxgIG1vZHVsZSAoY29weXJpZ2h0IEpveWVudCwgTUlUIGxpY2Vuc2UpXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBpIChvYmosIHNob3dIaWRkZW4sIGRlcHRoKSB7XG4gICAgdmFyIHNlZW4gPSBbXTtcblxuICAgIGZ1bmN0aW9uIHN0eWxpemUgKHN0cikge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0ICh2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gICAgICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gICAgICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuaW5zcGVjdCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgICAgIHZhbHVlICE9PSBleHBvcnRzICYmXG4gICAgICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICAgICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuXG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgdmFyIHNpbXBsZSA9ICdcXCcnICsganNvbi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG5cbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG5cbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgICAgIH1cbiAgICAgIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0RPTUVsZW1lbnQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBnZXRPdXRlckhUTUwodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gICAgICB2YXIgdmlzaWJsZV9rZXlzID0ga2V5cyh2YWx1ZSk7XG4gICAgICB2YXIgJGtleXMgPSBzaG93SGlkZGVuID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpIDogdmlzaWJsZV9rZXlzO1xuXG4gICAgICAvLyBGdW5jdGlvbnMgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgJGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnJyArIHZhbHVlLCAncmVnZXhwJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRGF0ZXMgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZFxuICAgICAgaWYgKGlzRGF0ZSh2YWx1ZSkgJiYgJGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBzdHlsaXplKHZhbHVlLnRvVVRDU3RyaW5nKCksICdkYXRlJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBiYXNlLCB0eXBlLCBicmFjZXM7XG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIG9iamVjdCB0eXBlXG4gICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdHlwZSA9ICdBcnJheSc7XG4gICAgICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0eXBlID0gJ09iamVjdCc7XG4gICAgICAgIGJyYWNlcyA9IFsneycsICd9J107XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgICBiYXNlID0gKGlzUmVnRXhwKHZhbHVlKSkgPyAnICcgKyB2YWx1ZSA6ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYXNlID0gJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICAgICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgYmFzZSA9ICcgJyArIHZhbHVlLnRvVVRDU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgka2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnJyArIHZhbHVlLCAncmVnZXhwJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWVuLnB1c2godmFsdWUpO1xuXG4gICAgICB2YXIgb3V0cHV0ID0gbWFwKCRrZXlzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciBuYW1lLCBzdHI7XG4gICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cEdldHRlcl9fKSB7XG4gICAgICAgICAgaWYgKHZhbHVlLl9fbG9va3VwR2V0dGVyX18oa2V5KSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlLl9fbG9va3VwU2V0dGVyX18oa2V5KSkge1xuICAgICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyID0gc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuX19sb29rdXBTZXR0ZXJfXyhrZXkpKSB7XG4gICAgICAgICAgICAgIHN0ciA9IHN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4T2YodmlzaWJsZV9rZXlzLCBrZXkpIDwgMCkge1xuICAgICAgICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICBpZiAoaW5kZXhPZihzZWVuLCB2YWx1ZVtrZXldKSA8IDApIHtcbiAgICAgICAgICAgIGlmIChyZWN1cnNlVGltZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgc3RyID0gZm9ybWF0KHZhbHVlW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyID0gZm9ybWF0KHZhbHVlW2tleV0sIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHN0ciA9IG1hcChzdHIuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHIgPSAnXFxuJyArIG1hcChzdHIuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGlmICh0eXBlID09PSAnQXJyYXknICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5hbWUgPSBqc29uLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgICAgICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgIG5hbWUgPSBzdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgICAgICAgbmFtZSA9IHN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbiAgICAgIH0pO1xuXG4gICAgICBzZWVuLnBvcCgpO1xuXG4gICAgICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICAgICAgdmFyIGxlbmd0aCA9IHJlZHVjZShvdXRwdXQsIGZ1bmN0aW9uIChwcmV2LCBjdXIpIHtcbiAgICAgICAgbnVtTGluZXNFc3QrKztcbiAgICAgICAgaWYgKGluZGV4T2YoY3VyLCAnXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICAgICAgcmV0dXJuIHByZXYgKyBjdXIubGVuZ3RoICsgMTtcbiAgICAgIH0sIDApO1xuXG4gICAgICBpZiAobGVuZ3RoID4gNTApIHtcbiAgICAgICAgb3V0cHV0ID0gYnJhY2VzWzBdICtcbiAgICAgICAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgICAgIGJyYWNlc1sxXTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0KG9iaiwgKHR5cGVvZiBkZXB0aCA9PT0gJ3VuZGVmaW5lZCcgPyAyIDogZGVwdGgpKTtcbiAgfTtcblxuICBmdW5jdGlvbiBpc0FycmF5IChhcikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXIpID09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgICB2YXIgcztcbiAgICB0cnkge1xuICAgICAgcyA9ICcnICsgcmU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiByZSBpbnN0YW5jZW9mIFJlZ0V4cCB8fCAvLyBlYXN5IGNhc2VcbiAgICAgICAgICAgLy8gZHVjay10eXBlIGZvciBjb250ZXh0LXN3aXRjaGluZyBldmFsY3ggY2FzZVxuICAgICAgICAgICB0eXBlb2YocmUpID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgIHJlLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdSZWdFeHAnICYmXG4gICAgICAgICAgIHJlLmNvbXBpbGUgJiZcbiAgICAgICAgICAgcmUudGVzdCAmJlxuICAgICAgICAgICByZS5leGVjICYmXG4gICAgICAgICAgIHMubWF0Y2goL15cXC8uKlxcL1tnaW1dezAsM30kLyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgICBpZiAoZCBpbnN0YW5jZW9mIERhdGUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBmdW5jdGlvbiBrZXlzIChvYmopIHtcbiAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopO1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gW107XG5cbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB7XG4gICAgICAgIGtleXMucHVzaChpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hcCAoYXJyLCBtYXBwZXIsIHRoYXQpIHtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLm1hcCkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChhcnIsIG1hcHBlciwgdGhhdCk7XG4gICAgfVxuXG4gICAgdmFyIG90aGVyPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpPSAwLCBuID0gYXJyLmxlbmd0aDsgaTxuOyBpKyspXG4gICAgICBpZiAoaSBpbiBhcnIpXG4gICAgICAgIG90aGVyW2ldID0gbWFwcGVyLmNhbGwodGhhdCwgYXJyW2ldLCBpLCBhcnIpO1xuXG4gICAgcmV0dXJuIG90aGVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlZHVjZSAoYXJyLCBmdW4pIHtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLnJlZHVjZSkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UuYXBwbHkoXG4gICAgICAgICAgYXJyXG4gICAgICAgICwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgbGVuID0gK3RoaXMubGVuZ3RoO1xuXG4gICAgaWYgKHR5cGVvZiBmdW4gIT09IFwiZnVuY3Rpb25cIilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcblxuICAgIC8vIG5vIHZhbHVlIHRvIHJldHVybiBpZiBubyBpbml0aWFsIHZhbHVlIGFuZCBhbiBlbXB0eSBhcnJheVxuICAgIGlmIChsZW4gPT09IDAgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcblxuICAgIHZhciBpID0gMDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICB2YXIgcnYgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGkgaW4gdGhpcykge1xuICAgICAgICAgIHJ2ID0gdGhpc1tpKytdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYXJyYXkgY29udGFpbnMgbm8gdmFsdWVzLCBubyBpbml0aWFsIHZhbHVlIHRvIHJldHVyblxuICAgICAgICBpZiAoKytpID49IGxlbilcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoaSBpbiB0aGlzKVxuICAgICAgICBydiA9IGZ1bi5jYWxsKG51bGwsIHJ2LCB0aGlzW2ldLCBpLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcnY7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZGVlcCBlcXVhbGl0eVxuICAgKlxuICAgKiBAc2VlIHRha2VuIGZyb20gbm9kZS5qcyBgYXNzZXJ0YCBtb2R1bGUgKGNvcHlyaWdodCBKb3llbnQsIE1JVCBsaWNlbnNlKVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZXhwZWN0LmVxbCA9IGZ1bmN0aW9uIGVxbCAoYWN0dWFsLCBleHBlY3RlZCkge1xuICAgIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICAgIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiBCdWZmZXJcbiAgICAgICAgJiYgQnVmZmVyLmlzQnVmZmVyKGFjdHVhbCkgJiYgQnVmZmVyLmlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgICAgaWYgKGFjdHVhbC5sZW5ndGggIT0gZXhwZWN0ZWQubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0dWFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhY3R1YWxbaV0gIT09IGV4cGVjdGVkW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAgIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gICAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBEYXRlICYmIGV4cGVjdGVkIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAgIC8vIDcuMy4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiLFxuICAgIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0dWFsICE9ICdvYmplY3QnICYmIHR5cGVvZiBleHBlY3RlZCAhPSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAgIC8vIDcuNC4gRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAgIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAgIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gICAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgXCJwcm90b3R5cGVcIiBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAgIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGwgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc0FyZ3VtZW50cyAob2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuICB9XG5cbiAgZnVuY3Rpb24gb2JqRXF1aXYgKGEsIGIpIHtcbiAgICBpZiAoaXNVbmRlZmluZWRPck51bGwoYSkgfHwgaXNVbmRlZmluZWRPck51bGwoYikpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gYW4gaWRlbnRpY2FsIFwicHJvdG90eXBlXCIgcHJvcGVydHkuXG4gICAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vfn5+SSd2ZSBtYW5hZ2VkIHRvIGJyZWFrIE9iamVjdC5rZXlzIHRocm91Z2ggc2NyZXd5IGFyZ3VtZW50cyBwYXNzaW5nLlxuICAgIC8vICAgQ29udmVydGluZyB0byBhcnJheSBzb2x2ZXMgdGhlIHByb2JsZW0uXG4gICAgaWYgKGlzQXJndW1lbnRzKGEpKSB7XG4gICAgICBpZiAoIWlzQXJndW1lbnRzKGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICAgIHJldHVybiBleHBlY3QuZXFsKGEsIGIpO1xuICAgIH1cbiAgICB0cnl7XG4gICAgICB2YXIga2EgPSBrZXlzKGEpLFxuICAgICAgICBrYiA9IGtleXMoYiksXG4gICAgICAgIGtleSwgaTtcbiAgICB9IGNhdGNoIChlKSB7Ly9oYXBwZW5zIHdoZW4gb25lIGlzIGEgc3RyaW5nIGxpdGVyYWwgYW5kIHRoZSBvdGhlciBpc24ndFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzIGhhc093blByb3BlcnR5KVxuICAgIGlmIChrYS5sZW5ndGggIT0ga2IubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gICAga2Euc29ydCgpO1xuICAgIGtiLnNvcnQoKTtcbiAgICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gICAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChrYVtpXSAhPSBrYltpXSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gICAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gICAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGtleSA9IGthW2ldO1xuICAgICAgaWYgKCFleHBlY3QuZXFsKGFba2V5XSwgYltrZXldKSlcbiAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIganNvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIEpTT04gJiYgSlNPTi5wYXJzZSAmJiBKU09OLnN0cmluZ2lmeSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwYXJzZTogbmF0aXZlSlNPTi5wYXJzZVxuICAgICAgICAsIHN0cmluZ2lmeTogbmF0aXZlSlNPTi5zdHJpbmdpZnlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgSlNPTiA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZihuKSB7XG4gICAgICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXG4gICAgICAgIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuIDogbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXRlKGQsIGtleSkge1xuICAgICAgcmV0dXJuIGlzRmluaXRlKGQudmFsdWVPZigpKSA/XG4gICAgICAgICAgZC5nZXRVVENGdWxsWWVhcigpICAgICArICctJyArXG4gICAgICAgICAgZihkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArXG4gICAgICAgICAgZihkLmdldFVUQ0RhdGUoKSkgICAgICArICdUJyArXG4gICAgICAgICAgZihkLmdldFVUQ0hvdXJzKCkpICAgICArICc6JyArXG4gICAgICAgICAgZihkLmdldFVUQ01pbnV0ZXMoKSkgICArICc6JyArXG4gICAgICAgICAgZihkLmdldFVUQ1NlY29uZHMoKSkgICArICdaJyA6IG51bGw7XG4gICAgfTtcblxuICAgIHZhciBjeCA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLFxuICAgICAgICBlc2NhcGFibGUgPSAvW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHg5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLFxuICAgICAgICBnYXAsXG4gICAgICAgIGluZGVudCxcbiAgICAgICAgbWV0YSA9IHsgICAgLy8gdGFibGUgb2YgY2hhcmFjdGVyIHN1YnN0aXR1dGlvbnNcbiAgICAgICAgICAgICdcXGInOiAnXFxcXGInLFxuICAgICAgICAgICAgJ1xcdCc6ICdcXFxcdCcsXG4gICAgICAgICAgICAnXFxuJzogJ1xcXFxuJyxcbiAgICAgICAgICAgICdcXGYnOiAnXFxcXGYnLFxuICAgICAgICAgICAgJ1xccic6ICdcXFxccicsXG4gICAgICAgICAgICAnXCInIDogJ1xcXFxcIicsXG4gICAgICAgICAgICAnXFxcXCc6ICdcXFxcXFxcXCdcbiAgICAgICAgfSxcbiAgICAgICAgcmVwO1xuXG5cbiAgICBmdW5jdGlvbiBxdW90ZShzdHJpbmcpIHtcblxuICAvLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXG4gIC8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXG4gIC8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxuICAvLyBzZXF1ZW5jZXMuXG5cbiAgICAgICAgZXNjYXBhYmxlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHJldHVybiBlc2NhcGFibGUudGVzdChzdHJpbmcpID8gJ1wiJyArIHN0cmluZy5yZXBsYWNlKGVzY2FwYWJsZSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBjID0gbWV0YVthXTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gJ3N0cmluZycgPyBjIDpcbiAgICAgICAgICAgICAgICAnXFxcXHUnICsgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfSkgKyAnXCInIDogJ1wiJyArIHN0cmluZyArICdcIic7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBzdHIoa2V5LCBob2xkZXIpIHtcblxuICAvLyBQcm9kdWNlIGEgc3RyaW5nIGZyb20gaG9sZGVyW2tleV0uXG5cbiAgICAgICAgdmFyIGksICAgICAgICAgIC8vIFRoZSBsb29wIGNvdW50ZXIuXG4gICAgICAgICAgICBrLCAgICAgICAgICAvLyBUaGUgbWVtYmVyIGtleS5cbiAgICAgICAgICAgIHYsICAgICAgICAgIC8vIFRoZSBtZW1iZXIgdmFsdWUuXG4gICAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgICBtaW5kID0gZ2FwLFxuICAgICAgICAgICAgcGFydGlhbCxcbiAgICAgICAgICAgIHZhbHVlID0gaG9sZGVyW2tleV07XG5cbiAgLy8gSWYgdGhlIHZhbHVlIGhhcyBhIHRvSlNPTiBtZXRob2QsIGNhbGwgaXQgdG8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSBkYXRlKGtleSk7XG4gICAgICAgIH1cblxuICAvLyBJZiB3ZSB3ZXJlIGNhbGxlZCB3aXRoIGEgcmVwbGFjZXIgZnVuY3Rpb24sIHRoZW4gY2FsbCB0aGUgcmVwbGFjZXIgdG9cbiAgLy8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcmVwLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gIC8vIFdoYXQgaGFwcGVucyBuZXh0IGRlcGVuZHMgb24gdGhlIHZhbHVlJ3MgdHlwZS5cblxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgcmV0dXJuIHF1b3RlKHZhbHVlKTtcblxuICAgICAgICBjYXNlICdudW1iZXInOlxuXG4gIC8vIEpTT04gbnVtYmVycyBtdXN0IGJlIGZpbml0ZS4gRW5jb2RlIG5vbi1maW5pdGUgbnVtYmVycyBhcyBudWxsLlxuXG4gICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsdWUpID8gU3RyaW5nKHZhbHVlKSA6ICdudWxsJztcblxuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgY2FzZSAnbnVsbCc6XG5cbiAgLy8gSWYgdGhlIHZhbHVlIGlzIGEgYm9vbGVhbiBvciBudWxsLCBjb252ZXJ0IGl0IHRvIGEgc3RyaW5nLiBOb3RlOlxuICAvLyB0eXBlb2YgbnVsbCBkb2VzIG5vdCBwcm9kdWNlICdudWxsJy4gVGhlIGNhc2UgaXMgaW5jbHVkZWQgaGVyZSBpblxuICAvLyB0aGUgcmVtb3RlIGNoYW5jZSB0aGF0IHRoaXMgZ2V0cyBmaXhlZCBzb21lZGF5LlxuXG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcblxuICAvLyBJZiB0aGUgdHlwZSBpcyAnb2JqZWN0Jywgd2UgbWlnaHQgYmUgZGVhbGluZyB3aXRoIGFuIG9iamVjdCBvciBhbiBhcnJheSBvclxuICAvLyBudWxsLlxuXG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG5cbiAgLy8gRHVlIHRvIGEgc3BlY2lmaWNhdGlvbiBibHVuZGVyIGluIEVDTUFTY3JpcHQsIHR5cGVvZiBudWxsIGlzICdvYmplY3QnLFxuICAvLyBzbyB3YXRjaCBvdXQgZm9yIHRoYXQgY2FzZS5cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgICAgICAgICB9XG5cbiAgLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgICAgICBnYXAgKz0gaW5kZW50O1xuICAgICAgICAgICAgcGFydGlhbCA9IFtdO1xuXG4gIC8vIElzIHRoZSB2YWx1ZSBhbiBhcnJheT9cblxuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG5cbiAgLy8gVGhlIHZhbHVlIGlzIGFuIGFycmF5LiBTdHJpbmdpZnkgZXZlcnkgZWxlbWVudC4gVXNlIG51bGwgYXMgYSBwbGFjZWhvbGRlclxuICAvLyBmb3Igbm9uLUpTT04gdmFsdWVzLlxuXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsW2ldID0gc3RyKGksIHZhbHVlKSB8fCAnbnVsbCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gIC8vIEpvaW4gYWxsIG9mIHRoZSBlbGVtZW50cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLCBhbmQgd3JhcCB0aGVtIGluXG4gIC8vIGJyYWNrZXRzLlxuXG4gICAgICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwID8gJ1tdJyA6IGdhcCA/XG4gICAgICAgICAgICAgICAgICAgICdbXFxuJyArIGdhcCArIHBhcnRpYWwuam9pbignLFxcbicgKyBnYXApICsgJ1xcbicgKyBtaW5kICsgJ10nIDpcbiAgICAgICAgICAgICAgICAgICAgJ1snICsgcGFydGlhbC5qb2luKCcsJykgKyAnXSc7XG4gICAgICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgIH1cblxuICAvLyBJZiB0aGUgcmVwbGFjZXIgaXMgYW4gYXJyYXksIHVzZSBpdCB0byBzZWxlY3QgdGhlIG1lbWJlcnMgdG8gYmUgc3RyaW5naWZpZWQuXG5cbiAgICAgICAgICAgIGlmIChyZXAgJiYgdHlwZW9mIHJlcCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByZXAubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcFtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSByZXBbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKGdhcCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gIC8vIE90aGVyd2lzZSwgaXRlcmF0ZSB0aHJvdWdoIGFsbCBvZiB0aGUga2V5cyBpbiB0aGUgb2JqZWN0LlxuXG4gICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKGdhcCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgLy8gSm9pbiBhbGwgb2YgdGhlIG1lbWJlciB0ZXh0cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLFxuICAvLyBhbmQgd3JhcCB0aGVtIGluIGJyYWNlcy5cblxuICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwID8gJ3t9JyA6IGdhcCA/XG4gICAgICAgICAgICAgICAgJ3tcXG4nICsgZ2FwICsgcGFydGlhbC5qb2luKCcsXFxuJyArIGdhcCkgKyAnXFxuJyArIG1pbmQgKyAnfScgOlxuICAgICAgICAgICAgICAgICd7JyArIHBhcnRpYWwuam9pbignLCcpICsgJ30nO1xuICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9XG4gICAgfVxuXG4gIC8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHN0cmluZ2lmeSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgSlNPTi5zdHJpbmdpZnkgPSBmdW5jdGlvbiAodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSkge1xuXG4gIC8vIFRoZSBzdHJpbmdpZnkgbWV0aG9kIHRha2VzIGEgdmFsdWUgYW5kIGFuIG9wdGlvbmFsIHJlcGxhY2VyLCBhbmQgYW4gb3B0aW9uYWxcbiAgLy8gc3BhY2UgcGFyYW1ldGVyLCBhbmQgcmV0dXJucyBhIEpTT04gdGV4dC4gVGhlIHJlcGxhY2VyIGNhbiBiZSBhIGZ1bmN0aW9uXG4gIC8vIHRoYXQgY2FuIHJlcGxhY2UgdmFsdWVzLCBvciBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgd2lsbCBzZWxlY3QgdGhlIGtleXMuXG4gIC8vIEEgZGVmYXVsdCByZXBsYWNlciBtZXRob2QgY2FuIGJlIHByb3ZpZGVkLiBVc2Ugb2YgdGhlIHNwYWNlIHBhcmFtZXRlciBjYW5cbiAgLy8gcHJvZHVjZSB0ZXh0IHRoYXQgaXMgbW9yZSBlYXNpbHkgcmVhZGFibGUuXG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGdhcCA9ICcnO1xuICAgICAgICBpbmRlbnQgPSAnJztcblxuICAvLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbnVtYmVyLCBtYWtlIGFuIGluZGVudCBzdHJpbmcgY29udGFpbmluZyB0aGF0XG4gIC8vIG1hbnkgc3BhY2VzLlxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3BhY2U7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGluZGVudCArPSAnICc7XG4gICAgICAgICAgICB9XG5cbiAgLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIHN0cmluZywgaXQgd2lsbCBiZSB1c2VkIGFzIHRoZSBpbmRlbnQgc3RyaW5nLlxuXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaW5kZW50ID0gc3BhY2U7XG4gICAgICAgIH1cblxuICAvLyBJZiB0aGVyZSBpcyBhIHJlcGxhY2VyLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXkuXG4gIC8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3IuXG5cbiAgICAgICAgcmVwID0gcmVwbGFjZXI7XG4gICAgICAgIGlmIChyZXBsYWNlciAmJiB0eXBlb2YgcmVwbGFjZXIgIT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgICAodHlwZW9mIHJlcGxhY2VyICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICAgICAgICAgIHR5cGVvZiByZXBsYWNlci5sZW5ndGggIT09ICdudW1iZXInKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdKU09OLnN0cmluZ2lmeScpO1xuICAgICAgICB9XG5cbiAgLy8gTWFrZSBhIGZha2Ugcm9vdCBvYmplY3QgY29udGFpbmluZyBvdXIgdmFsdWUgdW5kZXIgdGhlIGtleSBvZiAnJy5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHQgb2Ygc3RyaW5naWZ5aW5nIHRoZSB2YWx1ZS5cblxuICAgICAgICByZXR1cm4gc3RyKCcnLCB7Jyc6IHZhbHVlfSk7XG4gICAgfTtcblxuICAvLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBwYXJzZSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgSlNPTi5wYXJzZSA9IGZ1bmN0aW9uICh0ZXh0LCByZXZpdmVyKSB7XG4gICAgLy8gVGhlIHBhcnNlIG1ldGhvZCB0YWtlcyBhIHRleHQgYW5kIGFuIG9wdGlvbmFsIHJldml2ZXIgZnVuY3Rpb24sIGFuZCByZXR1cm5zXG4gICAgLy8gYSBKYXZhU2NyaXB0IHZhbHVlIGlmIHRoZSB0ZXh0IGlzIGEgdmFsaWQgSlNPTiB0ZXh0LlxuXG4gICAgICAgIHZhciBqO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdhbGsoaG9sZGVyLCBrZXkpIHtcblxuICAgIC8vIFRoZSB3YWxrIG1ldGhvZCBpcyB1c2VkIHRvIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIHJlc3VsdGluZyBzdHJ1Y3R1cmUgc29cbiAgICAvLyB0aGF0IG1vZGlmaWNhdGlvbnMgY2FuIGJlIG1hZGUuXG5cbiAgICAgICAgICAgIHZhciBrLCB2LCB2YWx1ZSA9IGhvbGRlcltrZXldO1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB3YWxrKHZhbHVlLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG5cbiAgICAvLyBQYXJzaW5nIGhhcHBlbnMgaW4gZm91ciBzdGFnZXMuIEluIHRoZSBmaXJzdCBzdGFnZSwgd2UgcmVwbGFjZSBjZXJ0YWluXG4gICAgLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHdpdGggZXNjYXBlIHNlcXVlbmNlcy4gSmF2YVNjcmlwdCBoYW5kbGVzIG1hbnkgY2hhcmFjdGVyc1xuICAgIC8vIGluY29ycmVjdGx5LCBlaXRoZXIgc2lsZW50bHkgZGVsZXRpbmcgdGhlbSwgb3IgdHJlYXRpbmcgdGhlbSBhcyBsaW5lIGVuZGluZ3MuXG5cbiAgICAgICAgdGV4dCA9IFN0cmluZyh0ZXh0KTtcbiAgICAgICAgY3gubGFzdEluZGV4ID0gMDtcbiAgICAgICAgaWYgKGN4LnRlc3QodGV4dCkpIHtcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoY3gsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXFxcdScgK1xuICAgICAgICAgICAgICAgICAgICAoJzAwMDAnICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIC8vIEluIHRoZSBzZWNvbmQgc3RhZ2UsIHdlIHJ1biB0aGUgdGV4dCBhZ2FpbnN0IHJlZ3VsYXIgZXhwcmVzc2lvbnMgdGhhdCBsb29rXG4gICAgLy8gZm9yIG5vbi1KU09OIHBhdHRlcm5zLiBXZSBhcmUgZXNwZWNpYWxseSBjb25jZXJuZWQgd2l0aCAnKCknIGFuZCAnbmV3J1xuICAgIC8vIGJlY2F1c2UgdGhleSBjYW4gY2F1c2UgaW52b2NhdGlvbiwgYW5kICc9JyBiZWNhdXNlIGl0IGNhbiBjYXVzZSBtdXRhdGlvbi5cbiAgICAvLyBCdXQganVzdCB0byBiZSBzYWZlLCB3ZSB3YW50IHRvIHJlamVjdCBhbGwgdW5leHBlY3RlZCBmb3Jtcy5cblxuICAgIC8vIFdlIHNwbGl0IHRoZSBzZWNvbmQgc3RhZ2UgaW50byA0IHJlZ2V4cCBvcGVyYXRpb25zIGluIG9yZGVyIHRvIHdvcmsgYXJvdW5kXG4gICAgLy8gY3JpcHBsaW5nIGluZWZmaWNpZW5jaWVzIGluIElFJ3MgYW5kIFNhZmFyaSdzIHJlZ2V4cCBlbmdpbmVzLiBGaXJzdCB3ZVxuICAgIC8vIHJlcGxhY2UgdGhlIEpTT04gYmFja3NsYXNoIHBhaXJzIHdpdGggJ0AnIChhIG5vbi1KU09OIGNoYXJhY3RlcikuIFNlY29uZCwgd2VcbiAgICAvLyByZXBsYWNlIGFsbCBzaW1wbGUgdmFsdWUgdG9rZW5zIHdpdGggJ10nIGNoYXJhY3RlcnMuIFRoaXJkLCB3ZSBkZWxldGUgYWxsXG4gICAgLy8gb3BlbiBicmFja2V0cyB0aGF0IGZvbGxvdyBhIGNvbG9uIG9yIGNvbW1hIG9yIHRoYXQgYmVnaW4gdGhlIHRleHQuIEZpbmFsbHksXG4gICAgLy8gd2UgbG9vayB0byBzZWUgdGhhdCB0aGUgcmVtYWluaW5nIGNoYXJhY3RlcnMgYXJlIG9ubHkgd2hpdGVzcGFjZSBvciAnXScgb3JcbiAgICAvLyAnLCcgb3IgJzonIG9yICd7JyBvciAnfScuIElmIHRoYXQgaXMgc28sIHRoZW4gdGhlIHRleHQgaXMgc2FmZSBmb3IgZXZhbC5cblxuICAgICAgICBpZiAoL15bXFxdLDp7fVxcc10qJC9cbiAgICAgICAgICAgICAgICAudGVzdCh0ZXh0LnJlcGxhY2UoL1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZywgJ0AnKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCJbXlwiXFxcXFxcblxccl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2csICddJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Ol58OnwsKSg/OlxccypcXFspKy9nLCAnJykpKSB7XG5cbiAgICAvLyBJbiB0aGUgdGhpcmQgc3RhZ2Ugd2UgdXNlIHRoZSBldmFsIGZ1bmN0aW9uIHRvIGNvbXBpbGUgdGhlIHRleHQgaW50byBhXG4gICAgLy8gSmF2YVNjcmlwdCBzdHJ1Y3R1cmUuIFRoZSAneycgb3BlcmF0b3IgaXMgc3ViamVjdCB0byBhIHN5bnRhY3RpYyBhbWJpZ3VpdHlcbiAgICAvLyBpbiBKYXZhU2NyaXB0OiBpdCBjYW4gYmVnaW4gYSBibG9jayBvciBhbiBvYmplY3QgbGl0ZXJhbC4gV2Ugd3JhcCB0aGUgdGV4dFxuICAgIC8vIGluIHBhcmVucyB0byBlbGltaW5hdGUgdGhlIGFtYmlndWl0eS5cblxuICAgICAgICAgICAgaiA9IGV2YWwoJygnICsgdGV4dCArICcpJyk7XG5cbiAgICAvLyBJbiB0aGUgb3B0aW9uYWwgZm91cnRoIHN0YWdlLCB3ZSByZWN1cnNpdmVseSB3YWxrIHRoZSBuZXcgc3RydWN0dXJlLCBwYXNzaW5nXG4gICAgLy8gZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gYSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZSB0cmFuc2Zvcm1hdGlvbi5cblxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByZXZpdmVyID09PSAnZnVuY3Rpb24nID9cbiAgICAgICAgICAgICAgICB3YWxrKHsnJzogan0sICcnKSA6IGo7XG4gICAgICAgIH1cblxuICAgIC8vIElmIHRoZSB0ZXh0IGlzIG5vdCBKU09OIHBhcnNlYWJsZSwgdGhlbiBhIFN5bnRheEVycm9yIGlzIHRocm93bi5cblxuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ0pTT04ucGFyc2UnKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEpTT047XG4gIH0pKCk7XG5cbiAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiB3aW5kb3cpIHtcbiAgICB3aW5kb3cuZXhwZWN0ID0gbW9kdWxlLmV4cG9ydHM7XG4gIH1cblxufSkoXG4gICAgdGhpc1xuICAsICd1bmRlZmluZWQnICE9IHR5cGVvZiBtb2R1bGUgPyBtb2R1bGUgOiB7fVxuICAsICd1bmRlZmluZWQnICE9IHR5cGVvZiBleHBvcnRzID8gZXhwb3J0cyA6IHt9XG4pO1xuIiwiLypqc2hpbnQgbWF4bGVuOmZhbHNlICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgZXhwZWN0ID0gcmVxdWlyZSgnZXhwZWN0LmpzJyk7XG52YXIgdG9nYSA9IHJlcXVpcmUoJy4uLy4uL2xpYi90b2dhJyk7XG52YXIgVG9nYSA9IHRvZ2E7XG5cbmRlc2NyaWJlKCdUb2dhJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgaWdub3JlIG5vbi1ibG9ja3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlnbm9yZSA9IFwiLy8gaWdub3JlXFxuLyogaWdub3JlICovXFxuLyohIGlnbm9yZSAqL1xcblxcbi8vXFxuLy8gaWdub3JlXFxuLy9cXG4vKlxcbiAqIGlnbm9yZVxcbiAqL1xcbi8qIVxcbiAqIGlnbm9yZVxcbiAqL1xcblxcbi8vIC8qKiBpZ25vcmVcXG52YXIgaWdub3JlID0gJy8qKiBpZ25vcmUgKi8nO1xcbnZhciBmb28gPSBmdW5jdGlvbigvKiogaWdub3JlICovKSB7fTtcXG5jb25zb2xlLmxvZyhmb28oaWdub3JlKSk7XFxuLy8gaWdub3JlICovXFxuXCI7XG5cbiAgICAgICAgZXhwZWN0KHRvZ2EoaWdub3JlKSkudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJy8vIGlnbm9yZVxcbi8qIGlnbm9yZSAqL1xcbi8qISBpZ25vcmUgKi9cXG5cXG4vL1xcbi8vIGlnbm9yZVxcbi8vXFxuLypcXG4gKiBpZ25vcmVcXG4gKi9cXG4vKiFcXG4gKiBpZ25vcmVcXG4gKi9cXG5cXG4vLyAvKiogaWdub3JlXFxudmFyIGlnbm9yZSA9IFxcJy8qKiBpZ25vcmUgKi9cXCc7XFxudmFyIGZvbyA9IGZ1bmN0aW9uKC8qKiBpZ25vcmUgKi8pIHt9O1xcbmNvbnNvbGUubG9nKGZvbyhpZ25vcmUpKTtcXG4vLyBpZ25vcmUgKi9cXG4nIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGVtcHR5IGJsb2NrcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZW1wdHkgPSBcIi8qKi9cXG4vKioqL1xcbi8qKiAqL1xcbi8qKlxcbiAqXFxuICovXFxuLyoqXFxuXFxuKi9cXG5cIjtcblxuICAgICAgICBleHBlY3QodG9nYSgpKS50by5lcWwoW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAndW5kZWZpbmVkJyB9XG4gICAgICAgIF0pO1xuXG4gICAgICAgIGV4cGVjdCh0b2dhKG51bGwpKS50by5lcWwoW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnbnVsbCcgfVxuICAgICAgICBdKTtcblxuICAgICAgICBleHBlY3QodG9nYSgnJykpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgZXhwZWN0KHRvZ2EoZW1wdHkpKS50by5lcWwoW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnLyoqL1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbXSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFtdIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW10gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbXSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBkZXNjcmlwdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRlc2MgPSBcIi8qKiBkZXNjcmlwdGlvbiAqL1xcbi8qKlxcbiAqIGRlc2NyaXB0aW9uXFxuICovXFxuLyoqXFxuZGVzY3JpcHRpb25cXG4qL1xcblwiO1xuXG4gICAgICAgIGV4cGVjdCh0b2dhKGRlc2MpKS50by5lcWwoW1xuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICdkZXNjcmlwdGlvbicsICd0YWdzJzogW10gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnZGVzY3JpcHRpb24nLCAndGFncyc6IFtdIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJ2Rlc2NyaXB0aW9uJywgJ3RhZ3MnOiBbXSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSB0YWdzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0YWcgPSBcIi8qKiBAdGFnIHtUeXBlfSAtIERlc2NyaXB0aW9uIGhlcmUuICovXFxuLyoqIEB0YWcge1R5cGV9IERlc2NyaXB0aW9uIGhlcmUuICovXFxuLyoqIEB0YWcgLSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQHRhZyBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQHRhZyAqL1xcblwiO1xuXG4gICAgICAgIGV4cGVjdCh0b2dhKHRhZykpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICd0YWcnLCAndHlwZSc6ICd7VHlwZX0nLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gaGVyZS4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICd0YWcnLCAndHlwZSc6ICd7VHlwZX0nLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gaGVyZS4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICd0YWcnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAndGFnJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ3RhZycgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgYXJncycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJnID0gXCIvKiogQGFyZyB7VHlwZX0gW25hbWVdIC0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcge1R5cGV9IFtuYW1lXSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyB7VHlwZX0gbmFtZSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIHtUeXBlfSBbbmFtZV0gKi9cXG4vKiogQGFyZyB7VHlwZX0gbmFtZSAqL1xcbi8qKiBAYXJnIFtuYW1lXSAtIERlc2NyaXB0aW9uLiAqL1xcbi8qKiBAYXJnIFtuYW1lXSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyBuYW1lIC0gRGVzY3JpcHRpb24uICovXFxuLyoqIEBhcmcgbmFtZSBEZXNjcmlwdGlvbi4gKi9cXG4vKiogQGFyZyBbbmFtZV0gKi9cXG4vKiogQGFyZyBuYW1lICovXFxuXCI7XG5cbiAgICAgICAgZXhwZWN0KHRvZ2EoYXJnKSkudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ1tuYW1lXScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICdbbmFtZV0nLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ1tuYW1lXScgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICdbbmFtZV0nLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnW25hbWVdJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLicgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi4nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICdbbmFtZV0nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICduYW1lJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSB0eXBlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdHlwZSA9IFwiLyoqIEBhcmcge1R5cGV9ICovXFxuLyoqIEBhcmcge1N0cmluZ3xPYmplY3R9ICovXFxuLyoqIEBhcmcge0FycmF5LjxPYmplY3QuPFN0cmluZyxOdW1iZXI+Pn0gKi9cXG4vKiogQGFyZyB7RnVuY3Rpb24oU3RyaW5nLCAuLi5bTnVtYmVyXSk6IE51bWJlcn0gY2FsbGJhY2sgKi9cXG5cIjtcblxuICAgICAgICBleHBlY3QodG9nYSh0eXBlKSkudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tTdHJpbmd8T2JqZWN0fScgfV0gfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tBcnJheS48T2JqZWN0LjxTdHJpbmcsTnVtYmVyPj59JyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdEb2NCbG9jaycsICdkZXNjcmlwdGlvbic6ICcnLCAndGFncyc6IFt7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne0Z1bmN0aW9uKFN0cmluZywgLi4uW051bWJlcl0pOiBOdW1iZXJ9JywgJ25hbWUnOiAnY2FsbGJhY2snIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIG5hbWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBuYW1lID0gXCIvKiogQGFyZyBuYW1lICovXFxuLyoqIEBhcmcgW25hbWVdICovXFxuLyoqIEBhcmcgW25hbWU9e31dICovXFxuLyoqIEBhcmcgW25hbWU9XFxcImhlbGxvIHdvcmxkXFxcIl0gKi9cXG5cIjtcblxuICAgICAgICBleHBlY3QodG9nYShuYW1lKSkudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJycgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnRG9jQmxvY2snLCAnZGVzY3JpcHRpb24nOiAnJywgJ3RhZ3MnOiBbeyAndGFnJzogJ2FyZycsICduYW1lJzogJ25hbWUnIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICdbbmFtZV0nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICdbbmFtZT17fV0nIH1dIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG4nIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0RvY0Jsb2NrJywgJ2Rlc2NyaXB0aW9uJzogJycsICd0YWdzJzogW3sgJ3RhZyc6ICdhcmcnLCAnbmFtZSc6ICdbbmFtZT1cImhlbGxvIHdvcmxkXCJdJyB9XSB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW5kZW50aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbmRlbnQgPSBcIi8qKlxcbiAqICMgVGl0bGVcXG4gKlxcbiAqIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAqIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAqIHR5cGUgdGhpbmdzLlxcbiAqXFxuICogTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuICpcXG4gKiAqIExpa2VcXG4gKiAqIExpc3RzXFxuICpcXG4gKiAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuICpcXG4gKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAqICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAqICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAqXFxuICogICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICpcXG4gKiBAZXhhbXBsZVxcbiAqXFxuICogICAgIHZhciBmb28gPSAnYmFyJztcXG4gKlxcbiAqIEB0YWdcXG4gKi9cXG5cXG4vKipcXG4jIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9ICdzYW1wbGVzJztcXG5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbkBleGFtcGxlXFxuXFxuICAgIHZhciBmb28gPSAnYmFyJztcXG5cXG5AdGFnXFxuICovXFxuXFxuLyoqXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICB2YXIgY29kZSA9ICdzYW1wbGVzJztcXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgdmFyIGZvbyA9ICdiYXInO1xcblxcbiAgICBAdGFnXFxuICovXFxuXFxuICAgIC8qKlxcbiAgICAgKiAjIFRpdGxlXFxuICAgICAqXFxuICAgICAqIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgKiBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgICogdHlwZSB0aGluZ3MuXFxuICAgICAqXFxuICAgICAqIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAgICAgKlxcbiAgICAgKiAqIExpa2VcXG4gICAgICogKiBMaXN0c1xcbiAgICAgKlxcbiAgICAgKiAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuICAgICAqXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgICAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgKiAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAqICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgKlxcbiAgICAgKiAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gICAgICpcXG4gICAgICogQGV4YW1wbGVcXG4gICAgICpcXG4gICAgICogICAgIHZhciBmb28gPSAnYmFyJztcXG4gICAgICpcXG4gICAgICogQHRhZ1xcbiAgICAgKi9cXG5cXG4gICAgLyoqXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICB2YXIgY29kZSA9ICdzYW1wbGVzJztcXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgdmFyIGZvbyA9ICdiYXInO1xcblxcbiAgICBAdGFnXFxuICAgICAqL1xcblxcbiAgICAvKipcXG4gICAgICAgICMgVGl0bGVcXG5cXG4gICAgICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAgICAgKiBMaWtlXFxuICAgICAgICAqIExpc3RzXFxuXFxuICAgICAgICAgICAgdmFyIGNvZGUgPSAnc2FtcGxlcyc7XFxuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgICAgIEBleGFtcGxlXFxuXFxuICAgICAgICAgICAgdmFyIGZvbyA9ICdiYXInO1xcblxcbiAgICAgICAgQHRhZ1xcbiAgICAqL1xcblwiO1xuICAgICAgICB2YXIgc3RhbmRhcmRQYXJzZXIgPSBuZXcgVG9nYSgpO1xuICAgICAgICB2YXIgdG9rZW5zID0gc3RhbmRhcmRQYXJzZXIucGFyc2UoaW5kZW50LCB7XG4gICAgICAgICAgICByYXc6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KHRva2VucykudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJycgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICB2YXIgZm9vID0gXFwnYmFyXFwnO1xcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICcvKipcXG4gKiAjIFRpdGxlXFxuICpcXG4gKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gKiBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gKiB0eXBlIHRoaW5ncy5cXG4gKlxcbiAqIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcbiAqXFxuICogKiBMaWtlXFxuICogKiBMaXN0c1xcbiAqXFxuICogICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG4gKlxcbiAqIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICpcXG4gKiAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG4gKlxcbiAqIEBleGFtcGxlXFxuICpcXG4gKiAgICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG4gKlxcbiAqIEB0YWdcXG4gKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJy8qKlxcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbkBleGFtcGxlXFxuXFxuICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuQHRhZ1xcbiAqLydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnLyoqXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICB2YXIgY29kZSA9IFxcJ3NhbXBsZXNcXCc7XFxuXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24uXFxuICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgQGV4YW1wbGVcXG5cXG4gICAgICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuICAgIEB0YWdcXG4gKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJyAgICAvKipcXG4gICAgICogIyBUaXRsZVxcbiAgICAgKlxcbiAgICAgKiBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICogbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAqIHR5cGUgdGhpbmdzLlxcbiAgICAgKlxcbiAgICAgKiBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICAgICpcXG4gICAgICogKiBMaWtlXFxuICAgICAqICogTGlzdHNcXG4gICAgICpcXG4gICAgICogICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG4gICAgICpcXG4gICAgICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICogQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAqICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgKiBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICogICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAqXFxuICAgICAqICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAgICAgKlxcbiAgICAgKiBAZXhhbXBsZVxcbiAgICAgKlxcbiAgICAgKiAgICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG4gICAgICpcXG4gICAgICogQHRhZ1xcbiAgICAgKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJyAgICAvKipcXG4gICAgIyBUaXRsZVxcblxcbiAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgIHR5cGUgdGhpbmdzLlxcblxcbiAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgKiBMaWtlXFxuICAgICogTGlzdHNcXG5cXG4gICAgICAgIHZhciBjb2RlID0gXFwnc2FtcGxlc1xcJztcXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgdmFyIGZvbyA9IFxcJ2JhclxcJztcXG5cXG4gICAgQHRhZ1xcbiAgICAgKi8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJyAgICAvKipcXG4gICAgICAgICMgVGl0bGVcXG5cXG4gICAgICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAgICAgKiBMaWtlXFxuICAgICAgICAqIExpc3RzXFxuXFxuICAgICAgICAgICAgdmFyIGNvZGUgPSBcXCdzYW1wbGVzXFwnO1xcblxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgICAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgICAgIHZhciBmb28gPSBcXCdiYXJcXCc7XFxuXFxuICAgICAgICBAdGFnXFxuICAgICovJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdXNlIGN1c3RvbSBoYW5kbGViYXJzIGdyYW1tYXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN1c3RvbSA9IFwie3shLS0tXFxuICAhICMgVGl0bGVcXG4gICFcXG4gICEgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAhIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgISB0eXBlIHRoaW5ncy5cXG4gICFcXG4gICEgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuICAhXFxuICAhICogTGlrZVxcbiAgISAqIExpc3RzXFxuICAhXFxuICAhICAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcbiAgIVxcbiAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICFcXG4gICEgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAhXFxuICAhIEBleGFtcGxlXFxuICAhXFxuICAhICAgICA8dWw+XFxuICAhICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICEgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICEgICAgICAgICB7ey9lYWNofX1cXG4gICEgICAgIDwvdWw+XFxuICAhXFxuICAhIEB0YWdcXG4gICEtLX19XFxuXFxue3shLS0tXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbkBleGFtcGxlXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcbkB0YWdcXG4tLX19XFxuXFxue3shLS0tXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICA8Y29kZT57e3NhbXBsZXN9fTwvY29kZT5cXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgPHVsPlxcbiAgICAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICAgICAge3svZWFjaH19XFxuICAgICAgICA8L3VsPlxcblxcbiAgICBAdGFnXFxuLS19fVxcblxcbiAgICB7eyEtLS1cXG4gICAgICAhICMgVGl0bGVcXG4gICAgICAhXFxuICAgICAgISBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICAhIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgICEgdHlwZSB0aGluZ3MuXFxuICAgICAgIVxcbiAgICAgICEgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuICAgICAgIVxcbiAgICAgICEgKiBMaWtlXFxuICAgICAgISAqIExpc3RzXFxuICAgICAgIVxcbiAgICAgICEgICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuICAgICAgIVxcbiAgICAgICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAhICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICAgICFcXG4gICAgICAhICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcbiAgICAgICFcXG4gICAgICAhIEBleGFtcGxlXFxuICAgICAgIVxcbiAgICAgICEgICAgIDx1bD5cXG4gICAgICAhICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAhICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgISAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICEgICAgIDwvdWw+XFxuICAgICAgIVxcbiAgICAgICEgQHRhZ1xcbiAgICAgICEtLX19XFxuXFxuICAgIHt7IS0tLVxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgPHVsPlxcbiAgICAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICAgICAge3svZWFjaH19XFxuICAgICAgICA8L3VsPlxcblxcbiAgICBAdGFnXFxuICAgIC0tfX1cXG5cXG4gICAge3shLS0tXFxuICAgICAgICAjIFRpdGxlXFxuXFxuICAgICAgICBMb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG4gICAgICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICAgICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgICAgICBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4gICAgICAgICogTGlrZVxcbiAgICAgICAgKiBMaXN0c1xcblxcbiAgICAgICAgICAgIDxjb2RlPnt7c2FtcGxlc319PC9jb2RlPlxcblxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgICAgICAgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuICAgICAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgICAgIDx1bD5cXG4gICAgICAgICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICAgICAgICAgIHt7L2VhY2h9fVxcbiAgICAgICAgICAgIDwvdWw+XFxuXFxuICAgICAgICBAdGFnXFxuICAgIC0tfX1cXG5cXG57eyEgaWdub3JlIH19XFxue3shLS0gaWdub3JlIC0tfX1cXG57eyFcXG4gICEgaWdub3JlXFxuICAhfX1cXG48IS0tIHt7IS0tLSBpZ25vcmUgLS0+XFxuPCEtLSBpZ25vcmUgfX0gLS0+XFxuXCI7XG5cbiAgICAgICAgdmFyIGhhbmRsZWJhclBhcnNlciA9IG5ldyBUb2dhKHtcbiAgICAgICAgICAgIGJsb2NrU3BsaXQ6IC8oXltcXHQgXSpcXHtcXHshLS0tKD8hLSlbXFxzXFxTXSo/XFxzKi0tXFx9XFx9KS9tLFxuICAgICAgICAgICAgYmxvY2tQYXJzZTogL15bXFx0IF0qXFx7XFx7IS0tLSg/IS0pKFtcXHNcXFNdKj8pXFxzKi0tXFx9XFx9L20sXG4gICAgICAgICAgICBpbmRlbnQ6IC9eW1xcdCAhXS9nbSxcbiAgICAgICAgICAgIG5hbWVkOiAvXihhcmcoZ3VtZW50KT98ZGF0YXxwcm9wKGVydHkpPykkL1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdG9rZW5zID0gaGFuZGxlYmFyUGFyc2VyLnBhcnNlKGN1c3RvbSwge1xuICAgICAgICAgICAgcmF3OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdCh0b2tlbnMpLnRvLmVxbChbXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICcnIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycsICdkZXNjcmlwdGlvbic6ICdcXG4nIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAne3shLS0tXFxuICAhICMgVGl0bGVcXG4gICFcXG4gICEgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAhIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgISB0eXBlIHRoaW5ncy5cXG4gICFcXG4gICEgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuICAhXFxuICAhICogTGlrZVxcbiAgISAqIExpc3RzXFxuICAhXFxuICAhICAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcbiAgIVxcbiAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICFcXG4gICEgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAhXFxuICAhIEBleGFtcGxlXFxuICAhXFxuICAhICAgICA8dWw+XFxuICAhICAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICEgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICEgICAgICAgICB7ey9lYWNofX1cXG4gICEgICAgIDwvdWw+XFxuICAhXFxuICAhIEB0YWdcXG4gICEtLX19J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcblxcbicgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdEb2NCbG9jaycsXG4gICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJyMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgPHVsPlxcbiAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAge3svZWFjaH19XFxuICAgIDwvdWw+XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJ3t7IS0tLVxcbiMgVGl0bGVcXG5cXG5Mb25nIGRlc2NyaXB0aW9uIHRoYXQgc3BhbnMgbXVsdGlwbGVcXG5saW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG50eXBlIHRoaW5ncy5cXG5cXG5MaWtlIG1vcmUgcGFyYWdyYXBocy5cXG5cXG4qIExpa2VcXG4qIExpc3RzXFxuXFxuICAgIDxjb2RlPnNhbXBsZXM8L2NvZGU+XFxuXFxuQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG5AZXhhbXBsZVxcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG5AdGFnXFxuLS19fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT57e3NhbXBsZXN9fTwvY29kZT5cXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAne3shLS0tXFxuICAgICMgVGl0bGVcXG5cXG4gICAgTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxuICAgIGxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbiAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuICAgICogTGlrZVxcbiAgICAqIExpc3RzXFxuXFxuICAgICAgICA8Y29kZT57e3NhbXBsZXN9fTwvY29kZT5cXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgPHVsPlxcbiAgICAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICAgICAge3svZWFjaH19XFxuICAgICAgICA8L3VsPlxcblxcbiAgICBAdGFnXFxuLS19fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICcjIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICA8Y29kZT5zYW1wbGVzPC9jb2RlPlxcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIDx1bD5cXG4gICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgIHt7L2VhY2h9fVxcbiAgICA8L3VsPlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycsICdkZXNjcmlwdGlvbic6ICdcXG4nIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnICAgIHt7IS0tLVxcbiAgICAgICEgIyBUaXRsZVxcbiAgICAgICFcXG4gICAgICAhIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgICEgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAgISB0eXBlIHRoaW5ncy5cXG4gICAgICAhXFxuICAgICAgISBMaWtlIG1vcmUgcGFyYWdyYXBocy5cXG4gICAgICAhXFxuICAgICAgISAqIExpa2VcXG4gICAgICAhICogTGlzdHNcXG4gICAgICAhXFxuICAgICAgISAgICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG4gICAgICAhXFxuICAgICAgISBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgICEgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgISAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAhIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICEgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuICAgICAgIVxcbiAgICAgICEgICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuICAgICAgIVxcbiAgICAgICEgQGV4YW1wbGVcXG4gICAgICAhXFxuICAgICAgISAgICAgPHVsPlxcbiAgICAgICEgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICEgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAhICAgICAgICAge3svZWFjaH19XFxuICAgICAgISAgICAgPC91bD5cXG4gICAgICAhXFxuICAgICAgISBAdGFnXFxuICAgICAgIS0tfX0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG5cXG4nLFxuICAgICAgICAgICAgICAgICd0YWdzJzogW1xuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbi5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG5cXG4gIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdleGFtcGxlJywgJ2Rlc2NyaXB0aW9uJzogJ1xcblxcbiAgICA8dWw+XFxuICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgPC91bD5cXG5cXG4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICd0YWcnIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdyYXcnOiAnICAgIHt7IS0tLVxcbiAgICAjIFRpdGxlXFxuXFxuICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICBsaW5lcyBhbmQgZXZlbiBoYXMgb3RoZXIgbWFya2Rvd25cXG4gICAgdHlwZSB0aGluZ3MuXFxuXFxuICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAqIExpa2VcXG4gICAgKiBMaXN0c1xcblxcbiAgICAgICAgPGNvZGU+c2FtcGxlczwvY29kZT5cXG5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbi5cXG4gICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbiAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uIHRoYXQgaXMgcmVhbGx5IGxvbmdcXG4gICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbiAgICBAZXhhbXBsZVxcblxcbiAgICAgICAgPHVsPlxcbiAgICAgICAgICAgIHt7I2VhY2ggaXRlbX19XFxuICAgICAgICAgICAgICAgIDxsaT57ey59fTwvbGk+XFxuICAgICAgICAgICAge3svZWFjaH19XFxuICAgICAgICA8L3VsPlxcblxcbiAgICBAdGFnXFxuICAgIC0tfX0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyAndHlwZSc6ICdDb2RlJywgJ2JvZHknOiAnXFxuXFxuJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ0RvY0Jsb2NrJyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgPGNvZGU+e3tzYW1wbGVzfX08L2NvZGU+XFxuXFxuJyxcbiAgICAgICAgICAgICAgICAndGFncyc6IFtcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24uXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnYXJnJywgJ3R5cGUnOiAne1R5cGV9JywgJ25hbWUnOiAnbmFtZScsICdkZXNjcmlwdGlvbic6ICdEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICBBbmQgaGFzIGxpbmUgYnJlYWtzLCBldGMuXFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAnZXhhbXBsZScsICdkZXNjcmlwdGlvbic6ICdcXG5cXG4gICAgPHVsPlxcbiAgICAgICAge3sjZWFjaCBpdGVtfX1cXG4gICAgICAgICAgICA8bGk+e3sufX08L2xpPlxcbiAgICAgICAge3svZWFjaH19XFxuICAgIDwvdWw+XFxuXFxuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7ICd0YWcnOiAndGFnJyB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAncmF3JzogJyAgICB7eyEtLS1cXG4gICAgICAgICMgVGl0bGVcXG5cXG4gICAgICAgIExvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbiAgICAgICAgbGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxuICAgICAgICB0eXBlIHRoaW5ncy5cXG5cXG4gICAgICAgIExpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiAgICAgICAgKiBMaWtlXFxuICAgICAgICAqIExpc3RzXFxuXFxuICAgICAgICAgICAgPGNvZGU+e3tzYW1wbGVzfX08L2NvZGU+XFxuXFxuICAgICAgICBAYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbiAgICAgICAgQGFyZyB7VHlwZX0gbmFtZSBEZXNjcmlwdGlvbiB0aGF0IGlzIHJlYWxseSBsb25nXFxuICAgICAgICAgIGFuZCB3cmFwcyB0byBvdGhlciBsaW5lcy5cXG4gICAgICAgIEBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgICAgICAgICBhbmQgd3JhcHMgdG8gb3RoZXIgbGluZXMuXFxuXFxuICAgICAgICAgIEFuZCBoYXMgbGluZSBicmVha3MsIGV0Yy5cXG5cXG4gICAgICAgIEBleGFtcGxlXFxuXFxuICAgICAgICAgICAgPHVsPlxcbiAgICAgICAgICAgICAgICB7eyNlYWNoIGl0ZW19fVxcbiAgICAgICAgICAgICAgICAgICAgPGxpPnt7Ln19PC9saT5cXG4gICAgICAgICAgICAgICAge3svZWFjaH19XFxuICAgICAgICAgICAgPC91bD5cXG5cXG4gICAgICAgIEB0YWdcXG4gICAgLS19fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7ICd0eXBlJzogJ0NvZGUnLCAnYm9keSc6ICdcXG5cXG57eyEgaWdub3JlIH19XFxue3shLS0gaWdub3JlIC0tfX1cXG57eyFcXG4gICEgaWdub3JlXFxuICAhfX1cXG48IS0tIHt7IS0tLSBpZ25vcmUgLS0+XFxuPCEtLSBpZ25vcmUgfX0gLS0+XFxuJyB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2UgY3VzdG9tIHBlcmwgZ3JhbW1hcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3VzdG9tID0gXCJ1c2Ugc3RyaWN0O1xcbnVzZSB3YXJuaW5ncztcXG5cXG5wcmludCBcXFwiaGVsbG8gd29ybGRcXFwiO1xcblxcbj1wb2RcXG5cXG4jIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICBteSAkY29kZSA9IFxcXCJzYW1wbGVzXFxcIjtcXG5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbkBleGFtcGxlXFxuXFxuICAgIG15ICRmb28gPSBcXFwiYmFyXFxcIjtcXG5cXG5AdGFnXFxuXFxuPWN1dFxcblwiO1xuXG4gICAgICAgIHZhciBwZXJsUGFyc2VyID0gbmV3IFRvZ2Eoe1xuICAgICAgICAgICAgYmxvY2tTcGxpdDogLyhePXBvZFtcXHNcXFNdKj9cXG49Y3V0JCkvbSxcbiAgICAgICAgICAgIGJsb2NrUGFyc2U6IC9ePXBvZChbXFxzXFxTXSo/KVxcbj1jdXQkL20sXG4gICAgICAgICAgICBuYW1lZDogL14oYXJnKGd1bWVudCk/fGRhdGF8cHJvcChlcnR5KT8pJC9cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHRva2VucyA9IHBlcmxQYXJzZXIucGFyc2UoY3VzdG9tLCB7XG4gICAgICAgICAgICByYXc6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KHRva2VucykudG8uZXFsKFtcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ3VzZSBzdHJpY3Q7XFxudXNlIHdhcm5pbmdzO1xcblxcbnByaW50IFwiaGVsbG8gd29ybGRcIjtcXG5cXG4nIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnRG9jQmxvY2snLFxuICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdcXG4jIFRpdGxlXFxuXFxuTG9uZyBkZXNjcmlwdGlvbiB0aGF0IHNwYW5zIG11bHRpcGxlXFxubGluZXMgYW5kIGV2ZW4gaGFzIG90aGVyIG1hcmtkb3duXFxudHlwZSB0aGluZ3MuXFxuXFxuTGlrZSBtb3JlIHBhcmFncmFwaHMuXFxuXFxuKiBMaWtlXFxuKiBMaXN0c1xcblxcbiAgICBteSAkY29kZSA9IFwic2FtcGxlc1wiO1xcblxcbicsXG4gICAgICAgICAgICAgICAgJ3RhZ3MnOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ3RhZyc6ICdhcmcnLCAndHlwZSc6ICd7VHlwZX0nLCAnbmFtZSc6ICduYW1lJywgJ2Rlc2NyaXB0aW9uJzogJ0Rlc2NyaXB0aW9uLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2FyZycsICd0eXBlJzogJ3tUeXBlfScsICduYW1lJzogJ25hbWUnLCAnZGVzY3JpcHRpb24nOiAnRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ2V4YW1wbGUnLCAnZGVzY3JpcHRpb24nOiAnXFxuXFxuICAgIG15ICRmb28gPSBcImJhclwiO1xcblxcbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyAndGFnJzogJ3RhZycgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3Jhdyc6ICc9cG9kXFxuXFxuIyBUaXRsZVxcblxcbkxvbmcgZGVzY3JpcHRpb24gdGhhdCBzcGFucyBtdWx0aXBsZVxcbmxpbmVzIGFuZCBldmVuIGhhcyBvdGhlciBtYXJrZG93blxcbnR5cGUgdGhpbmdzLlxcblxcbkxpa2UgbW9yZSBwYXJhZ3JhcGhzLlxcblxcbiogTGlrZVxcbiogTGlzdHNcXG5cXG4gICAgbXkgJGNvZGUgPSBcInNhbXBsZXNcIjtcXG5cXG5AYXJnIHtUeXBlfSBuYW1lIERlc2NyaXB0aW9uLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcbkBhcmcge1R5cGV9IG5hbWUgRGVzY3JpcHRpb24gdGhhdCBpcyByZWFsbHkgbG9uZ1xcbiAgYW5kIHdyYXBzIHRvIG90aGVyIGxpbmVzLlxcblxcbiAgQW5kIGhhcyBsaW5lIGJyZWFrcywgZXRjLlxcblxcbkBleGFtcGxlXFxuXFxuICAgIG15ICRmb28gPSBcImJhclwiO1xcblxcbkB0YWdcXG5cXG49Y3V0J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgJ3R5cGUnOiAnQ29kZScsICdib2R5JzogJ1xcbicgfVxuICAgICAgICBdKTtcbiAgICB9KTtcbn0pO1xuIl19
