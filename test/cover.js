(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/lib/tunic.js\"" + " " + "[[0,13],[27,55],[27,55],[15,56],[147,218],[147,218],[130,219],[315,655],[315,655],[294,656],[728,746],[728,746],[707,747],[1324,1340],[1324,1346],[1350,1362],[1350,1375],[1324,1375],[1324,1384],[1396,1411],[1396,1412],[1421,1438],[1421,1439],[1522,1526],[1522,1543],[1520,1544],[1563,1581],[1563,1594],[1627,1631],[1648,1650],[1627,1676],[1627,1677],[1682,1686],[1703,1705],[1682,1722],[1682,1723],[1752,1756],[1765,1769],[1765,1775],[1781,1785],[1752,1786],[1752,1787],[1792,1796],[1810,1814],[1810,1825],[1831,1835],[1792,1836],[1792,1837],[1842,1846],[1859,1863],[1859,1873],[1879,1883],[1842,1884],[1842,1885],[1890,1894],[1911,1915],[1911,1929],[1935,1939],[1890,1940],[1890,1941],[1946,1950],[1962,1966],[1962,1975],[1981,1985],[1946,1986],[1946,1987],[2003,2018],[2003,2018],[1991,2019],[2169,2185],[2169,2191],[2203,2207],[2224,2226],[2203,2252],[2203,2253],[2272,2285],[2301,2305],[2301,2313],[2272,2325],[2339,2343],[2272,2355],[2120,2358],[2120,2359],[2483,2487],[2483,2495],[2483,2506],[2483,2518],[2537,2541],[2537,2562],[2582,2586],[2582,2603],[2438,2606],[2438,2607],[2770,2783],[2732,2789],[2685,2792],[2685,2793],[2919,2940],[2919,2941],[2958,2962],[2958,2996],[3012,3016],[3012,3024],[2958,3034],[2958,3034],[2947,3035],[3102,3114],[3139,3143],[3130,3153],[3053,3159],[3053,3159],[3041,3160],[3170,3174],[3170,3182],[3170,3186],[3198,3215],[3198,3216],[2875,3243],[2875,3244],[3390,3394],[3390,3402],[3390,3402],[3376,3403],[3455,3473],[3455,3473],[3438,3474],[3488,3501],[3488,3536],[3480,3574],[3480,3575],[3605,3620],[3625,3643],[3661,3675],[3661,3675],[3648,3676],[3693,3720],[3693,3727],[3693,3727],[3681,3728],[3741,3750],[3776,3805],[3809,3811],[3776,3811],[3762,3819],[3762,3820],[3846,3865],[3869,3871],[3846,3871],[3829,3879],[3829,3880],[3912,3938],[3912,3948],[3894,3949],[4012,4045],[4012,4046],[3328,4155],[3328,4156],[4286,4290],[4286,4298],[4286,4298],[4272,4299],[4316,4329],[4316,4353],[4316,4353],[4304,4354],[4369,4377],[4369,4377],[4359,4378],[4394,4402],[4394,4402],[4383,4403],[4419,4427],[4419,4433],[4419,4433],[4408,4434],[4457,4465],[4457,4471],[4457,4471],[4439,4472],[4489,4491],[4489,4491],[4477,4492],[4529,4542],[4529,4552],[4528,4552],[4568,4587],[4617,4627],[4603,4641],[4603,4642],[4682,4700],[4682,4701],[4721,4737],[4721,4738],[4795,4810],[4795,4811],[4843,4860],[4843,4861],[4893,4910],[4893,4911],[4950,4981],[4950,4982],[4233,5009],[4233,5010],[5012,5034],[5012,5035]]");var __coverage = {"0":[0,13],"1":[27,55],"2":[27,55],"3":[15,56],"4":[147,218],"5":[147,218],"6":[130,219],"7":[315,655],"8":[315,655],"9":[294,656],"10":[728,746],"11":[728,746],"12":[707,747],"13":[1324,1340],"14":[1324,1346],"15":[1350,1362],"16":[1350,1375],"17":[1324,1375],"18":[1324,1384],"19":[1396,1411],"20":[1396,1412],"21":[1421,1438],"22":[1421,1439],"23":[1522,1526],"24":[1522,1543],"25":[1520,1544],"26":[1563,1581],"27":[1563,1594],"28":[1627,1631],"29":[1648,1650],"30":[1627,1676],"31":[1627,1677],"32":[1682,1686],"33":[1703,1705],"34":[1682,1722],"35":[1682,1723],"36":[1752,1756],"37":[1765,1769],"38":[1765,1775],"39":[1781,1785],"40":[1752,1786],"41":[1752,1787],"42":[1792,1796],"43":[1810,1814],"44":[1810,1825],"45":[1831,1835],"46":[1792,1836],"47":[1792,1837],"48":[1842,1846],"49":[1859,1863],"50":[1859,1873],"51":[1879,1883],"52":[1842,1884],"53":[1842,1885],"54":[1890,1894],"55":[1911,1915],"56":[1911,1929],"57":[1935,1939],"58":[1890,1940],"59":[1890,1941],"60":[1946,1950],"61":[1962,1966],"62":[1962,1975],"63":[1981,1985],"64":[1946,1986],"65":[1946,1987],"66":[2003,2018],"67":[2003,2018],"68":[1991,2019],"69":[2169,2185],"70":[2169,2191],"71":[2203,2207],"72":[2224,2226],"73":[2203,2252],"74":[2203,2253],"75":[2272,2285],"76":[2301,2305],"77":[2301,2313],"78":[2272,2325],"79":[2339,2343],"80":[2272,2355],"81":[2120,2358],"82":[2120,2359],"83":[2483,2487],"84":[2483,2495],"85":[2483,2506],"86":[2483,2518],"87":[2537,2541],"88":[2537,2562],"89":[2582,2586],"90":[2582,2603],"91":[2438,2606],"92":[2438,2607],"93":[2770,2783],"94":[2732,2789],"95":[2685,2792],"96":[2685,2793],"97":[2919,2940],"98":[2919,2941],"99":[2958,2962],"100":[2958,2996],"101":[3012,3016],"102":[3012,3024],"103":[2958,3034],"104":[2958,3034],"105":[2947,3035],"106":[3102,3114],"107":[3139,3143],"108":[3130,3153],"109":[3053,3159],"110":[3053,3159],"111":[3041,3160],"112":[3170,3174],"113":[3170,3182],"114":[3170,3186],"115":[3198,3215],"116":[3198,3216],"117":[2875,3243],"118":[2875,3244],"119":[3390,3394],"120":[3390,3402],"121":[3390,3402],"122":[3376,3403],"123":[3455,3473],"124":[3455,3473],"125":[3438,3474],"126":[3488,3501],"127":[3488,3536],"128":[3480,3574],"129":[3480,3575],"130":[3605,3620],"131":[3625,3643],"132":[3661,3675],"133":[3661,3675],"134":[3648,3676],"135":[3693,3720],"136":[3693,3727],"137":[3693,3727],"138":[3681,3728],"139":[3741,3750],"140":[3776,3805],"141":[3809,3811],"142":[3776,3811],"143":[3762,3819],"144":[3762,3820],"145":[3846,3865],"146":[3869,3871],"147":[3846,3871],"148":[3829,3879],"149":[3829,3880],"150":[3912,3938],"151":[3912,3948],"152":[3894,3949],"153":[4012,4045],"154":[4012,4046],"155":[3328,4155],"156":[3328,4156],"157":[4286,4290],"158":[4286,4298],"159":[4286,4298],"160":[4272,4299],"161":[4316,4329],"162":[4316,4353],"163":[4316,4353],"164":[4304,4354],"165":[4369,4377],"166":[4369,4377],"167":[4359,4378],"168":[4394,4402],"169":[4394,4402],"170":[4383,4403],"171":[4419,4427],"172":[4419,4433],"173":[4419,4433],"174":[4408,4434],"175":[4457,4465],"176":[4457,4471],"177":[4457,4471],"178":[4439,4472],"179":[4489,4491],"180":[4489,4491],"181":[4477,4492],"182":[4529,4542],"183":[4529,4552],"184":[4528,4552],"185":[4568,4587],"186":[4617,4627],"187":[4603,4641],"188":[4603,4642],"189":[4682,4700],"190":[4682,4701],"191":[4721,4737],"192":[4721,4738],"193":[4795,4810],"194":[4795,4811],"195":[4843,4860],"196":[4843,4861],"197":[4893,4910],"198":[4893,4911],"199":[4950,4981],"200":[4950,4982],"201":[4233,5009],"202":[4233,5010],"203":[5012,5034],"204":[5012,5035]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/lib/tunic.js\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var mixIn = __coverageWrap(2,__coverageWrap(1,require('mout/object/mixIn')));};

