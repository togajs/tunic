(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/lib/tunic.js\"" + " " + "[[0,13],[104,175],[104,175],[87,176],[272,612],[272,612],[251,613],[685,703],[685,703],[664,704],[1001,1009],[1014,1022],[1037,1053],[1037,1053],[1027,1054],[1067,1068],[1059,1069],[1082,1089],[1091,1094],[1106,1124],[1106,1125],[1170,1193],[1213,1235],[1213,1236],[978,1288],[978,1288],[965,1289],[1866,1882],[1866,1888],[1892,1904],[1892,1917],[1866,1917],[1866,1926],[1938,1953],[1938,1954],[1963,1980],[1963,1981],[2060,2064],[2060,2081],[2058,2082],[2101,2119],[2101,2132],[2165,2169],[2187,2189],[2165,2215],[2165,2216],[2221,2225],[2243,2245],[2221,2262],[2221,2263],[2292,2296],[2305,2309],[2305,2315],[2321,2325],[2292,2326],[2292,2327],[2332,2336],[2350,2354],[2350,2365],[2371,2375],[2332,2376],[2332,2377],[2382,2386],[2399,2403],[2399,2413],[2419,2423],[2382,2424],[2382,2425],[2430,2434],[2451,2455],[2451,2469],[2475,2479],[2430,2480],[2430,2481],[2486,2490],[2502,2506],[2502,2515],[2521,2525],[2486,2526],[2486,2527],[2543,2558],[2543,2558],[2531,2559],[2709,2725],[2709,2731],[2743,2747],[2765,2767],[2743,2793],[2743,2794],[2813,2826],[2842,2846],[2842,2854],[2813,2866],[2880,2884],[2813,2896],[2660,2899],[2660,2900],[3024,3028],[3024,3036],[3024,3047],[3024,3059],[3078,3082],[3078,3103],[3123,3127],[3123,3144],[2979,3147],[2979,3148],[3311,3324],[3273,3330],[3226,3333],[3226,3334],[3460,3481],[3460,3482],[3499,3503],[3499,3537],[3553,3557],[3553,3565],[3499,3575],[3499,3575],[3488,3576],[3643,3655],[3680,3684],[3671,3694],[3594,3700],[3594,3700],[3582,3701],[3711,3715],[3711,3723],[3711,3727],[3739,3756],[3739,3757],[3416,3784],[3416,3785],[3931,3935],[3931,3943],[3931,3943],[3917,3944],[3996,4014],[3996,4014],[3979,4015],[4029,4042],[4029,4077],[4021,4115],[4021,4116],[4146,4161],[4166,4184],[4202,4216],[4202,4216],[4189,4217],[4234,4261],[4234,4268],[4234,4268],[4222,4269],[4282,4291],[4317,4346],[4350,4352],[4317,4352],[4303,4360],[4303,4361],[4387,4406],[4410,4412],[4387,4412],[4370,4420],[4370,4421],[4453,4479],[4453,4489],[4435,4490],[4553,4586],[4553,4587],[3869,4696],[3869,4697],[4827,4831],[4827,4839],[4827,4839],[4813,4840],[4857,4870],[4857,4894],[4857,4894],[4845,4895],[4910,4918],[4910,4918],[4900,4919],[4935,4943],[4935,4943],[4924,4944],[4960,4968],[4960,4974],[4960,4974],[4949,4975],[4998,5006],[4998,5012],[4998,5012],[4980,5013],[5030,5032],[5030,5032],[5018,5033],[5070,5083],[5070,5093],[5069,5093],[5109,5128],[5158,5168],[5144,5182],[5144,5183],[5223,5241],[5223,5242],[5262,5278],[5262,5279],[5336,5351],[5336,5352],[5384,5401],[5384,5402],[5434,5451],[5434,5452],[5491,5522],[5491,5523],[4774,5550],[4774,5551],[5553,5575],[5553,5576]]");var __coverage = {"0":[0,13],"1":[104,175],"2":[104,175],"3":[87,176],"4":[272,612],"5":[272,612],"6":[251,613],"7":[685,703],"8":[685,703],"9":[664,704],"10":[1001,1009],"11":[1014,1022],"12":[1037,1053],"13":[1037,1053],"14":[1027,1054],"15":[1067,1068],"16":[1059,1069],"17":[1082,1089],"18":[1091,1094],"19":[1106,1124],"20":[1106,1125],"21":[1170,1193],"22":[1213,1235],"23":[1213,1236],"24":[978,1288],"25":[978,1288],"26":[965,1289],"27":[1866,1882],"28":[1866,1888],"29":[1892,1904],"30":[1892,1917],"31":[1866,1917],"32":[1866,1926],"33":[1938,1953],"34":[1938,1954],"35":[1963,1980],"36":[1963,1981],"37":[2060,2064],"38":[2060,2081],"39":[2058,2082],"40":[2101,2119],"41":[2101,2132],"42":[2165,2169],"43":[2187,2189],"44":[2165,2215],"45":[2165,2216],"46":[2221,2225],"47":[2243,2245],"48":[2221,2262],"49":[2221,2263],"50":[2292,2296],"51":[2305,2309],"52":[2305,2315],"53":[2321,2325],"54":[2292,2326],"55":[2292,2327],"56":[2332,2336],"57":[2350,2354],"58":[2350,2365],"59":[2371,2375],"60":[2332,2376],"61":[2332,2377],"62":[2382,2386],"63":[2399,2403],"64":[2399,2413],"65":[2419,2423],"66":[2382,2424],"67":[2382,2425],"68":[2430,2434],"69":[2451,2455],"70":[2451,2469],"71":[2475,2479],"72":[2430,2480],"73":[2430,2481],"74":[2486,2490],"75":[2502,2506],"76":[2502,2515],"77":[2521,2525],"78":[2486,2526],"79":[2486,2527],"80":[2543,2558],"81":[2543,2558],"82":[2531,2559],"83":[2709,2725],"84":[2709,2731],"85":[2743,2747],"86":[2765,2767],"87":[2743,2793],"88":[2743,2794],"89":[2813,2826],"90":[2842,2846],"91":[2842,2854],"92":[2813,2866],"93":[2880,2884],"94":[2813,2896],"95":[2660,2899],"96":[2660,2900],"97":[3024,3028],"98":[3024,3036],"99":[3024,3047],"100":[3024,3059],"101":[3078,3082],"102":[3078,3103],"103":[3123,3127],"104":[3123,3144],"105":[2979,3147],"106":[2979,3148],"107":[3311,3324],"108":[3273,3330],"109":[3226,3333],"110":[3226,3334],"111":[3460,3481],"112":[3460,3482],"113":[3499,3503],"114":[3499,3537],"115":[3553,3557],"116":[3553,3565],"117":[3499,3575],"118":[3499,3575],"119":[3488,3576],"120":[3643,3655],"121":[3680,3684],"122":[3671,3694],"123":[3594,3700],"124":[3594,3700],"125":[3582,3701],"126":[3711,3715],"127":[3711,3723],"128":[3711,3727],"129":[3739,3756],"130":[3739,3757],"131":[3416,3784],"132":[3416,3785],"133":[3931,3935],"134":[3931,3943],"135":[3931,3943],"136":[3917,3944],"137":[3996,4014],"138":[3996,4014],"139":[3979,4015],"140":[4029,4042],"141":[4029,4077],"142":[4021,4115],"143":[4021,4116],"144":[4146,4161],"145":[4166,4184],"146":[4202,4216],"147":[4202,4216],"148":[4189,4217],"149":[4234,4261],"150":[4234,4268],"151":[4234,4268],"152":[4222,4269],"153":[4282,4291],"154":[4317,4346],"155":[4350,4352],"156":[4317,4352],"157":[4303,4360],"158":[4303,4361],"159":[4387,4406],"160":[4410,4412],"161":[4387,4412],"162":[4370,4420],"163":[4370,4421],"164":[4453,4479],"165":[4453,4489],"166":[4435,4490],"167":[4553,4586],"168":[4553,4587],"169":[3869,4696],"170":[3869,4697],"171":[4827,4831],"172":[4827,4839],"173":[4827,4839],"174":[4813,4840],"175":[4857,4870],"176":[4857,4894],"177":[4857,4894],"178":[4845,4895],"179":[4910,4918],"180":[4910,4918],"181":[4900,4919],"182":[4935,4943],"183":[4935,4943],"184":[4924,4944],"185":[4960,4968],"186":[4960,4974],"187":[4960,4974],"188":[4949,4975],"189":[4998,5006],"190":[4998,5012],"191":[4998,5012],"192":[4980,5013],"193":[5030,5032],"194":[5030,5032],"195":[5018,5033],"196":[5070,5083],"197":[5070,5093],"198":[5069,5093],"199":[5109,5128],"200":[5158,5168],"201":[5144,5182],"202":[5144,5183],"203":[5223,5241],"204":[5223,5242],"205":[5262,5278],"206":[5262,5279],"207":[5336,5351],"208":[5336,5352],"209":[5384,5401],"210":[5384,5402],"211":[5434,5451],"212":[5434,5452],"213":[5491,5522],"214":[5491,5523],"215":[4774,5550],"216":[4774,5551],"217":[5553,5575],"218":[5553,5576]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/lib/tunic.js\"" + " " + index);delete __coverage[index];return value};
{ __coverageWrap(0);'use strict';};