/**
 * Line matching patterns.
 *
 * @type {Object.<String,RegExp>}
 */
{ __coverageWrap(6);var matchLines = __coverageWrap(5,__coverageWrap(4,{
    any: /^/gm,
    empty: /^$/gm,
    edge: /^[\t ]*\n|\n[\t ]*$/g
}));};

/**
 * Default C-style grammar.
 *
 * @type {Object.<String,RegExp>}
 */
{ __coverageWrap(9);var defaultGrammar = __coverageWrap(8,__coverageWrap(7,{
    blockSplit: /(^[\t ]*\/\*\*(?!\/)[\s\S]*?\s*\*\/)/m,
    blockParse: /^[\t ]*\/\*\*(?!\/)([\s\S]*?)\s*\*\//m,
    indent: /^[\t \*]/gm,
    tagSplit: /^[\t ]*@/m,
    tagParse: /^(\w+)[\t \-]*(\{[^\}]+\})?[\t \-]*(\[[^\]]*\]\*?|\S*)?[\t \-]*([\s\S]+)?$/m,
    named: /^(arg(ument)?|augments|class|extends|method|param|prop(erty)?)$/
}));};

/**
 * Default options.
 *
 * @type {Object}
 */
{ __coverageWrap(12);var defaultOptions = __coverageWrap(11,__coverageWrap(10,{
    raw: false
}));};

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
    if (__coverageWrap(18,__coverageWrap(17,__coverageWrap(14,__coverageWrap(13,arguments.length) === 1) && __coverageWrap(16,__coverageWrap(15,typeof block) === 'object')) && block)) {
        { __coverageWrap(20);__coverageWrap(19,grammar = block);};
        { __coverageWrap(22);__coverageWrap(21,block = undefined);};
    }

    /** Support functional execution: `tunic(block, grammar)` */
    if (__coverageWrap(25,!(__coverageWrap(24,__coverageWrap(23,this) instanceof Tunic)))) {
        return __coverageWrap(27,__coverageWrap(26,new Tunic(grammar)).parse(block));
    }

    // Set defaults
    { __coverageWrap(31);__coverageWrap(30,__coverageWrap(28,this).grammar = mixIn(__coverageWrap(29,{}), defaultGrammar, grammar));};
    { __coverageWrap(35);__coverageWrap(34,__coverageWrap(32,this).options = mixIn(__coverageWrap(33,{}), defaultOptions));};

    // Enforce context
    { __coverageWrap(41);__coverageWrap(40,__coverageWrap(36,this).parse = __coverageWrap(38,__coverageWrap(37,this).parse).bind(__coverageWrap(39,this)));};
    { __coverageWrap(47);__coverageWrap(46,__coverageWrap(42,this).parseBlock = __coverageWrap(44,__coverageWrap(43,this).parseBlock).bind(__coverageWrap(45,this)));};
    { __coverageWrap(53);__coverageWrap(52,__coverageWrap(48,this).parseCode = __coverageWrap(50,__coverageWrap(49,this).parseCode).bind(__coverageWrap(51,this)));};
    { __coverageWrap(59);__coverageWrap(58,__coverageWrap(54,this).parseDocBlock = __coverageWrap(56,__coverageWrap(55,this).parseDocBlock).bind(__coverageWrap(57,this)));};
    { __coverageWrap(65);__coverageWrap(64,__coverageWrap(60,this).parseTag = __coverageWrap(62,__coverageWrap(61,this).parseTag).bind(__coverageWrap(63,this)));};
}

{ __coverageWrap(68);var proto = __coverageWrap(67,__coverageWrap(66,Tunic.prototype));};

/**
 * @method parse
 * @param {String} block
 * @param {String} [options]
 * @return {String}
 */
{ __coverageWrap(82);__coverageWrap(81,proto.parse = function(block, options) {
    if (__coverageWrap(70,__coverageWrap(69,arguments.length) === 2)) {
        { __coverageWrap(74);__coverageWrap(73,__coverageWrap(71,this).options = mixIn(__coverageWrap(72,{}), defaultOptions, options));};
    }

    return __coverageWrap(80,__coverageWrap(78,__coverageWrap(75,String(block))
        .split(__coverageWrap(77,__coverageWrap(76,this).grammar).blockSplit))
        .map(__coverageWrap(79,this).parseBlock));
});};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(92);__coverageWrap(91,proto.parseBlock = function(block) {
    if (__coverageWrap(86,__coverageWrap(85,__coverageWrap(84,__coverageWrap(83,this).grammar).blockParse).test(block))) {
        return __coverageWrap(88,__coverageWrap(87,this).parseDocBlock(block));
    }

    return __coverageWrap(90,__coverageWrap(89,this).parseCode(block));
});};

/**
 * @method parseCode
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(96);__coverageWrap(95,proto.parseCode = function(block) {
    return __coverageWrap(94,{
        type: 'Code',
        body: __coverageWrap(93,String(block))
    });
});};

/**
 * @method parseDocBlock
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(118);__coverageWrap(117,proto.parseDocBlock = function(block) {
    { __coverageWrap(98);__coverageWrap(97,block = String(block));};

    { __coverageWrap(105);var tags = __coverageWrap(104,__coverageWrap(103,__coverageWrap(100,__coverageWrap(99,this)
        .normalizeDocBlock(block))
        .split(__coverageWrap(102,__coverageWrap(101,this).grammar).tagSplit)));};

    { __coverageWrap(111);var token = __coverageWrap(110,__coverageWrap(109,{
        type: 'DocBlock',
        description: __coverageWrap(106,tags.shift()),
        tags: __coverageWrap(108,tags.map(__coverageWrap(107,this).parseTag))
    }));};

    if (__coverageWrap(114,__coverageWrap(113,__coverageWrap(112,this).options).raw)) {
        { __coverageWrap(116);__coverageWrap(115,token.raw = block);};
    }

    return token;
});};

/**
 * @method normalizeDocBlock
 * @param {String} block
 * @return {String}
 */
{ __coverageWrap(156);__coverageWrap(155,proto.normalizeDocBlock = function(block) {
    { __coverageWrap(122);var grammar = __coverageWrap(121,__coverageWrap(120,__coverageWrap(119,this).grammar));};

    // Trim comment wrappers
    { __coverageWrap(125);var blockParse = __coverageWrap(124,__coverageWrap(123,grammar.blockParse));};

    { __coverageWrap(129);__coverageWrap(128,block = __coverageWrap(127,__coverageWrap(126,String(block))
        .replace(blockParse, '$1'))
        .replace(matchLines.edge, ''));};

    // Unindent content
    { __coverageWrap(130);var emptyLines;};
    { __coverageWrap(131);var indentedLines;};
    { __coverageWrap(134);var indent = __coverageWrap(133,__coverageWrap(132,grammar.indent));};
    { __coverageWrap(138);var lines = __coverageWrap(137,__coverageWrap(136,__coverageWrap(135,block.match(matchLines.any)).length));};

    while (__coverageWrap(139,lines > 0)) {
        { __coverageWrap(144);__coverageWrap(143,emptyLines = (__coverageWrap(142,__coverageWrap(140,block.match(matchLines.empty)) || __coverageWrap(141,[]))).length);};
        { __coverageWrap(149);__coverageWrap(148,indentedLines = (__coverageWrap(147,__coverageWrap(145,block.match(indent)) || __coverageWrap(146,[]))).length);};

        if (__coverageWrap(152,indentedLines && (__coverageWrap(151,__coverageWrap(150,emptyLines + indentedLines) === lines)))) {
            // Strip leading indent characters
            { __coverageWrap(154);__coverageWrap(153,block = block.replace(indent, ''));};
        } else {
            // Not indented anymore
            break;
        }
    }

    return block;
});};