/**
 * Line matching patterns.
 *
 * @type {Object.<String,RegExp>}
 */
{ __coverageWrap(3);var matchLines = __coverageWrap(2,__coverageWrap(1,{
    any: /^/gm,
    empty: /^$/gm,
    edge: /^[\t ]*\n|\n[\t ]*$/g
}));};

/**
 * Default C-style grammar.
 *
 * @type {Object.<String,RegExp>}
 */
{ __coverageWrap(6);var defaultGrammar = __coverageWrap(5,__coverageWrap(4,{
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
{ __coverageWrap(9);var defaultOptions = __coverageWrap(8,__coverageWrap(7,{
    raw: false
}));};

/**
 * Copies the enumerable properties of one or more objects to a target object.
 *
 * @type {Function}
 * @param {Object} target Target object.
 * @param {Object} [objs...] Objects with properties to copy.
 * @return {Object} Target object, augmented.
 */
{ __coverageWrap(26);var copier = __coverageWrap(25,__coverageWrap(24,function(target) {
    { __coverageWrap(10);var arg;};
    { __coverageWrap(11);var key;};
    { __coverageWrap(14);var len = __coverageWrap(13,__coverageWrap(12,arguments.length));};
    { __coverageWrap(16);var i = __coverageWrap(15,1);};

    for (; __coverageWrap(17,i < len); __coverageWrap(18,i++)) {
        { __coverageWrap(20);__coverageWrap(19,arg = arguments[i]);};

        for (key in arg) {
            if (__coverageWrap(21,arg.hasOwnProperty(key))) {
                { __coverageWrap(23);__coverageWrap(22,target[key] = arg[key]);};
            }
        }
    }

    return target;
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
    if (__coverageWrap(32,__coverageWrap(31,__coverageWrap(28,__coverageWrap(27,arguments.length) === 1) && __coverageWrap(30,__coverageWrap(29,typeof block) === 'object')) && block)) {
        { __coverageWrap(34);__coverageWrap(33,grammar = block);};
        { __coverageWrap(36);__coverageWrap(35,block = undefined);};
    }

    // Support functional execution: `tunic(block, grammar)`
    if (__coverageWrap(39,!(__coverageWrap(38,__coverageWrap(37,this) instanceof Tunic)))) {
        return __coverageWrap(41,__coverageWrap(40,new Tunic(grammar)).parse(block));
    }

    // Set defaults
    { __coverageWrap(45);__coverageWrap(44,__coverageWrap(42,this).grammar = copier(__coverageWrap(43,{}), defaultGrammar, grammar));};
    { __coverageWrap(49);__coverageWrap(48,__coverageWrap(46,this).options = copier(__coverageWrap(47,{}), defaultOptions));};

    // Enforce context
    { __coverageWrap(55);__coverageWrap(54,__coverageWrap(50,this).parse = __coverageWrap(52,__coverageWrap(51,this).parse).bind(__coverageWrap(53,this)));};
    { __coverageWrap(61);__coverageWrap(60,__coverageWrap(56,this).parseBlock = __coverageWrap(58,__coverageWrap(57,this).parseBlock).bind(__coverageWrap(59,this)));};
    { __coverageWrap(67);__coverageWrap(66,__coverageWrap(62,this).parseCode = __coverageWrap(64,__coverageWrap(63,this).parseCode).bind(__coverageWrap(65,this)));};
    { __coverageWrap(73);__coverageWrap(72,__coverageWrap(68,this).parseDocBlock = __coverageWrap(70,__coverageWrap(69,this).parseDocBlock).bind(__coverageWrap(71,this)));};
    { __coverageWrap(79);__coverageWrap(78,__coverageWrap(74,this).parseTag = __coverageWrap(76,__coverageWrap(75,this).parseTag).bind(__coverageWrap(77,this)));};
}

{ __coverageWrap(82);var proto = __coverageWrap(81,__coverageWrap(80,Tunic.prototype));};

/**
 * @method parse
 * @param {String} block
 * @param {String} [options]
 * @return {String}
 */
{ __coverageWrap(96);__coverageWrap(95,proto.parse = function(block, options) {
    if (__coverageWrap(84,__coverageWrap(83,arguments.length) === 2)) {
        { __coverageWrap(88);__coverageWrap(87,__coverageWrap(85,this).options = copier(__coverageWrap(86,{}), defaultOptions, options));};
    }

    return __coverageWrap(94,__coverageWrap(92,__coverageWrap(89,String(block))
        .split(__coverageWrap(91,__coverageWrap(90,this).grammar).blockSplit))
        .map(__coverageWrap(93,this).parseBlock));
});};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(106);__coverageWrap(105,proto.parseBlock = function(block) {
    if (__coverageWrap(100,__coverageWrap(99,__coverageWrap(98,__coverageWrap(97,this).grammar).blockParse).test(block))) {
        return __coverageWrap(102,__coverageWrap(101,this).parseDocBlock(block));
    }

    return __coverageWrap(104,__coverageWrap(103,this).parseCode(block));
});};

/**
 * @method parseCode
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(110);__coverageWrap(109,proto.parseCode = function(block) {
    return __coverageWrap(108,{
        type: 'Code',
        body: __coverageWrap(107,String(block))
    });
});};

/**
 * @method parseDocBlock
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(132);__coverageWrap(131,proto.parseDocBlock = function(block) {
    { __coverageWrap(112);__coverageWrap(111,block = String(block));};

    { __coverageWrap(119);var tags = __coverageWrap(118,__coverageWrap(117,__coverageWrap(114,__coverageWrap(113,this)
        .normalizeDocBlock(block))
        .split(__coverageWrap(116,__coverageWrap(115,this).grammar).tagSplit)));};

    { __coverageWrap(125);var token = __coverageWrap(124,__coverageWrap(123,{
        type: 'DocBlock',
        description: __coverageWrap(120,tags.shift()),
        tags: __coverageWrap(122,tags.map(__coverageWrap(121,this).parseTag))
    }));};

    if (__coverageWrap(128,__coverageWrap(127,__coverageWrap(126,this).options).raw)) {
        { __coverageWrap(130);__coverageWrap(129,token.raw = block);};
    }

    return token;
});};

/**
 * @method normalizeDocBlock
 * @param {String} block
 * @return {String}
 */
{ __coverageWrap(170);__coverageWrap(169,proto.normalizeDocBlock = function(block) {
    { __coverageWrap(136);var grammar = __coverageWrap(135,__coverageWrap(134,__coverageWrap(133,this).grammar));};

    // Trim comment wrappers
    { __coverageWrap(139);var blockParse = __coverageWrap(138,__coverageWrap(137,grammar.blockParse));};

    { __coverageWrap(143);__coverageWrap(142,block = __coverageWrap(141,__coverageWrap(140,String(block))
        .replace(blockParse, '$1'))
        .replace(matchLines.edge, ''));};

    // Unindent content
    { __coverageWrap(144);var emptyLines;};
    { __coverageWrap(145);var indentedLines;};
    { __coverageWrap(148);var indent = __coverageWrap(147,__coverageWrap(146,grammar.indent));};
    { __coverageWrap(152);var lines = __coverageWrap(151,__coverageWrap(150,__coverageWrap(149,block.match(matchLines.any)).length));};

    while (__coverageWrap(153,lines > 0)) {
        { __coverageWrap(158);__coverageWrap(157,emptyLines = (__coverageWrap(156,__coverageWrap(154,block.match(matchLines.empty)) || __coverageWrap(155,[]))).length);};
        { __coverageWrap(163);__coverageWrap(162,indentedLines = (__coverageWrap(161,__coverageWrap(159,block.match(indent)) || __coverageWrap(160,[]))).length);};

        if (__coverageWrap(166,indentedLines && (__coverageWrap(165,__coverageWrap(164,emptyLines + indentedLines) === lines)))) {
            // Strip leading indent characters
            { __coverageWrap(168);__coverageWrap(167,block = block.replace(indent, ''));};
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
{ __coverageWrap(216);__coverageWrap(215,proto.parseTag = function(block) {
    { __coverageWrap(174);var grammar = __coverageWrap(173,__coverageWrap(172,__coverageWrap(171,this).grammar));};
    { __coverageWrap(178);var parts = __coverageWrap(177,__coverageWrap(176,__coverageWrap(175,String(block)).match(grammar.tagParse)));};
    { __coverageWrap(181);var tag = __coverageWrap(180,__coverageWrap(179,parts[1]));};
    { __coverageWrap(184);var type = __coverageWrap(183,__coverageWrap(182,parts[2]));};
    { __coverageWrap(188);var name = __coverageWrap(187,__coverageWrap(186,__coverageWrap(185,parts[3]) || ''));};
    { __coverageWrap(192);var description = __coverageWrap(191,__coverageWrap(190,__coverageWrap(189,parts[4]) || ''));};
    { __coverageWrap(195);var token = __coverageWrap(194,__coverageWrap(193,{}));};

    // Handle named tags

    if (__coverageWrap(198,!__coverageWrap(197,__coverageWrap(196,grammar.named).test(tag)))) {
        if (__coverageWrap(199,name && description)) {
            { __coverageWrap(202);__coverageWrap(201,description = __coverageWrap(200,name + ' ') + description);};
        } else if (name) {
            { __coverageWrap(204);__coverageWrap(203,description = name);};
        }

        { __coverageWrap(206);__coverageWrap(205,name = undefined);};
    }

    // Keep tokens light

    if (tag) {
        { __coverageWrap(208);__coverageWrap(207,token.tag = tag);};
    }

    if (type) {
        { __coverageWrap(210);__coverageWrap(209,token.type = type);};
    }

    if (name) {
        { __coverageWrap(212);__coverageWrap(211,token.name = name);};
    }

    if (description) {
        { __coverageWrap(214);__coverageWrap(213,token.description = description);};
    }

    return token;
});};

{ __coverageWrap(218);__coverageWrap(217,module.exports = Tunic);};

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
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/spec/tunic-spec.js\"" + " " + "[[25,38],[53,70],[53,70],[40,71],[81,94],[81,94],[72,95],[108,134],[108,134],[96,135],[148,153],[136,154],[257,489],[244,490],[517,530],[546,808],[532,818],[500,819],[500,820],[223,826],[192,827],[192,828],[899,947],[887,948],[975,982],[998,1037],[984,1047],[958,1048],[958,1049],[1076,1087],[1103,1137],[1089,1147],[1059,1148],[1059,1149],[1176,1185],[1201,1231],[1187,1241],[1159,1242],[1159,1243],[1270,1282],[1298,1334],[1397,1399],[1348,1401],[1415,1447],[1510,1512],[1461,1514],[1528,1560],[1623,1625],[1574,1627],[1641,1673],[1736,1738],[1687,1740],[1754,1786],[1284,1796],[1253,1797],[1253,1798],[866,1804],[834,1805],[834,1806],[1876,1946],[1865,1947],[1974,1985],[2001,2031],[2105,2107],[2045,2109],[2123,2155],[2229,2231],[2169,2233],[2247,2279],[2353,2355],[2293,2357],[2371,2403],[1987,2413],[1957,2414],[1957,2415],[1844,2421],[1812,2422],[1812,2423],[2484,2631],[2474,2632],[2659,2669],[2685,2715],[2779,2849],[2778,2850],[2729,2852],[2866,2898],[2962,3032],[2961,3033],[2912,3035],[3049,3081],[3145,3192],[3144,3193],[3095,3195],[3209,3241],[3305,3352],[3304,3353],[3255,3355],[3369,3401],[3465,3481],[3464,3482],[3415,3484],[3498,3530],[2671,3540],[2642,3541],[2642,3542],[2453,3548],[2429,3549],[2429,3550],[3611,3995],[3601,3996],[4023,4033],[4049,4079],[4143,4226],[4142,4227],[4093,4229],[4243,4275],[4339,4422],[4338,4423],[4289,4425],[4439,4471],[4535,4616],[4534,4617],[4485,4619],[4633,4665],[4729,4810],[4728,4811],[4679,4813],[4827,4859],[4923,4975],[4922,4976],[4873,4978],[4992,5024],[5088,5138],[5087,5139],[5038,5141],[5155,5187],[5251,5316],[5250,5317],[5201,5319],[5333,5365],[5429,5494],[5428,5495],[5379,5497],[5511,5543],[5607,5670],[5606,5671],[5557,5673],[5687,5719],[5783,5846],[5782,5847],[5733,5849],[5863,5895],[5959,5993],[5958,5994],[5909,5996],[6010,6042],[6106,6138],[6105,6139],[6056,6141],[6155,6187],[4035,6197],[4006,6198],[4006,6199],[3580,6205],[3556,6206],[3556,6207],[6270,6429],[6259,6430],[6457,6468],[6484,6514],[6578,6612],[6577,6613],[6528,6615],[6629,6661],[6725,6768],[6724,6769],[6675,6771],[6785,6817],[6881,6941],[6880,6942],[6831,6944],[6958,6990],[7054,7141],[7053,7142],[7004,7144],[7158,7190],[6470,7200],[6440,7201],[6440,7202],[6238,7208],[6213,7209],[6213,7210],[7273,7372],[7262,7373],[7400,7411],[7427,7457],[7521,7553],[7520,7554],[7471,7556],[7570,7602],[7666,7700],[7665,7701],[7616,7703],[7717,7749],[7813,7850],[7812,7851],[7763,7853],[7867,7899],[7963,8011],[7962,8012],[7913,8014],[8028,8060],[7413,8070],[7383,8071],[7383,8072],[7241,8078],[7216,8079],[7216,8080],[8150,11381],[8137,11382],[11412,11423],[11412,11423],[11391,11424],[11475,11508],[11446,11509],[11446,11509],[11433,11510],[11559,11589],[11897,11980],[12002,12133],[12155,12319],[12341,12410],[12432,12448],[11875,12466],[11603,13025],[13039,13073],[13381,13464],[13486,13617],[13639,13803],[13825,13894],[13916,13932],[13359,13950],[13087,14440],[14454,14488],[14796,14879],[14901,15032],[15054,15218],[15240,15309],[15331,15347],[14774,15365],[14502,15923],[15937,15971],[16279,16362],[16384,16515],[16537,16701],[16723,16792],[16814,16830],[16257,16848],[15985,17519],[17533,17567],[17875,17958],[17980,18111],[18133,18297],[18319,18388],[18410,18426],[17853,18444],[17581,19010],[19024,19058],[19366,19449],[19471,19602],[19624,19788],[19810,19879],[19901,19917],[19344,19935],[19072,20568],[20582,20614],[11545,20624],[11520,20625],[11520,20626],[8116,20632],[8086,20633],[8086,20634],[20717,24669],[20704,24670],[24712,24947],[24702,24948],[24702,24948],[24680,24949],[25002,25035],[24972,25036],[24972,25036],[24959,25037],[25086,25116],[25421,25504],[25526,25657],[25679,25843],[25865,26002],[26024,26061],[25399,26079],[25130,26752],[26766,26800],[27105,27188],[27210,27341],[27363,27527],[27549,27686],[27708,27724],[27083,27742],[26814,28301],[28315,28349],[28658,28741],[28763,28894],[28916,29080],[29102,29239],[29261,29277],[28636,29295],[28363,29942],[29956,29990],[30295,30378],[30400,30531],[30553,30717],[30739,30876],[30898,30935],[30273,30953],[30004,31754],[31768,31802],[32107,32190],[32212,32343],[32365,32529],[32551,32688],[32710,32726],[32085,32744],[31816,33395],[33409,33443],[33752,33835],[33857,33988],[34010,34174],[34196,34333],[34355,34371],[33730,34389],[33457,35128],[35142,35278],[25072,35288],[25047,35289],[25047,35290],[20683,35296],[20640,35297],[20640,35298],[35375,35890],[35362,35891],[35928,36096],[35918,36097],[35918,36097],[35901,36098],[36146,36179],[36121,36180],[36121,36180],[36108,36181],[36230,36314],[36622,36705],[36727,36858],[36880,37044],[37066,37133],[37155,37171],[36600,37189],[36328,37681],[37695,37727],[36216,37737],[36191,37738],[36191,37739],[35341,37745],[35304,37746],[35304,37747],[174,37749],[156,37750],[156,37751]]");var __coverage = {"0":[25,38],"1":[53,70],"2":[53,70],"3":[40,71],"4":[81,94],"5":[81,94],"6":[72,95],"7":[108,134],"8":[108,134],"9":[96,135],"10":[148,153],"11":[136,154],"12":[257,489],"13":[244,490],"14":[517,530],"15":[546,808],"16":[532,818],"17":[500,819],"18":[500,820],"19":[223,826],"20":[192,827],"21":[192,828],"22":[899,947],"23":[887,948],"24":[975,982],"25":[998,1037],"26":[984,1047],"27":[958,1048],"28":[958,1049],"29":[1076,1087],"30":[1103,1137],"31":[1089,1147],"32":[1059,1148],"33":[1059,1149],"34":[1176,1185],"35":[1201,1231],"36":[1187,1241],"37":[1159,1242],"38":[1159,1243],"39":[1270,1282],"40":[1298,1334],"41":[1397,1399],"42":[1348,1401],"43":[1415,1447],"44":[1510,1512],"45":[1461,1514],"46":[1528,1560],"47":[1623,1625],"48":[1574,1627],"49":[1641,1673],"50":[1736,1738],"51":[1687,1740],"52":[1754,1786],"53":[1284,1796],"54":[1253,1797],"55":[1253,1798],"56":[866,1804],"57":[834,1805],"58":[834,1806],"59":[1876,1946],"60":[1865,1947],"61":[1974,1985],"62":[2001,2031],"63":[2105,2107],"64":[2045,2109],"65":[2123,2155],"66":[2229,2231],"67":[2169,2233],"68":[2247,2279],"69":[2353,2355],"70":[2293,2357],"71":[2371,2403],"72":[1987,2413],"73":[1957,2414],"74":[1957,2415],"75":[1844,2421],"76":[1812,2422],"77":[1812,2423],"78":[2484,2631],"79":[2474,2632],"80":[2659,2669],"81":[2685,2715],"82":[2779,2849],"83":[2778,2850],"84":[2729,2852],"85":[2866,2898],"86":[2962,3032],"87":[2961,3033],"88":[2912,3035],"89":[3049,3081],"90":[3145,3192],"91":[3144,3193],"92":[3095,3195],"93":[3209,3241],"94":[3305,3352],"95":[3304,3353],"96":[3255,3355],"97":[3369,3401],"98":[3465,3481],"99":[3464,3482],"100":[3415,3484],"101":[3498,3530],"102":[2671,3540],"103":[2642,3541],"104":[2642,3542],"105":[2453,3548],"106":[2429,3549],"107":[2429,3550],"108":[3611,3995],"109":[3601,3996],"110":[4023,4033],"111":[4049,4079],"112":[4143,4226],"113":[4142,4227],"114":[4093,4229],"115":[4243,4275],"116":[4339,4422],"117":[4338,4423],"118":[4289,4425],"119":[4439,4471],"120":[4535,4616],"121":[4534,4617],"122":[4485,4619],"123":[4633,4665],"124":[4729,4810],"125":[4728,4811],"126":[4679,4813],"127":[4827,4859],"128":[4923,4975],"129":[4922,4976],"130":[4873,4978],"131":[4992,5024],"132":[5088,5138],"133":[5087,5139],"134":[5038,5141],"135":[5155,5187],"136":[5251,5316],"137":[5250,5317],"138":[5201,5319],"139":[5333,5365],"140":[5429,5494],"141":[5428,5495],"142":[5379,5497],"143":[5511,5543],"144":[5607,5670],"145":[5606,5671],"146":[5557,5673],"147":[5687,5719],"148":[5783,5846],"149":[5782,5847],"150":[5733,5849],"151":[5863,5895],"152":[5959,5993],"153":[5958,5994],"154":[5909,5996],"155":[6010,6042],"156":[6106,6138],"157":[6105,6139],"158":[6056,6141],"159":[6155,6187],"160":[4035,6197],"161":[4006,6198],"162":[4006,6199],"163":[3580,6205],"164":[3556,6206],"165":[3556,6207],"166":[6270,6429],"167":[6259,6430],"168":[6457,6468],"169":[6484,6514],"170":[6578,6612],"171":[6577,6613],"172":[6528,6615],"173":[6629,6661],"174":[6725,6768],"175":[6724,6769],"176":[6675,6771],"177":[6785,6817],"178":[6881,6941],"179":[6880,6942],"180":[6831,6944],"181":[6958,6990],"182":[7054,7141],"183":[7053,7142],"184":[7004,7144],"185":[7158,7190],"186":[6470,7200],"187":[6440,7201],"188":[6440,7202],"189":[6238,7208],"190":[6213,7209],"191":[6213,7210],"192":[7273,7372],"193":[7262,7373],"194":[7400,7411],"195":[7427,7457],"196":[7521,7553],"197":[7520,7554],"198":[7471,7556],"199":[7570,7602],"200":[7666,7700],"201":[7665,7701],"202":[7616,7703],"203":[7717,7749],"204":[7813,7850],"205":[7812,7851],"206":[7763,7853],"207":[7867,7899],"208":[7963,8011],"209":[7962,8012],"210":[7913,8014],"211":[8028,8060],"212":[7413,8070],"213":[7383,8071],"214":[7383,8072],"215":[7241,8078],"216":[7216,8079],"217":[7216,8080],"218":[8150,11381],"219":[8137,11382],"220":[11412,11423],"221":[11412,11423],"222":[11391,11424],"223":[11475,11508],"224":[11446,11509],"225":[11446,11509],"226":[11433,11510],"227":[11559,11589],"228":[11897,11980],"229":[12002,12133],"230":[12155,12319],"231":[12341,12410],"232":[12432,12448],"233":[11875,12466],"234":[11603,13025],"235":[13039,13073],"236":[13381,13464],"237":[13486,13617],"238":[13639,13803],"239":[13825,13894],"240":[13916,13932],"241":[13359,13950],"242":[13087,14440],"243":[14454,14488],"244":[14796,14879],"245":[14901,15032],"246":[15054,15218],"247":[15240,15309],"248":[15331,15347],"249":[14774,15365],"250":[14502,15923],"251":[15937,15971],"252":[16279,16362],"253":[16384,16515],"254":[16537,16701],"255":[16723,16792],"256":[16814,16830],"257":[16257,16848],"258":[15985,17519],"259":[17533,17567],"260":[17875,17958],"261":[17980,18111],"262":[18133,18297],"263":[18319,18388],"264":[18410,18426],"265":[17853,18444],"266":[17581,19010],"267":[19024,19058],"268":[19366,19449],"269":[19471,19602],"270":[19624,19788],"271":[19810,19879],"272":[19901,19917],"273":[19344,19935],"274":[19072,20568],"275":[20582,20614],"276":[11545,20624],"277":[11520,20625],"278":[11520,20626],"279":[8116,20632],"280":[8086,20633],"281":[8086,20634],"282":[20717,24669],"283":[20704,24670],"284":[24712,24947],"285":[24702,24948],"286":[24702,24948],"287":[24680,24949],"288":[25002,25035],"289":[24972,25036],"290":[24972,25036],"291":[24959,25037],"292":[25086,25116],"293":[25421,25504],"294":[25526,25657],"295":[25679,25843],"296":[25865,26002],"297":[26024,26061],"298":[25399,26079],"299":[25130,26752],"300":[26766,26800],"301":[27105,27188],"302":[27210,27341],"303":[27363,27527],"304":[27549,27686],"305":[27708,27724],"306":[27083,27742],"307":[26814,28301],"308":[28315,28349],"309":[28658,28741],"310":[28763,28894],"311":[28916,29080],"312":[29102,29239],"313":[29261,29277],"314":[28636,29295],"315":[28363,29942],"316":[29956,29990],"317":[30295,30378],"318":[30400,30531],"319":[30553,30717],"320":[30739,30876],"321":[30898,30935],"322":[30273,30953],"323":[30004,31754],"324":[31768,31802],"325":[32107,32190],"326":[32212,32343],"327":[32365,32529],"328":[32551,32688],"329":[32710,32726],"330":[32085,32744],"331":[31816,33395],"332":[33409,33443],"333":[33752,33835],"334":[33857,33988],"335":[34010,34174],"336":[34196,34333],"337":[34355,34371],"338":[33730,34389],"339":[33457,35128],"340":[35142,35278],"341":[25072,35288],"342":[25047,35289],"343":[25047,35290],"344":[20683,35296],"345":[20640,35297],"346":[20640,35298],"347":[35375,35890],"348":[35362,35891],"349":[35928,36096],"350":[35918,36097],"351":[35918,36097],"352":[35901,36098],"353":[36146,36179],"354":[36121,36180],"355":[36121,36180],"356":[36108,36181],"357":[36230,36314],"358":[36622,36705],"359":[36727,36858],"360":[36880,37044],"361":[37066,37133],"362":[37155,37171],"363":[36600,37189],"364":[36328,37681],"365":[37695,37727],"366":[36216,37737],"367":[36191,37738],"368":[36191,37739],"369":[35341,37745],"370":[35304,37746],"371":[35304,37747],"372":[174,37749],"373":[156,37750],"374":[156,37751]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/togajs/tunic/test/spec/tunic-spec.js\"" + " " + index);delete __coverage[index];return value};
/*jshint maxlen:false */
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var assert = __coverageWrap(2,__coverageWrap(1,require('assert')));};
{ __coverageWrap(6);var fs = __coverageWrap(5,__coverageWrap(4,require('fs')));};
{ __coverageWrap(9);var tunic = __coverageWrap(8,__coverageWrap(7,require('../../lib/tunic')));};
{ __coverageWrap(11);var Tunic = __coverageWrap(10,tunic);};

{ __coverageWrap(374);__coverageWrap(373,describe('Tunic', __coverageWrap(372,function () {
    { __coverageWrap(21);__coverageWrap(20,it('should ignore non-blocks', __coverageWrap(19,function() {
        { __coverageWrap(13);var ignore = __coverageWrap(12,"// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n");};

        { __coverageWrap(18);__coverageWrap(17,assert.deepEqual(__coverageWrap(14,tunic(ignore)), __coverageWrap(16,[
            __coverageWrap(15,{ 'type': 'Code', 'body': '// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = \'/** ignore */\';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n' })
        ])));};
    })));};

    { __coverageWrap(58);__coverageWrap(57,it('should parse empty blocks', __coverageWrap(56,function() {
        { __coverageWrap(23);var empty = __coverageWrap(22,"/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n");};

        { __coverageWrap(28);__coverageWrap(27,assert.deepEqual(__coverageWrap(24,tunic()), __coverageWrap(26,[
            __coverageWrap(25,{ 'type': 'Code', 'body': 'undefined' })
        ])));};

        { __coverageWrap(33);__coverageWrap(32,assert.deepEqual(__coverageWrap(29,tunic(null)), __coverageWrap(31,[
            __coverageWrap(30,{ 'type': 'Code', 'body': 'null' })
        ])));};

        { __coverageWrap(38);__coverageWrap(37,assert.deepEqual(__coverageWrap(34,tunic('')), __coverageWrap(36,[
            __coverageWrap(35,{ 'type': 'Code', 'body': '' })
        ])));};

        { __coverageWrap(55);__coverageWrap(54,assert.deepEqual(__coverageWrap(39,tunic(empty)), __coverageWrap(53,[
            __coverageWrap(40,{ 'type': 'Code', 'body': '/**/\n' }),
            __coverageWrap(42,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(41,[]) }),
            __coverageWrap(43,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(45,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(44,[]) }),
            __coverageWrap(46,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(48,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(47,[]) }),
            __coverageWrap(49,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(51,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(50,[]) }),
            __coverageWrap(52,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(77);__coverageWrap(76,it('should parse descriptions', __coverageWrap(75,function() {
        { __coverageWrap(60);var desc = __coverageWrap(59,"/** description */\n/**\n * description\n */\n/**\ndescription\n*/\n");};

        { __coverageWrap(74);__coverageWrap(73,assert.deepEqual(__coverageWrap(61,tunic(desc)), __coverageWrap(72,[
            __coverageWrap(62,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(64,{ 'type': 'DocBlock', 'description': 'description', 'tags': __coverageWrap(63,[]) }),
            __coverageWrap(65,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(67,{ 'type': 'DocBlock', 'description': 'description', 'tags': __coverageWrap(66,[]) }),
            __coverageWrap(68,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(70,{ 'type': 'DocBlock', 'description': 'description', 'tags': __coverageWrap(69,[]) }),
            __coverageWrap(71,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(107);__coverageWrap(106,it('should parse tags', __coverageWrap(105,function() {
        { __coverageWrap(79);var tag = __coverageWrap(78,"/** @tag {Type} - Description here. */\n/** @tag {Type} Description here. */\n/** @tag - Description. */\n/** @tag Description. */\n/** @tag */\n");};

        { __coverageWrap(104);__coverageWrap(103,assert.deepEqual(__coverageWrap(80,tunic(tag)), __coverageWrap(102,[
            __coverageWrap(81,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(84,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(83,[__coverageWrap(82,{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' })]) }),
            __coverageWrap(85,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(88,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(87,[__coverageWrap(86,{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' })]) }),
            __coverageWrap(89,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(92,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(91,[__coverageWrap(90,{ 'tag': 'tag', 'description': 'Description.' })]) }),
            __coverageWrap(93,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(96,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(95,[__coverageWrap(94,{ 'tag': 'tag', 'description': 'Description.' })]) }),
            __coverageWrap(97,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(100,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(99,[__coverageWrap(98,{ 'tag': 'tag' })]) }),
            __coverageWrap(101,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(165);__coverageWrap(164,it('should parse args', __coverageWrap(163,function() {
        { __coverageWrap(109);var arg = __coverageWrap(108,"/** @arg {Type} [name] - Description. */\n/** @arg {Type} [name] Description. */\n/** @arg {Type} name - Description. */\n/** @arg {Type} name Description. */\n/** @arg {Type} [name] */\n/** @arg {Type} name */\n/** @arg [name] - Description. */\n/** @arg [name] Description. */\n/** @arg name - Description. */\n/** @arg name Description. */\n/** @arg [name] */\n/** @arg name */\n");};

        { __coverageWrap(162);__coverageWrap(161,assert.deepEqual(__coverageWrap(110,tunic(arg)), __coverageWrap(160,[
            __coverageWrap(111,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(114,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(113,[__coverageWrap(112,{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' })]) }),
            __coverageWrap(115,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(118,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(117,[__coverageWrap(116,{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' })]) }),
            __coverageWrap(119,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(122,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(121,[__coverageWrap(120,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' })]) }),
            __coverageWrap(123,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(126,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(125,[__coverageWrap(124,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' })]) }),
            __coverageWrap(127,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(130,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(129,[__coverageWrap(128,{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]' })]) }),
            __coverageWrap(131,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(134,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(133,[__coverageWrap(132,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name' })]) }),
            __coverageWrap(135,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(138,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(137,[__coverageWrap(136,{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' })]) }),
            __coverageWrap(139,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(142,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(141,[__coverageWrap(140,{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' })]) }),
            __coverageWrap(143,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(146,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(145,[__coverageWrap(144,{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' })]) }),
            __coverageWrap(147,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(150,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(149,[__coverageWrap(148,{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' })]) }),
            __coverageWrap(151,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(154,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(153,[__coverageWrap(152,{ 'tag': 'arg', 'name': '[name]' })]) }),
            __coverageWrap(155,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(158,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(157,[__coverageWrap(156,{ 'tag': 'arg', 'name': 'name' })]) }),
            __coverageWrap(159,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(191);__coverageWrap(190,it('should parse types', __coverageWrap(189,function() {
        { __coverageWrap(167);var type = __coverageWrap(166,"/** @arg {Type} */\n/** @arg {String|Object} */\n/** @arg {Array.<Object.<String,Number>>} */\n/** @arg {Function(String, ...[Number]): Number} callback */\n");};

        { __coverageWrap(188);__coverageWrap(187,assert.deepEqual(__coverageWrap(168,tunic(type)), __coverageWrap(186,[
            __coverageWrap(169,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(172,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(171,[__coverageWrap(170,{ 'tag': 'arg', 'type': '{Type}' })]) }),
            __coverageWrap(173,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(176,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(175,[__coverageWrap(174,{ 'tag': 'arg', 'type': '{String|Object}' })]) }),
            __coverageWrap(177,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(180,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(179,[__coverageWrap(178,{ 'tag': 'arg', 'type': '{Array.<Object.<String,Number>>}' })]) }),
            __coverageWrap(181,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(184,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(183,[__coverageWrap(182,{ 'tag': 'arg', 'type': '{Function(String, ...[Number]): Number}', 'name': 'callback' })]) }),
            __coverageWrap(185,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(217);__coverageWrap(216,it('should parse names', __coverageWrap(215,function() {
        { __coverageWrap(193);var name = __coverageWrap(192,"/** @arg name */\n/** @arg [name] */\n/** @arg [name={}] */\n/** @arg [name=\"hello world\"] */\n");};

        { __coverageWrap(214);__coverageWrap(213,assert.deepEqual(__coverageWrap(194,tunic(name)), __coverageWrap(212,[
            __coverageWrap(195,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(198,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(197,[__coverageWrap(196,{ 'tag': 'arg', 'name': 'name' })]) }),
            __coverageWrap(199,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(202,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(201,[__coverageWrap(200,{ 'tag': 'arg', 'name': '[name]' })]) }),
            __coverageWrap(203,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(206,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(205,[__coverageWrap(204,{ 'tag': 'arg', 'name': '[name={}]' })]) }),
            __coverageWrap(207,{ 'type': 'Code', 'body': '\n' }),
            __coverageWrap(210,{ 'type': 'DocBlock', 'description': '', 'tags': __coverageWrap(209,[__coverageWrap(208,{ 'tag': 'arg', 'name': '[name="hello world"]' })]) }),
            __coverageWrap(211,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(281);__coverageWrap(280,it('should handle indention', __coverageWrap(279,function() {
        { __coverageWrap(219);var indent = __coverageWrap(218,"/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = 'samples';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = 'bar';\n *\n * @tag\n */\n\n/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = 'samples';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = 'bar';\n\n@tag\n */\n\n/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n */\n\n    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = 'samples';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = 'bar';\n     *\n     * @tag\n     */\n\n    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = 'samples';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = 'bar';\n\n    @tag\n     */\n\n    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = 'samples';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = 'bar';\n\n        @tag\n    */\n");};
        { __coverageWrap(222);var standardParser = __coverageWrap(221,__coverageWrap(220,new Tunic()));};
        { __coverageWrap(226);var tokens = __coverageWrap(225,__coverageWrap(224,standardParser.parse(indent, __coverageWrap(223,{
            raw: true
        }))));};

        { __coverageWrap(278);__coverageWrap(277,assert.deepEqual(tokens, __coverageWrap(276,[
            __coverageWrap(227,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(234,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(233,[
                    __coverageWrap(228,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(229,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(230,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(231,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(232,{ 'tag': 'tag' })
                ]),
                'raw': '/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = \'samples\';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = \'bar\';\n *\n * @tag\n */'
            }),
            __coverageWrap(235,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(242,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(241,[
                    __coverageWrap(236,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(237,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(238,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(239,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(240,{ 'tag': 'tag' })
                ]),
                'raw': '/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = \'bar\';\n\n@tag\n */'
            }),
            __coverageWrap(243,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(250,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(249,[
                    __coverageWrap(244,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(245,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(246,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(247,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(248,{ 'tag': 'tag' })
                ]),
                'raw': '/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n */'
            }),
            __coverageWrap(251,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(258,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(257,[
                    __coverageWrap(252,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(253,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(254,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(255,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(256,{ 'tag': 'tag' })
                ]),
                'raw': '    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = \'samples\';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = \'bar\';\n     *\n     * @tag\n     */'
            }),
            __coverageWrap(259,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(266,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(265,[
                    __coverageWrap(260,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(261,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(262,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(263,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(264,{ 'tag': 'tag' })
                ]),
                'raw': '    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n     */'
            }),
            __coverageWrap(267,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(274,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': __coverageWrap(273,[
                    __coverageWrap(268,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(269,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(270,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(271,{ 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' }),
                    __coverageWrap(272,{ 'tag': 'tag' })
                ]),
                'raw': '    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = \'samples\';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = \'bar\';\n\n        @tag\n    */'
            }),
            __coverageWrap(275,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};

    { __coverageWrap(346);__coverageWrap(345,it('should use custom handlebars grammar', __coverageWrap(344,function() {
        { __coverageWrap(283);var custom = __coverageWrap(282,"{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}\n\n{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}\n\n{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}\n\n    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}\n\n    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}\n\n    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n");};

        { __coverageWrap(287);var handlebarParser = __coverageWrap(286,__coverageWrap(285,new Tunic(__coverageWrap(284,{
            blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
            blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
            indent: /^[\t !]/gm,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        }))));};

        { __coverageWrap(291);var tokens = __coverageWrap(290,__coverageWrap(289,handlebarParser.parse(custom, __coverageWrap(288,{
            raw: true
        }))));};

        { __coverageWrap(343);__coverageWrap(342,assert.deepEqual(tokens, __coverageWrap(341,[
            __coverageWrap(292,{ 'type': 'Code', 'body': '' }),
            __coverageWrap(299,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': __coverageWrap(298,[
                    __coverageWrap(293,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(294,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(295,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(296,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(297,{ 'tag': 'tag', 'description': '\n' })
                ]),
                'raw': '{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}'
            }),
            __coverageWrap(300,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(307,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': __coverageWrap(306,[
                    __coverageWrap(301,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(302,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(303,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(304,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(305,{ 'tag': 'tag' })
                ]),
                'raw': '{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}'
            }),
            __coverageWrap(308,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(315,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': __coverageWrap(314,[
                    __coverageWrap(309,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(310,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(311,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(312,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(313,{ 'tag': 'tag' })
                ]),
                'raw': '{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}'
            }),
            __coverageWrap(316,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(323,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': __coverageWrap(322,[
                    __coverageWrap(317,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(318,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(319,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(320,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(321,{ 'tag': 'tag', 'description': '\n' })
                ]),
                'raw': '    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}'
            }),
            __coverageWrap(324,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(331,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': __coverageWrap(330,[
                    __coverageWrap(325,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(326,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(327,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(328,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(329,{ 'tag': 'tag' })
                ]),
                'raw': '    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}'
            }),
            __coverageWrap(332,{ 'type': 'Code', 'body': '\n\n' }),
            __coverageWrap(339,{
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': __coverageWrap(338,[
                    __coverageWrap(333,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(334,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(335,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(336,{ 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' }),
                    __coverageWrap(337,{ 'tag': 'tag' })
                ]),
                'raw': '    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}'
            }),
            __coverageWrap(340,{ 'type': 'Code', 'body': '\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n' })
        ])));};
    })));};

    { __coverageWrap(371);__coverageWrap(370,it('should use custom perl grammar', __coverageWrap(369,function() {
        { __coverageWrap(348);var custom = __coverageWrap(347,"use strict;\nuse warnings;\n\nprint \"hello world\";\n\n=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = \"samples\";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = \"bar\";\n\n@tag\n\n=cut\n");};

        { __coverageWrap(352);var perlParser = __coverageWrap(351,__coverageWrap(350,new Tunic(__coverageWrap(349,{
            blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
            blockParse: /^=pod([\s\S]*?)\n=cut$/m,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        }))));};

        { __coverageWrap(356);var tokens = __coverageWrap(355,__coverageWrap(354,perlParser.parse(custom, __coverageWrap(353,{
            raw: true
        }))));};

        { __coverageWrap(368);__coverageWrap(367,assert.deepEqual(tokens, __coverageWrap(366,[
            __coverageWrap(357,{ 'type': 'Code', 'body': 'use strict;\nuse warnings;\n\nprint "hello world";\n\n' }),
            __coverageWrap(364,{
                'type': 'DocBlock',
                'description': '\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n',
                'tags': __coverageWrap(363,[
                    __coverageWrap(358,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' }),
                    __coverageWrap(359,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' }),
                    __coverageWrap(360,{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' }),
                    __coverageWrap(361,{ 'tag': 'example', 'description': '\n\n    my $foo = "bar";\n\n' }),
                    __coverageWrap(362,{ 'tag': 'tag' })
                ]),
                'raw': '=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = "bar";\n\n@tag\n\n=cut'
            }),
            __coverageWrap(365,{ 'type': 'Code', 'body': '\n' })
        ])));};
    })));};
})));};

},{"../../lib/tunic":1,"assert":3,"fs":2}]},{},[8])