/**
 * @method parseTag
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(202);__coverageWrap(201,proto.parseTag = function(block) {
    { __coverageWrap(160);var grammar = __coverageWrap(159,__coverageWrap(158,__coverageWrap(157,this).grammar));};
    { __coverageWrap(164);var parts = __coverageWrap(163,__coverageWrap(162,__coverageWrap(161,String(block)).match(grammar.tagParse)));};
    { __coverageWrap(167);var tag = __coverageWrap(166,__coverageWrap(165,parts[1]));};
    { __coverageWrap(170);var type = __coverageWrap(169,__coverageWrap(168,parts[2]));};
    { __coverageWrap(174);var name = __coverageWrap(173,__coverageWrap(172,__coverageWrap(171,parts[3]) || ''));};
    { __coverageWrap(178);var description = __coverageWrap(177,__coverageWrap(176,__coverageWrap(175,parts[4]) || ''));};
    { __coverageWrap(181);var token = __coverageWrap(180,__coverageWrap(179,{}));};

    // Handle named tags

    if (__coverageWrap(184,!__coverageWrap(183,__coverageWrap(182,grammar.named).test(tag)))) {
        if (__coverageWrap(185,name && description)) {
            { __coverageWrap(188);__coverageWrap(187,description = __coverageWrap(186,name + ' ') + description);};
        } else if (name) {
            { __coverageWrap(190);__coverageWrap(189,description = name);};
        }

        { __coverageWrap(192);__coverageWrap(191,name = undefined);};
    }

    // Keep tokens light

    if (tag) {
        { __coverageWrap(194);__coverageWrap(193,token.tag = tag);};
    }

    if (type) {
        { __coverageWrap(196);__coverageWrap(195,token.type = type);};
    }

    if (name) {
        { __coverageWrap(198);__coverageWrap(197,token.name = name);};
    }

    if (description) {
        { __coverageWrap(200);__coverageWrap(199,token.description = description);};
    }

    return token;
});};

{ __coverageWrap(204);__coverageWrap(203,module.exports = Tunic);};

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
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/arg.json\"" + " " + "[[6,36],[92,175],[91,176],[42,178],[184,216],[272,355],[271,356],[222,358],[364,396],[452,533],[451,534],[402,536],[542,574],[630,711],[629,712],[580,714],[720,752],[808,860],[807,861],[758,863],[869,901],[957,1007],[956,1008],[907,1010],[1016,1048],[1104,1169],[1103,1170],[1054,1172],[1178,1210],[1266,1331],[1265,1332],[1216,1334],[1340,1372],[1428,1491],[1427,1492],[1378,1494],[1500,1532],[1588,1651],[1587,1652],[1538,1654],[1660,1692],[1748,1782],[1747,1783],[1698,1785],[1791,1823],[1879,1911],[1878,1912],[1829,1914],[1920,1952],[0,1954],[0,1955]]");var __coverage = {"0":[6,36],"1":[92,175],"2":[91,176],"3":[42,178],"4":[184,216],"5":[272,355],"6":[271,356],"7":[222,358],"8":[364,396],"9":[452,533],"10":[451,534],"11":[402,536],"12":[542,574],"13":[630,711],"14":[629,712],"15":[580,714],"16":[720,752],"17":[808,860],"18":[807,861],"19":[758,863],"20":[869,901],"21":[957,1007],"22":[956,1008],"23":[907,1010],"24":[1016,1048],"25":[1104,1169],"26":[1103,1170],"27":[1054,1172],"28":[1178,1210],"29":[1266,1331],"30":[1265,1332],"31":[1216,1334],"32":[1340,1372],"33":[1428,1491],"34":[1427,1492],"35":[1378,1494],"36":[1500,1532],"37":[1588,1651],"38":[1587,1652],"39":[1538,1654],"40":[1660,1692],"41":[1748,1782],"42":[1747,1783],"43":[1698,1785],"44":[1791,1823],"45":[1879,1911],"46":[1878,1912],"47":[1829,1914],"48":[1920,1952],"49":[0,1954],"50":[0,1955]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/arg.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(50);__coverageWrap(49,[
    __coverageWrap(0,{ "type": "Code", "body": "" }),
    __coverageWrap(3,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(2,[__coverageWrap(1,{ "tag": "arg", "type": "{Type}", "name": "[name]", "description": "Description." })]) }),
    __coverageWrap(4,{ "type": "Code", "body": "\n" }),
    __coverageWrap(7,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(6,[__coverageWrap(5,{ "tag": "arg", "type": "{Type}", "name": "[name]", "description": "Description." })]) }),
    __coverageWrap(8,{ "type": "Code", "body": "\n" }),
    __coverageWrap(11,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(10,[__coverageWrap(9,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description." })]) }),
    __coverageWrap(12,{ "type": "Code", "body": "\n" }),
    __coverageWrap(15,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(14,[__coverageWrap(13,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description." })]) }),
    __coverageWrap(16,{ "type": "Code", "body": "\n" }),
    __coverageWrap(19,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(18,[__coverageWrap(17,{ "tag": "arg", "type": "{Type}", "name": "[name]" })]) }),
    __coverageWrap(20,{ "type": "Code", "body": "\n" }),
    __coverageWrap(23,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(22,[__coverageWrap(21,{ "tag": "arg", "type": "{Type}", "name": "name" })]) }),
    __coverageWrap(24,{ "type": "Code", "body": "\n" }),
    __coverageWrap(27,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(26,[__coverageWrap(25,{ "tag": "arg", "name": "[name]", "description": "Description." })]) }),
    __coverageWrap(28,{ "type": "Code", "body": "\n" }),
    __coverageWrap(31,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(30,[__coverageWrap(29,{ "tag": "arg", "name": "[name]", "description": "Description." })]) }),
    __coverageWrap(32,{ "type": "Code", "body": "\n" }),
    __coverageWrap(35,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(34,[__coverageWrap(33,{ "tag": "arg", "name": "name", "description": "Description." })]) }),
    __coverageWrap(36,{ "type": "Code", "body": "\n" }),
    __coverageWrap(39,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(38,[__coverageWrap(37,{ "tag": "arg", "name": "name", "description": "Description." })]) }),
    __coverageWrap(40,{ "type": "Code", "body": "\n" }),
    __coverageWrap(43,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(42,[__coverageWrap(41,{ "tag": "arg", "name": "[name]" })]) }),
    __coverageWrap(44,{ "type": "Code", "body": "\n" }),
    __coverageWrap(47,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(46,[__coverageWrap(45,{ "tag": "arg", "name": "name" })]) }),
    __coverageWrap(48,{ "type": "Code", "body": "\n" })
])
};
},{}],13:[function(require,module,exports){
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/custom-hbs.json\"" + " " + "[[6,36],[301,384],[398,529],[543,707],[721,858],[872,909],[287,919],[42,1576],[1582,1616],[1881,1964],[1978,2109],[2123,2287],[2301,2438],[2452,2468],[1867,2478],[1622,3021],[3027,3061],[3330,3413],[3427,3558],[3572,3736],[3750,3887],[3901,3917],[3316,3927],[3067,4558],[4564,4598],[4863,4946],[4960,5091],[5105,5269],[5283,5420],[5434,5471],[4849,5481],[4604,6266],[6272,6306],[6571,6654],[6668,6799],[6813,6977],[6991,7128],[7142,7158],[6557,7168],[6312,7803],[7809,7843],[8112,8195],[8209,8340],[8354,8518],[8532,8669],[8683,8699],[8098,8709],[7849,9432],[9438,9574],[0,9576],[0,9577]]");var __coverage = {"0":[6,36],"1":[301,384],"2":[398,529],"3":[543,707],"4":[721,858],"5":[872,909],"6":[287,919],"7":[42,1576],"8":[1582,1616],"9":[1881,1964],"10":[1978,2109],"11":[2123,2287],"12":[2301,2438],"13":[2452,2468],"14":[1867,2478],"15":[1622,3021],"16":[3027,3061],"17":[3330,3413],"18":[3427,3558],"19":[3572,3736],"20":[3750,3887],"21":[3901,3917],"22":[3316,3927],"23":[3067,4558],"24":[4564,4598],"25":[4863,4946],"26":[4960,5091],"27":[5105,5269],"28":[5283,5420],"29":[5434,5471],"30":[4849,5481],"31":[4604,6266],"32":[6272,6306],"33":[6571,6654],"34":[6668,6799],"35":[6813,6977],"36":[6991,7128],"37":[7142,7158],"38":[6557,7168],"39":[6312,7803],"40":[7809,7843],"41":[8112,8195],"42":[8209,8340],"43":[8354,8518],"44":[8532,8669],"45":[8683,8699],"46":[8098,8709],"47":[7849,9432],"48":[9438,9574],"49":[0,9576],"50":[0,9577]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/custom-hbs.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(50);__coverageWrap(49,[
    __coverageWrap(0,{ "type": "Code", "body": "" }),
    __coverageWrap(7,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n",
        "tags": __coverageWrap(6,[
            __coverageWrap(1,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(2,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(3,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(4,{ "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" }),
            __coverageWrap(5,{ "tag": "tag", "description": "\n" })
        ]),
        "raw": "{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}"
    }),
    __coverageWrap(8,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(15,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n",
        "tags": __coverageWrap(14,[
            __coverageWrap(9,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(10,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(11,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(12,{ "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" }),
            __coverageWrap(13,{ "tag": "tag" })
        ]),
        "raw": "{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}"
    }),
    __coverageWrap(16,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(23,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n",
        "tags": __coverageWrap(22,[
            __coverageWrap(17,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(18,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(19,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(20,{ "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" }),
            __coverageWrap(21,{ "tag": "tag" })
        ]),
        "raw": "{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}"
    }),
    __coverageWrap(24,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(31,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n",
        "tags": __coverageWrap(30,[
            __coverageWrap(25,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(26,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(27,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(28,{ "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" }),
            __coverageWrap(29,{ "tag": "tag", "description": "\n" })
        ]),
        "raw": "    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}"
    }),
    __coverageWrap(32,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(39,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n",
        "tags": __coverageWrap(38,[
            __coverageWrap(33,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(34,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(35,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(36,{ "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" }),
            __coverageWrap(37,{ "tag": "tag" })
        ]),
        "raw": "    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}"
    }),
    __coverageWrap(40,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(47,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n",
        "tags": __coverageWrap(46,[
            __coverageWrap(41,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(42,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(43,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(44,{ "tag": "example", "description": "\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n" }),
            __coverageWrap(45,{ "tag": "tag" })
        ]),
        "raw": "    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}"
    }),
    __coverageWrap(48,{ "type": "Code", "body": "\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n" })
])
};
},{}],14:[function(require,module,exports){
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/custom-perl.json\"" + " " + "[[6,92],[362,445],[459,590],[604,768],[782,851],[865,881],[348,891],[98,1371],[1377,1409],[0,1411],[0,1412]]");var __coverage = {"0":[6,92],"1":[362,445],"2":[459,590],"3":[604,768],"4":[782,851],"5":[865,881],"6":[348,891],"7":[98,1371],"8":[1377,1409],"9":[0,1411],"10":[0,1412]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/custom-perl.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(10);__coverageWrap(9,[
    __coverageWrap(0,{ "type": "Code", "body": "use strict;\nuse warnings;\n\nprint \"hello world\";\n\n" }),
    __coverageWrap(7,{
        "type": "DocBlock",
        "description": "\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n",
        "tags": __coverageWrap(6,[
            __coverageWrap(1,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(2,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(3,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(4,{ "tag": "example", "description": "\n\n    my $foo = \"bar\";\n\n" }),
            __coverageWrap(5,{ "tag": "tag" })
        ]),
        "raw": "=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = \"bar\";\n\n@tag\n\n=cut"
    }),
    __coverageWrap(8,{ "type": "Code", "body": "\n" })
])
};
},{}],15:[function(require,module,exports){
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/desc.json\"" + " " + "[[6,36],[102,104],[42,106],[112,144],[210,212],[150,214],[220,252],[318,320],[258,322],[328,360],[0,362],[0,363]]");var __coverage = {"0":[6,36],"1":[102,104],"2":[42,106],"3":[112,144],"4":[210,212],"5":[150,214],"6":[220,252],"7":[318,320],"8":[258,322],"9":[328,360],"10":[0,362],"11":[0,363]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/desc.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(11);__coverageWrap(10,[
    __coverageWrap(0,{ "type": "Code", "body": "" }),
    __coverageWrap(2,{ "type": "DocBlock", "description": "description", "tags": __coverageWrap(1,[]) }),
    __coverageWrap(3,{ "type": "Code", "body": "\n" }),
    __coverageWrap(5,{ "type": "DocBlock", "description": "description", "tags": __coverageWrap(4,[]) }),
    __coverageWrap(6,{ "type": "Code", "body": "\n" }),
    __coverageWrap(8,{ "type": "DocBlock", "description": "description", "tags": __coverageWrap(7,[]) }),
    __coverageWrap(9,{ "type": "Code", "body": "\n" })
])
};
},{}],16:[function(require,module,exports){
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/empty.json\"" + " " + "[[6,42],[97,99],[48,101],[107,139],[194,196],[145,198],[204,236],[291,293],[242,295],[301,333],[388,390],[339,392],[398,430],[0,432],[0,433]]");var __coverage = {"0":[6,42],"1":[97,99],"2":[48,101],"3":[107,139],"4":[194,196],"5":[145,198],"6":[204,236],"7":[291,293],"8":[242,295],"9":[301,333],"10":[388,390],"11":[339,392],"12":[398,430],"13":[0,432],"14":[0,433]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/empty.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(14);__coverageWrap(13,[
    __coverageWrap(0,{ "type": "Code", "body": "/**/\n" }),
    __coverageWrap(2,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(1,[]) }),
    __coverageWrap(3,{ "type": "Code", "body": "\n" }),
    __coverageWrap(5,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(4,[]) }),
    __coverageWrap(6,{ "type": "Code", "body": "\n" }),
    __coverageWrap(8,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(7,[]) }),
    __coverageWrap(9,{ "type": "Code", "body": "\n" }),
    __coverageWrap(11,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(10,[]) }),
    __coverageWrap(12,{ "type": "Code", "body": "\n" })
])
};
},{}],17:[function(require,module,exports){
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/ignore.json\"" + " " + "[[6,266],[0,268],[0,269]]");var __coverage = {"0":[6,266],"1":[0,268],"2":[0,269]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/ignore.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(2);__coverageWrap(1,[
    __coverageWrap(0,{ "type": "Code", "body": "// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n" })
])
};
},{}],18:[function(require,module,exports){
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/indent.json\"" + " " + "[[6,36],[302,385],[399,530],[544,708],[722,789],[803,819],[288,829],[42,1368],[1374,1408],[1674,1757],[1771,1902],[1916,2080],[2094,2161],[2175,2191],[1660,2201],[1414,2671],[2677,2711],[2977,3060],[3074,3205],[3219,3383],[3397,3464],[3478,3494],[2963,3504],[2717,4042],[4048,4082],[4348,4431],[4445,4576],[4590,4754],[4768,4835],[4849,4865],[4334,4875],[4088,5526],[5532,5566],[5832,5915],[5929,6060],[6074,6238],[6252,6319],[6333,6349],[5818,6359],[5572,6905],[6911,6945],[7211,7294],[7308,7439],[7453,7617],[7631,7698],[7712,7728],[7197,7738],[6951,8351],[8357,8389],[0,8391],[0,8392]]");var __coverage = {"0":[6,36],"1":[302,385],"2":[399,530],"3":[544,708],"4":[722,789],"5":[803,819],"6":[288,829],"7":[42,1368],"8":[1374,1408],"9":[1674,1757],"10":[1771,1902],"11":[1916,2080],"12":[2094,2161],"13":[2175,2191],"14":[1660,2201],"15":[1414,2671],"16":[2677,2711],"17":[2977,3060],"18":[3074,3205],"19":[3219,3383],"20":[3397,3464],"21":[3478,3494],"22":[2963,3504],"23":[2717,4042],"24":[4048,4082],"25":[4348,4431],"26":[4445,4576],"27":[4590,4754],"28":[4768,4835],"29":[4849,4865],"30":[4334,4875],"31":[4088,5526],"32":[5532,5566],"33":[5832,5915],"34":[5929,6060],"35":[6074,6238],"36":[6252,6319],"37":[6333,6349],"38":[5818,6359],"39":[5572,6905],"40":[6911,6945],"41":[7211,7294],"42":[7308,7439],"43":[7453,7617],"44":[7631,7698],"45":[7712,7728],"46":[7197,7738],"47":[6951,8351],"48":[8357,8389],"49":[0,8391],"50":[0,8392]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/indent.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(50);__coverageWrap(49,[
    __coverageWrap(0,{ "type": "Code", "body": "" }),
    __coverageWrap(7,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": __coverageWrap(6,[
            __coverageWrap(1,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(2,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(3,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(4,{ "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" }),
            __coverageWrap(5,{ "tag": "tag" })
        ]),
        "raw": "/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */"
    }),
    __coverageWrap(8,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(15,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": __coverageWrap(14,[
            __coverageWrap(9,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(10,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(11,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(12,{ "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" }),
            __coverageWrap(13,{ "tag": "tag" })
        ]),
        "raw": "/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */"
    }),
    __coverageWrap(16,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(23,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": __coverageWrap(22,[
            __coverageWrap(17,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(18,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(19,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(20,{ "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" }),
            __coverageWrap(21,{ "tag": "tag" })
        ]),
        "raw": "/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */"
    }),
    __coverageWrap(24,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(31,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": __coverageWrap(30,[
            __coverageWrap(25,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(26,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(27,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(28,{ "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" }),
            __coverageWrap(29,{ "tag": "tag" })
        ]),
        "raw": "    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */"
    }),
    __coverageWrap(32,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(39,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": __coverageWrap(38,[
            __coverageWrap(33,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(34,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(35,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(36,{ "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" }),
            __coverageWrap(37,{ "tag": "tag" })
        ]),
        "raw": "    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */"
    }),
    __coverageWrap(40,{ "type": "Code", "body": "\n\n" }),
    __coverageWrap(47,{
        "type": "DocBlock",
        "description": "# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n",
        "tags": __coverageWrap(46,[
            __coverageWrap(41,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description.\n" }),
            __coverageWrap(42,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n" }),
            __coverageWrap(43,{ "tag": "arg", "type": "{Type}", "name": "name", "description": "Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n" }),
            __coverageWrap(44,{ "tag": "example", "description": "\n\n    var foo = 'bar';\n\n" }),
            __coverageWrap(45,{ "tag": "tag" })
        ]),
        "raw": "    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */"
    }),
    __coverageWrap(48,{ "type": "Code", "body": "\n" })
])
};
},{}],19:[function(require,module,exports){
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/name.json\"" + " " + "[[6,36],[92,124],[91,125],[42,127],[133,165],[221,255],[220,256],[171,258],[264,296],[352,389],[351,390],[302,392],[398,430],[486,536],[485,537],[436,539],[545,577],[0,579],[0,580]]");var __coverage = {"0":[6,36],"1":[92,124],"2":[91,125],"3":[42,127],"4":[133,165],"5":[221,255],"6":[220,256],"7":[171,258],"8":[264,296],"9":[352,389],"10":[351,390],"11":[302,392],"12":[398,430],"13":[486,536],"14":[485,537],"15":[436,539],"16":[545,577],"17":[0,579],"18":[0,580]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/name.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(18);__coverageWrap(17,[
    __coverageWrap(0,{ "type": "Code", "body": "" }),
    __coverageWrap(3,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(2,[__coverageWrap(1,{ "tag": "arg", "name": "name" })]) }),
    __coverageWrap(4,{ "type": "Code", "body": "\n" }),
    __coverageWrap(7,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(6,[__coverageWrap(5,{ "tag": "arg", "name": "[name]" })]) }),
    __coverageWrap(8,{ "type": "Code", "body": "\n" }),
    __coverageWrap(11,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(10,[__coverageWrap(9,{ "tag": "arg", "name": "[name={}]" })]) }),
    __coverageWrap(12,{ "type": "Code", "body": "\n" }),
    __coverageWrap(15,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(14,[__coverageWrap(13,{ "tag": "arg", "name": "[name=\"hello world\"]" })]) }),
    __coverageWrap(16,{ "type": "Code", "body": "\n" })
])
};
},{}],20:[function(require,module,exports){
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/tag.json\"" + " " + "[[6,36],[92,162],[91,163],[42,165],[171,203],[259,329],[258,330],[209,332],[338,370],[426,473],[425,474],[376,476],[482,514],[570,617],[569,618],[520,620],[626,658],[714,730],[713,731],[664,733],[739,771],[0,773],[0,774]]");var __coverage = {"0":[6,36],"1":[92,162],"2":[91,163],"3":[42,165],"4":[171,203],"5":[259,329],"6":[258,330],"7":[209,332],"8":[338,370],"9":[426,473],"10":[425,474],"11":[376,476],"12":[482,514],"13":[570,617],"14":[569,618],"15":[520,620],"16":[626,658],"17":[714,730],"18":[713,731],"19":[664,733],"20":[739,771],"21":[0,773],"22":[0,774]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/tag.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(22);__coverageWrap(21,[
    __coverageWrap(0,{ "type": "Code", "body": "" }),
    __coverageWrap(3,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(2,[__coverageWrap(1,{ "tag": "tag", "type": "{Type}", "description": "Description here." })]) }),
    __coverageWrap(4,{ "type": "Code", "body": "\n" }),
    __coverageWrap(7,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(6,[__coverageWrap(5,{ "tag": "tag", "type": "{Type}", "description": "Description here." })]) }),
    __coverageWrap(8,{ "type": "Code", "body": "\n" }),
    __coverageWrap(11,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(10,[__coverageWrap(9,{ "tag": "tag", "description": "Description." })]) }),
    __coverageWrap(12,{ "type": "Code", "body": "\n" }),
    __coverageWrap(15,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(14,[__coverageWrap(13,{ "tag": "tag", "description": "Description." })]) }),
    __coverageWrap(16,{ "type": "Code", "body": "\n" }),
    __coverageWrap(19,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(18,[__coverageWrap(17,{ "tag": "tag" })]) }),
    __coverageWrap(20,{ "type": "Code", "body": "\n" })
])
};
},{}],21:[function(require,module,exports){
module.exports=console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/type.json\"" + " " + "[[6,36],[92,126],[91,127],[42,129],[135,167],[223,266],[222,267],[173,269],[275,307],[363,423],[362,424],[313,426],[432,464],[520,607],[519,608],[470,610],[616,648],[0,650],[0,651]]");var __coverage = {"0":[6,36],"1":[92,126],"2":[91,127],"3":[42,129],"4":[135,167],"5":[223,266],"6":[222,267],"7":[173,269],"8":[275,307],"9":[363,423],"10":[362,424],"11":[313,426],"12":[432,464],"13":[520,607],"14":[519,608],"15":[470,610],"16":[616,648],"17":[0,650],"18":[0,651]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/expected/type.json\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(18);__coverageWrap(17,[
    __coverageWrap(0,{ "type": "Code", "body": "" }),
    __coverageWrap(3,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(2,[__coverageWrap(1,{ "tag": "arg", "type": "{Type}" })]) }),
    __coverageWrap(4,{ "type": "Code", "body": "\n" }),
    __coverageWrap(7,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(6,[__coverageWrap(5,{ "tag": "arg", "type": "{String|Object}" })]) }),
    __coverageWrap(8,{ "type": "Code", "body": "\n" }),
    __coverageWrap(11,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(10,[__coverageWrap(9,{ "tag": "arg", "type": "{Array.<Object.<String,Number>>}" })]) }),
    __coverageWrap(12,{ "type": "Code", "body": "\n" }),
    __coverageWrap(15,{ "type": "DocBlock", "description": "", "tags": __coverageWrap(14,[__coverageWrap(13,{ "tag": "arg", "type": "{Function(String, ...[Number]): Number}", "name": "callback" })]) }),
    __coverageWrap(16,{ "type": "Code", "body": "\n" })
])
};
},{}],22:[function(require,module,exports){
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/spec/tunic-spec.js\"" + " " + "[[25,38],[53,70],[53,70],[40,71],[81,94],[81,94],[72,95],[108,134],[108,134],[96,135],[148,153],[136,154],[257,489],[244,490],[517,530],[532,566],[500,567],[500,568],[223,574],[192,575],[192,576],[647,695],[635,696],[723,730],[733,772],[732,773],[706,774],[706,775],[801,810],[813,843],[812,844],[784,845],[784,846],[872,883],[886,920],[885,921],[855,922],[855,923],[949,961],[963,996],[932,997],[932,998],[614,1004],[582,1005],[582,1006],[1076,1146],[1065,1147],[1174,1185],[1187,1219],[1157,1220],[1157,1221],[1044,1227],[1012,1228],[1012,1229],[1290,1437],[1280,1438],[1465,1475],[1477,1508],[1448,1509],[1448,1510],[1259,1516],[1235,1517],[1235,1518],[1579,1963],[1569,1964],[1991,2001],[2003,2034],[1974,2035],[1974,2036],[1548,2042],[1524,2043],[1524,2044],[2107,2266],[2096,2267],[2294,2305],[2307,2339],[2277,2340],[2277,2341],[2075,2347],[2050,2348],[2050,2349],[2412,2511],[2401,2512],[2539,2550],[2552,2584],[2522,2585],[2522,2586],[2380,2592],[2355,2593],[2355,2594],[2664,5895],[2651,5896],[5926,5937],[5926,5937],[5905,5938],[5989,6022],[5960,6023],[5960,6023],[5947,6024],[6059,6093],[6034,6094],[6034,6095],[2630,6101],[2600,6102],[2600,6103],[6186,10138],[6173,10139],[10181,10416],[10171,10417],[10171,10417],[10149,10418],[10471,10504],[10441,10505],[10441,10505],[10428,10506],[10541,10579],[10516,10580],[10516,10581],[6152,10587],[6109,10588],[6109,10589],[10666,11181],[10653,11182],[11219,11387],[11209,11388],[11209,11388],[11192,11389],[11437,11470],[11412,11471],[11412,11471],[11399,11472],[11507,11546],[11482,11547],[11482,11548],[10632,11554],[10595,11555],[10595,11556],[174,11558],[156,11559],[156,11560]]");var __coverage = {"0":[25,38],"1":[53,70],"2":[53,70],"3":[40,71],"4":[81,94],"5":[81,94],"6":[72,95],"7":[108,134],"8":[108,134],"9":[96,135],"10":[148,153],"11":[136,154],"12":[257,489],"13":[244,490],"14":[517,530],"15":[532,566],"16":[500,567],"17":[500,568],"18":[223,574],"19":[192,575],"20":[192,576],"21":[647,695],"22":[635,696],"23":[723,730],"24":[733,772],"25":[732,773],"26":[706,774],"27":[706,775],"28":[801,810],"29":[813,843],"30":[812,844],"31":[784,845],"32":[784,846],"33":[872,883],"34":[886,920],"35":[885,921],"36":[855,922],"37":[855,923],"38":[949,961],"39":[963,996],"40":[932,997],"41":[932,998],"42":[614,1004],"43":[582,1005],"44":[582,1006],"45":[1076,1146],"46":[1065,1147],"47":[1174,1185],"48":[1187,1219],"49":[1157,1220],"50":[1157,1221],"51":[1044,1227],"52":[1012,1228],"53":[1012,1229],"54":[1290,1437],"55":[1280,1438],"56":[1465,1475],"57":[1477,1508],"58":[1448,1509],"59":[1448,1510],"60":[1259,1516],"61":[1235,1517],"62":[1235,1518],"63":[1579,1963],"64":[1569,1964],"65":[1991,2001],"66":[2003,2034],"67":[1974,2035],"68":[1974,2036],"69":[1548,2042],"70":[1524,2043],"71":[1524,2044],"72":[2107,2266],"73":[2096,2267],"74":[2294,2305],"75":[2307,2339],"76":[2277,2340],"77":[2277,2341],"78":[2075,2347],"79":[2050,2348],"80":[2050,2349],"81":[2412,2511],"82":[2401,2512],"83":[2539,2550],"84":[2552,2584],"85":[2522,2585],"86":[2522,2586],"87":[2380,2592],"88":[2355,2593],"89":[2355,2594],"90":[2664,5895],"91":[2651,5896],"92":[5926,5937],"93":[5926,5937],"94":[5905,5938],"95":[5989,6022],"96":[5960,6023],"97":[5960,6023],"98":[5947,6024],"99":[6059,6093],"100":[6034,6094],"101":[6034,6095],"102":[2630,6101],"103":[2600,6102],"104":[2600,6103],"105":[6186,10138],"106":[6173,10139],"107":[10181,10416],"108":[10171,10417],"109":[10171,10417],"110":[10149,10418],"111":[10471,10504],"112":[10441,10505],"113":[10441,10505],"114":[10428,10506],"115":[10541,10579],"116":[10516,10580],"117":[10516,10581],"118":[6152,10587],"119":[6109,10588],"120":[6109,10589],"121":[10666,11181],"122":[10653,11182],"123":[11219,11387],"124":[11209,11388],"125":[11209,11388],"126":[11192,11389],"127":[11437,11470],"128":[11412,11471],"129":[11412,11471],"130":[11399,11472],"131":[11507,11546],"132":[11482,11547],"133":[11482,11548],"134":[10632,11554],"135":[10595,11555],"136":[10595,11556],"137":[174,11558],"138":[156,11559],"139":[156,11560]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/spec/tunic-spec.js\"" + " " + index);delete __coverage[index];return value};
/*jshint maxlen:false */
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var assert = __coverageWrap(2,__coverageWrap(1,require('assert')));};
{ __coverageWrap(6);var fs = __coverageWrap(5,__coverageWrap(4,require('fs')));};
{ __coverageWrap(9);var tunic = __coverageWrap(8,__coverageWrap(7,require('../../lib/tunic')));};
{ __coverageWrap(11);var Tunic = __coverageWrap(10,tunic);};

{ __coverageWrap(139);__coverageWrap(138,describe('Tunic', __coverageWrap(137,function () {
    { __coverageWrap(20);__coverageWrap(19,it('should ignore non-blocks', __coverageWrap(18,function() {
        { __coverageWrap(13);var ignore = __coverageWrap(12,"// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n");};

        { __coverageWrap(17);__coverageWrap(16,assert.deepEqual(__coverageWrap(14,tunic(ignore)), __coverageWrap(15,require('../expected/ignore.json'))));};
    })));};

    { __coverageWrap(44);__coverageWrap(43,it('should parse empty blocks', __coverageWrap(42,function() {
        { __coverageWrap(22);var empty = __coverageWrap(21,"/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n");};

        { __coverageWrap(27);__coverageWrap(26,assert.deepEqual(__coverageWrap(23,tunic()), __coverageWrap(25,[__coverageWrap(24,{ 'type': 'Code', 'body': 'undefined' })])));};
        { __coverageWrap(32);__coverageWrap(31,assert.deepEqual(__coverageWrap(28,tunic('')), __coverageWrap(30,[__coverageWrap(29,{ 'type': 'Code', 'body': '' })])));};
        { __coverageWrap(37);__coverageWrap(36,assert.deepEqual(__coverageWrap(33,tunic(null)), __coverageWrap(35,[__coverageWrap(34,{ 'type': 'Code', 'body': 'null' })])));};
        { __coverageWrap(41);__coverageWrap(40,assert.deepEqual(__coverageWrap(38,tunic(empty)), __coverageWrap(39,require('../expected/empty.json'))));};
    })));};

    { __coverageWrap(53);__coverageWrap(52,it('should parse descriptions', __coverageWrap(51,function() {
        { __coverageWrap(46);var desc = __coverageWrap(45,"/** description */\n/**\n * description\n */\n/**\ndescription\n*/\n");};

        { __coverageWrap(50);__coverageWrap(49,assert.deepEqual(__coverageWrap(47,tunic(desc)), __coverageWrap(48,require('../expected/desc.json'))));};
    })));};

    { __coverageWrap(62);__coverageWrap(61,it('should parse tags', __coverageWrap(60,function() {
        { __coverageWrap(55);var tag = __coverageWrap(54,"/** @tag {Type} - Description here. */\n/** @tag {Type} Description here. */\n/** @tag - Description. */\n/** @tag Description. */\n/** @tag */\n");};

        { __coverageWrap(59);__coverageWrap(58,assert.deepEqual(__coverageWrap(56,tunic(tag)), __coverageWrap(57,require('../expected/tag.json'))));};
    })));};

    { __coverageWrap(71);__coverageWrap(70,it('should parse args', __coverageWrap(69,function() {
        { __coverageWrap(64);var arg = __coverageWrap(63,"/** @arg {Type} [name] - Description. */\n/** @arg {Type} [name] Description. */\n/** @arg {Type} name - Description. */\n/** @arg {Type} name Description. */\n/** @arg {Type} [name] */\n/** @arg {Type} name */\n/** @arg [name] - Description. */\n/** @arg [name] Description. */\n/** @arg name - Description. */\n/** @arg name Description. */\n/** @arg [name] */\n/** @arg name */\n");};

        { __coverageWrap(68);__coverageWrap(67,assert.deepEqual(__coverageWrap(65,tunic(arg)), __coverageWrap(66,require('../expected/arg.json'))));};
    })));};

    { __coverageWrap(80);__coverageWrap(79,it('should parse types', __coverageWrap(78,function() {
        { __coverageWrap(73);var type = __coverageWrap(72,"/** @arg {Type} */\n/** @arg {String|Object} */\n/** @arg {Array.<Object.<String,Number>>} */\n/** @arg {Function(String, ...[Number]): Number} callback */\n");};

        { __coverageWrap(77);__coverageWrap(76,assert.deepEqual(__coverageWrap(74,tunic(type)), __coverageWrap(75,require('../expected/type.json'))));};
    })));};

    { __coverageWrap(89);__coverageWrap(88,it('should parse names', __coverageWrap(87,function() {
        { __coverageWrap(82);var name = __coverageWrap(81,"/** @arg name */\n/** @arg [name] */\n/** @arg [name={}] */\n/** @arg [name=\"hello world\"] */\n");};

        { __coverageWrap(86);__coverageWrap(85,assert.deepEqual(__coverageWrap(83,tunic(name)), __coverageWrap(84,require('../expected/name.json'))));};
    })));};

    { __coverageWrap(104);__coverageWrap(103,it('should handle indention', __coverageWrap(102,function() {
        { __coverageWrap(91);var indent = __coverageWrap(90,"/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */\n\n/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */\n\n/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */\n\n    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */\n\n    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */\n\n    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */\n");};
        { __coverageWrap(94);var standardParser = __coverageWrap(93,__coverageWrap(92,new Tunic()));};
        { __coverageWrap(98);var tokens = __coverageWrap(97,__coverageWrap(96,standardParser.parse(indent, __coverageWrap(95,{
            raw: true
        }))));};

        { __coverageWrap(101);__coverageWrap(100,assert.deepEqual(tokens, __coverageWrap(99,require('../expected/indent.json'))));};
    })));};

    { __coverageWrap(120);__coverageWrap(119,it('should use custom handlebars grammar', __coverageWrap(118,function() {
        { __coverageWrap(106);var custom = __coverageWrap(105,"{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}\n\n{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}\n\n{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}\n\n    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}\n\n    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}\n\n    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n");};

        { __coverageWrap(110);var handlebarParser = __coverageWrap(109,__coverageWrap(108,new Tunic(__coverageWrap(107,{
            blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
            blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
            indent: /^[\t !]/gm,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        }))));};

        { __coverageWrap(114);var tokens = __coverageWrap(113,__coverageWrap(112,handlebarParser.parse(custom, __coverageWrap(111,{
            raw: true
        }))));};

        { __coverageWrap(117);__coverageWrap(116,assert.deepEqual(tokens, __coverageWrap(115,require('../expected/custom-hbs.json'))));};
    })));};

    { __coverageWrap(136);__coverageWrap(135,it('should use custom perl grammar', __coverageWrap(134,function() {
        { __coverageWrap(122);var custom = __coverageWrap(121,"use strict;\nuse warnings;\n\nprint \"hello world\";\n\n=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = \"bar\";\n\n@tag\n\n=cut\n");};

        { __coverageWrap(126);var perlParser = __coverageWrap(125,__coverageWrap(124,new Tunic(__coverageWrap(123,{
            blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
            blockParse: /^=pod([\s\S]*?)\n=cut$/m,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        }))));};

        { __coverageWrap(130);var tokens = __coverageWrap(129,__coverageWrap(128,perlParser.parse(custom, __coverageWrap(127,{
            raw: true
        }))));};

        console.log('tokens', tokens);
        console.log('json', require('../expected/custom-perl.json'));

        { __coverageWrap(133);__coverageWrap(132,assert.deepEqual(tokens, __coverageWrap(131,require('../expected/custom-perl.json'))));};
    })));};
})));};

},{"../../lib/tunic":1,"../expected/arg.json":12,"../expected/custom-hbs.json":13,"../expected/custom-perl.json":14,"../expected/desc.json":15,"../expected/empty.json":16,"../expected/ignore.json":17,"../expected/indent.json":18,"../expected/name.json":19,"../expected/tag.json":20,"../expected/type.json":21,"assert":3,"fs":2}]},{},[22])
