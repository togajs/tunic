(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/lib/toga.js\"" + " " + "[[0,13],[104,175],[104,175],[87,176],[272,612],[272,612],[251,613],[685,703],[685,703],[664,704],[1001,1009],[1014,1022],[1037,1053],[1037,1053],[1027,1054],[1067,1068],[1059,1069],[1082,1089],[1091,1094],[1106,1124],[1106,1125],[1170,1193],[1213,1235],[1213,1236],[978,1288],[978,1288],[965,1289],[1863,1879],[1863,1885],[1889,1901],[1889,1914],[1863,1914],[1863,1923],[1935,1950],[1935,1951],[1960,1977],[1960,1978],[2056,2060],[2056,2076],[2054,2077],[2096,2113],[2096,2126],[2159,2163],[2181,2183],[2159,2209],[2159,2210],[2215,2219],[2237,2239],[2215,2256],[2215,2257],[2286,2290],[2299,2303],[2299,2309],[2315,2319],[2286,2320],[2286,2321],[2326,2330],[2344,2348],[2344,2359],[2365,2369],[2326,2370],[2326,2371],[2376,2380],[2393,2397],[2393,2407],[2413,2417],[2376,2418],[2376,2419],[2424,2428],[2445,2449],[2445,2463],[2469,2473],[2424,2474],[2424,2475],[2480,2484],[2496,2500],[2496,2509],[2515,2519],[2480,2520],[2480,2521],[2624,2638],[2682,2698],[2682,2704],[2716,2720],[2738,2740],[2716,2766],[2716,2767],[2786,2799],[2815,2819],[2815,2827],[2786,2839],[2853,2857],[2786,2869],[2624,2872],[2624,2873],[2952,2966],[3006,3010],[3006,3018],[3006,3029],[3006,3041],[3060,3064],[3060,3085],[3105,3109],[3105,3126],[2952,3129],[2952,3130],[3208,3222],[3302,3315],[3264,3321],[3208,3324],[3208,3325],[3407,3421],[3460,3481],[3460,3482],[3499,3503],[3499,3537],[3553,3557],[3553,3565],[3499,3575],[3499,3575],[3488,3576],[3643,3655],[3680,3684],[3671,3694],[3594,3700],[3594,3700],[3582,3701],[3711,3715],[3711,3723],[3711,3727],[3739,3756],[3739,3757],[3407,3784],[3407,3785],[3869,3883],[3940,3944],[3940,3952],[3940,3952],[3926,3953],[4005,4023],[4005,4023],[3988,4024],[4038,4051],[4038,4086],[4030,4124],[4030,4125],[4155,4170],[4175,4193],[4211,4225],[4211,4225],[4198,4226],[4243,4270],[4243,4277],[4243,4277],[4231,4278],[4291,4300],[4326,4355],[4359,4361],[4326,4361],[4312,4369],[4312,4370],[4396,4415],[4419,4421],[4396,4421],[4379,4429],[4379,4430],[4462,4488],[4462,4498],[4444,4499],[4562,4595],[4562,4596],[3869,4705],[3869,4706],[4783,4797],[4845,4849],[4845,4857],[4845,4857],[4831,4858],[4875,4888],[4875,4912],[4875,4912],[4863,4913],[4928,4936],[4928,4936],[4918,4937],[4953,4961],[4953,4961],[4942,4962],[4978,4986],[4978,4992],[4978,4992],[4967,4993],[5016,5024],[5016,5030],[5016,5030],[4998,5031],[5048,5050],[5048,5050],[5036,5051],[5088,5101],[5088,5111],[5087,5111],[5127,5146],[5176,5186],[5162,5200],[5162,5201],[5241,5259],[5241,5260],[5280,5296],[5280,5297],[5354,5369],[5354,5370],[5402,5419],[5402,5420],[5452,5469],[5452,5470],[5509,5540],[5509,5541],[4783,5568],[4783,5569],[5571,5592],[5571,5593]]");var __coverage = {"0":[0,13],"1":[104,175],"2":[104,175],"3":[87,176],"4":[272,612],"5":[272,612],"6":[251,613],"7":[685,703],"8":[685,703],"9":[664,704],"10":[1001,1009],"11":[1014,1022],"12":[1037,1053],"13":[1037,1053],"14":[1027,1054],"15":[1067,1068],"16":[1059,1069],"17":[1082,1089],"18":[1091,1094],"19":[1106,1124],"20":[1106,1125],"21":[1170,1193],"22":[1213,1235],"23":[1213,1236],"24":[978,1288],"25":[978,1288],"26":[965,1289],"27":[1863,1879],"28":[1863,1885],"29":[1889,1901],"30":[1889,1914],"31":[1863,1914],"32":[1863,1923],"33":[1935,1950],"34":[1935,1951],"35":[1960,1977],"36":[1960,1978],"37":[2056,2060],"38":[2056,2076],"39":[2054,2077],"40":[2096,2113],"41":[2096,2126],"42":[2159,2163],"43":[2181,2183],"44":[2159,2209],"45":[2159,2210],"46":[2215,2219],"47":[2237,2239],"48":[2215,2256],"49":[2215,2257],"50":[2286,2290],"51":[2299,2303],"52":[2299,2309],"53":[2315,2319],"54":[2286,2320],"55":[2286,2321],"56":[2326,2330],"57":[2344,2348],"58":[2344,2359],"59":[2365,2369],"60":[2326,2370],"61":[2326,2371],"62":[2376,2380],"63":[2393,2397],"64":[2393,2407],"65":[2413,2417],"66":[2376,2418],"67":[2376,2419],"68":[2424,2428],"69":[2445,2449],"70":[2445,2463],"71":[2469,2473],"72":[2424,2474],"73":[2424,2475],"74":[2480,2484],"75":[2496,2500],"76":[2496,2509],"77":[2515,2519],"78":[2480,2520],"79":[2480,2521],"80":[2624,2638],"81":[2682,2698],"82":[2682,2704],"83":[2716,2720],"84":[2738,2740],"85":[2716,2766],"86":[2716,2767],"87":[2786,2799],"88":[2815,2819],"89":[2815,2827],"90":[2786,2839],"91":[2853,2857],"92":[2786,2869],"93":[2624,2872],"94":[2624,2873],"95":[2952,2966],"96":[3006,3010],"97":[3006,3018],"98":[3006,3029],"99":[3006,3041],"100":[3060,3064],"101":[3060,3085],"102":[3105,3109],"103":[3105,3126],"104":[2952,3129],"105":[2952,3130],"106":[3208,3222],"107":[3302,3315],"108":[3264,3321],"109":[3208,3324],"110":[3208,3325],"111":[3407,3421],"112":[3460,3481],"113":[3460,3482],"114":[3499,3503],"115":[3499,3537],"116":[3553,3557],"117":[3553,3565],"118":[3499,3575],"119":[3499,3575],"120":[3488,3576],"121":[3643,3655],"122":[3680,3684],"123":[3671,3694],"124":[3594,3700],"125":[3594,3700],"126":[3582,3701],"127":[3711,3715],"128":[3711,3723],"129":[3711,3727],"130":[3739,3756],"131":[3739,3757],"132":[3407,3784],"133":[3407,3785],"134":[3869,3883],"135":[3940,3944],"136":[3940,3952],"137":[3940,3952],"138":[3926,3953],"139":[4005,4023],"140":[4005,4023],"141":[3988,4024],"142":[4038,4051],"143":[4038,4086],"144":[4030,4124],"145":[4030,4125],"146":[4155,4170],"147":[4175,4193],"148":[4211,4225],"149":[4211,4225],"150":[4198,4226],"151":[4243,4270],"152":[4243,4277],"153":[4243,4277],"154":[4231,4278],"155":[4291,4300],"156":[4326,4355],"157":[4359,4361],"158":[4326,4361],"159":[4312,4369],"160":[4312,4370],"161":[4396,4415],"162":[4419,4421],"163":[4396,4421],"164":[4379,4429],"165":[4379,4430],"166":[4462,4488],"167":[4462,4498],"168":[4444,4499],"169":[4562,4595],"170":[4562,4596],"171":[3869,4705],"172":[3869,4706],"173":[4783,4797],"174":[4845,4849],"175":[4845,4857],"176":[4845,4857],"177":[4831,4858],"178":[4875,4888],"179":[4875,4912],"180":[4875,4912],"181":[4863,4913],"182":[4928,4936],"183":[4928,4936],"184":[4918,4937],"185":[4953,4961],"186":[4953,4961],"187":[4942,4962],"188":[4978,4986],"189":[4978,4992],"190":[4978,4992],"191":[4967,4993],"192":[5016,5024],"193":[5016,5030],"194":[5016,5030],"195":[4998,5031],"196":[5048,5050],"197":[5048,5050],"198":[5036,5051],"199":[5088,5101],"200":[5088,5111],"201":[5087,5111],"202":[5127,5146],"203":[5176,5186],"204":[5162,5200],"205":[5162,5201],"206":[5241,5259],"207":[5241,5260],"208":[5280,5296],"209":[5280,5297],"210":[5354,5369],"211":[5354,5370],"212":[5402,5419],"213":[5402,5420],"214":[5452,5469],"215":[5452,5470],"216":[5509,5540],"217":[5509,5541],"218":[4783,5568],"219":[4783,5569],"220":[5571,5592],"221":[5571,5593]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/lib/toga.js\"" + " " + index);delete __coverage[index];return value};
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
    if (__coverageWrap(32,__coverageWrap(31,__coverageWrap(28,__coverageWrap(27,arguments.length) === 1) && __coverageWrap(30,__coverageWrap(29,typeof block) === 'object')) && block)) {
        { __coverageWrap(34);__coverageWrap(33,grammar = block);};
        { __coverageWrap(36);__coverageWrap(35,block = undefined);};
    }

    // Support functional execution: `toga(block, grammar)`
    if (__coverageWrap(39,!(__coverageWrap(38,__coverageWrap(37,this) instanceof Toga)))) {
        return __coverageWrap(41,__coverageWrap(40,new Toga(grammar)).parse(block));
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

/**
 * @method parse
 * @param {String} block
 * @param {String} [options]
 * @return {String}
 */
{ __coverageWrap(94);__coverageWrap(93,__coverageWrap(80,Toga.prototype).parse = function(block, options) {
    if (__coverageWrap(82,__coverageWrap(81,arguments.length) === 2)) {
        { __coverageWrap(86);__coverageWrap(85,__coverageWrap(83,this).options = copier(__coverageWrap(84,{}), defaultOptions, options));};
    }

    return __coverageWrap(92,__coverageWrap(90,__coverageWrap(87,String(block))
        .split(__coverageWrap(89,__coverageWrap(88,this).grammar).blockSplit))
        .map(__coverageWrap(91,this).parseBlock));
});};

/**
 * @method parseBlock
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(105);__coverageWrap(104,__coverageWrap(95,Toga.prototype).parseBlock = function(block) {
    if (__coverageWrap(99,__coverageWrap(98,__coverageWrap(97,__coverageWrap(96,this).grammar).blockParse).test(block))) {
        return __coverageWrap(101,__coverageWrap(100,this).parseDocBlock(block));
    }

    return __coverageWrap(103,__coverageWrap(102,this).parseCode(block));
});};

/**
 * @method parseCode
 * @param {String} [block]
 * @return {Object}
 */
{ __coverageWrap(110);__coverageWrap(109,__coverageWrap(106,Toga.prototype).parseCode = function(block) {
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
{ __coverageWrap(133);__coverageWrap(132,__coverageWrap(111,Toga.prototype).parseDocBlock = function(block) {
    { __coverageWrap(113);__coverageWrap(112,block = String(block));};

    { __coverageWrap(120);var tags = __coverageWrap(119,__coverageWrap(118,__coverageWrap(115,__coverageWrap(114,this)
        .normalizeDocBlock(block))
        .split(__coverageWrap(117,__coverageWrap(116,this).grammar).tagSplit)));};

    { __coverageWrap(126);var token = __coverageWrap(125,__coverageWrap(124,{
        type: 'DocBlock',
        description: __coverageWrap(121,tags.shift()),
        tags: __coverageWrap(123,tags.map(__coverageWrap(122,this).parseTag))
    }));};

    if (__coverageWrap(129,__coverageWrap(128,__coverageWrap(127,this).options).raw)) {
        { __coverageWrap(131);__coverageWrap(130,token.raw = block);};
    }

    return token;
});};

/**
 * @method normalizeDocBlock
 * @param {String} block
 * @return {String}
 */
{ __coverageWrap(172);__coverageWrap(171,__coverageWrap(134,Toga.prototype).normalizeDocBlock = function(block) {
    { __coverageWrap(138);var grammar = __coverageWrap(137,__coverageWrap(136,__coverageWrap(135,this).grammar));};

    // Trim comment wrappers
    { __coverageWrap(141);var blockParse = __coverageWrap(140,__coverageWrap(139,grammar.blockParse));};

    { __coverageWrap(145);__coverageWrap(144,block = __coverageWrap(143,__coverageWrap(142,String(block))
        .replace(blockParse, '$1'))
        .replace(matchLines.edge, ''));};

    // Unindent content
    { __coverageWrap(146);var emptyLines;};
    { __coverageWrap(147);var indentedLines;};
    { __coverageWrap(150);var indent = __coverageWrap(149,__coverageWrap(148,grammar.indent));};
    { __coverageWrap(154);var lines = __coverageWrap(153,__coverageWrap(152,__coverageWrap(151,block.match(matchLines.any)).length));};

    while (__coverageWrap(155,lines > 0)) {
        { __coverageWrap(160);__coverageWrap(159,emptyLines = (__coverageWrap(158,__coverageWrap(156,block.match(matchLines.empty)) || __coverageWrap(157,[]))).length);};
        { __coverageWrap(165);__coverageWrap(164,indentedLines = (__coverageWrap(163,__coverageWrap(161,block.match(indent)) || __coverageWrap(162,[]))).length);};

        if (__coverageWrap(168,indentedLines && (__coverageWrap(167,__coverageWrap(166,emptyLines + indentedLines) === lines)))) {
            // Strip leading indent characters
            { __coverageWrap(170);__coverageWrap(169,block = block.replace(indent, ''));};
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
{ __coverageWrap(219);__coverageWrap(218,__coverageWrap(173,Toga.prototype).parseTag = function(block) {
    { __coverageWrap(177);var grammar = __coverageWrap(176,__coverageWrap(175,__coverageWrap(174,this).grammar));};
    { __coverageWrap(181);var parts = __coverageWrap(180,__coverageWrap(179,__coverageWrap(178,String(block)).match(grammar.tagParse)));};
    { __coverageWrap(184);var tag = __coverageWrap(183,__coverageWrap(182,parts[1]));};
    { __coverageWrap(187);var type = __coverageWrap(186,__coverageWrap(185,parts[2]));};
    { __coverageWrap(191);var name = __coverageWrap(190,__coverageWrap(189,__coverageWrap(188,parts[3]) || ''));};
    { __coverageWrap(195);var description = __coverageWrap(194,__coverageWrap(193,__coverageWrap(192,parts[4]) || ''));};
    { __coverageWrap(198);var token = __coverageWrap(197,__coverageWrap(196,{}));};

    // Handle named tags

    if (__coverageWrap(201,!__coverageWrap(200,__coverageWrap(199,grammar.named).test(tag)))) {
        if (__coverageWrap(202,name && description)) {
            { __coverageWrap(205);__coverageWrap(204,description = __coverageWrap(203,name + ' ') + description);};
        } else if (name) {
            { __coverageWrap(207);__coverageWrap(206,description = name);};
        }

        { __coverageWrap(209);__coverageWrap(208,name = undefined);};
    }

    // Keep tokens light

    if (tag) {
        { __coverageWrap(211);__coverageWrap(210,token.tag = tag);};
    }

    if (type) {
        { __coverageWrap(213);__coverageWrap(212,token.type = type);};
    }

    if (name) {
        { __coverageWrap(215);__coverageWrap(214,token.name = name);};
    }

    if (description) {
        { __coverageWrap(217);__coverageWrap(216,token.description = description);};
    }

    return token;
});};

{ __coverageWrap(221);__coverageWrap(220,module.exports = Toga);};

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
console.log("COVERAGE " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/test/spec/toga-spec.js\"" + " " + "[[25,38],[53,70],[53,70],[40,71],[81,94],[81,94],[72,95],[107,132],[107,132],[96,133],[145,149],[134,150],[252,484],[239,485],[512,524],[540,802],[526,812],[495,813],[495,814],[218,820],[187,821],[187,822],[893,941],[881,942],[969,975],[991,1030],[977,1040],[952,1041],[952,1042],[1069,1079],[1095,1129],[1081,1139],[1052,1140],[1052,1141],[1168,1176],[1192,1222],[1178,1232],[1151,1233],[1151,1234],[1261,1272],[1288,1324],[1387,1389],[1338,1391],[1405,1437],[1500,1502],[1451,1504],[1518,1550],[1613,1615],[1564,1617],[1631,1663],[1726,1728],[1677,1730],[1744,1776],[1274,1786],[1244,1787],[1244,1788],[860,1794],[828,1795],[828,1796],[1866,1936],[1855,1937],[1964,1974],[1990,2020],[2094,2096],[2034,2098],[2112,2144],[2218,2220],[2158,2222],[2236,2268],[2342,2344],[2282,2346],[2360,2392],[1976,2402],[1947,2403],[1947,2404],[1834,2410],[1802,2411],[1802,2412],[2473,2620],[2463,2621],[2648,2657],[2673,2703],[2767,2837],[2766,2838],[2717,2840],[2854,2886],[2950,3020],[2949,3021],[2900,3023],[3037,3069],[3133,3180],[3132,3181],[3083,3183],[3197,3229],[3293,3340],[3292,3341],[3243,3343],[3357,3389],[3453,3469],[3452,3470],[3403,3472],[3486,3518],[2659,3528],[2631,3529],[2631,3530],[2442,3536],[2418,3537],[2418,3538],[3599,3983],[3589,3984],[4011,4020],[4036,4066],[4130,4213],[4129,4214],[4080,4216],[4230,4262],[4326,4409],[4325,4410],[4276,4412],[4426,4458],[4522,4603],[4521,4604],[4472,4606],[4620,4652],[4716,4797],[4715,4798],[4666,4800],[4814,4846],[4910,4962],[4909,4963],[4860,4965],[4979,5011],[5075,5125],[5074,5126],[5025,5128],[5142,5174],[5238,5303],[5237,5304],[5188,5306],[5320,5352],[5416,5481],[5415,5482],[5366,5484],[5498,5530],[5594,5657],[5593,5658],[5544,5660],[5674,5706],[5770,5833],[5769,5834],[5720,5836],[5850,5882],[5946,5980],[5945,5981],[5896,5983],[5997,6029],[6093,6125],[6092,6126],[6043,6128],[6142,6174],[4022,6184],[3994,6185],[3994,6186],[3568,6192],[3544,6193],[3544,6194],[6257,6416],[6246,6417],[6444,6454],[6470,6500],[6564,6598],[6563,6599],[6514,6601],[6615,6647],[6711,6754],[6710,6755],[6661,6757],[6771,6803],[6867,6927],[6866,6928],[6817,6930],[6944,6976],[7040,7127],[7039,7128],[6990,7130],[7144,7176],[6456,7186],[6427,7187],[6427,7188],[6225,7194],[6200,7195],[6200,7196],[7259,7358],[7248,7359],[7386,7396],[7412,7442],[7506,7538],[7505,7539],[7456,7541],[7555,7587],[7651,7685],[7650,7686],[7601,7688],[7702,7734],[7798,7835],[7797,7836],[7748,7838],[7852,7884],[7948,7996],[7947,7997],[7898,7999],[8013,8045],[7398,8055],[7369,8056],[7369,8057],[7227,8063],[7202,8064],[7202,8065],[8135,11366],[8122,11367],[11397,11407],[11397,11407],[11376,11408],[11459,11492],[11430,11493],[11430,11493],[11417,11494],[11543,11573],[11881,11964],[11986,12117],[12139,12303],[12325,12394],[12416,12432],[11859,12450],[11587,13009],[13023,13057],[13365,13448],[13470,13601],[13623,13787],[13809,13878],[13900,13916],[13343,13934],[13071,14424],[14438,14472],[14780,14863],[14885,15016],[15038,15202],[15224,15293],[15315,15331],[14758,15349],[14486,15907],[15921,15955],[16263,16346],[16368,16499],[16521,16685],[16707,16776],[16798,16814],[16241,16832],[15969,17503],[17517,17551],[17859,17942],[17964,18095],[18117,18281],[18303,18372],[18394,18410],[17837,18428],[17565,18994],[19008,19042],[19350,19433],[19455,19586],[19608,19772],[19794,19863],[19885,19901],[19328,19919],[19056,20552],[20566,20598],[11529,20608],[11504,20609],[11504,20610],[8101,20616],[8071,20617],[8071,20618],[20701,24653],[20688,24654],[24695,24930],[24686,24931],[24686,24931],[24664,24932],[24985,25018],[24955,25019],[24955,25019],[24942,25020],[25069,25099],[25404,25487],[25509,25640],[25662,25826],[25848,25985],[26007,26044],[25382,26062],[25113,26735],[26749,26783],[27088,27171],[27193,27324],[27346,27510],[27532,27669],[27691,27707],[27066,27725],[26797,28284],[28298,28332],[28641,28724],[28746,28877],[28899,29063],[29085,29222],[29244,29260],[28619,29278],[28346,29925],[29939,29973],[30278,30361],[30383,30514],[30536,30700],[30722,30859],[30881,30918],[30256,30936],[29987,31737],[31751,31785],[32090,32173],[32195,32326],[32348,32512],[32534,32671],[32693,32709],[32068,32727],[31799,33378],[33392,33426],[33735,33818],[33840,33971],[33993,34157],[34179,34316],[34338,34354],[33713,34372],[33440,35111],[35125,35261],[25055,35271],[25030,35272],[25030,35273],[20667,35279],[20624,35280],[20624,35281],[35358,35873],[35345,35874],[35910,36078],[35901,36079],[35901,36079],[35884,36080],[36128,36161],[36103,36162],[36103,36162],[36090,36163],[36212,36296],[36604,36687],[36709,36840],[36862,37026],[37048,37115],[37137,37153],[36582,37171],[36310,37663],[37677,37709],[36198,37719],[36173,37720],[36173,37721],[35324,37727],[35287,37728],[35287,37729],[169,37731],[152,37732],[152,37733]]");var __coverage = {"0":[25,38],"1":[53,70],"2":[53,70],"3":[40,71],"4":[81,94],"5":[81,94],"6":[72,95],"7":[107,132],"8":[107,132],"9":[96,133],"10":[145,149],"11":[134,150],"12":[252,484],"13":[239,485],"14":[512,524],"15":[540,802],"16":[526,812],"17":[495,813],"18":[495,814],"19":[218,820],"20":[187,821],"21":[187,822],"22":[893,941],"23":[881,942],"24":[969,975],"25":[991,1030],"26":[977,1040],"27":[952,1041],"28":[952,1042],"29":[1069,1079],"30":[1095,1129],"31":[1081,1139],"32":[1052,1140],"33":[1052,1141],"34":[1168,1176],"35":[1192,1222],"36":[1178,1232],"37":[1151,1233],"38":[1151,1234],"39":[1261,1272],"40":[1288,1324],"41":[1387,1389],"42":[1338,1391],"43":[1405,1437],"44":[1500,1502],"45":[1451,1504],"46":[1518,1550],"47":[1613,1615],"48":[1564,1617],"49":[1631,1663],"50":[1726,1728],"51":[1677,1730],"52":[1744,1776],"53":[1274,1786],"54":[1244,1787],"55":[1244,1788],"56":[860,1794],"57":[828,1795],"58":[828,1796],"59":[1866,1936],"60":[1855,1937],"61":[1964,1974],"62":[1990,2020],"63":[2094,2096],"64":[2034,2098],"65":[2112,2144],"66":[2218,2220],"67":[2158,2222],"68":[2236,2268],"69":[2342,2344],"70":[2282,2346],"71":[2360,2392],"72":[1976,2402],"73":[1947,2403],"74":[1947,2404],"75":[1834,2410],"76":[1802,2411],"77":[1802,2412],"78":[2473,2620],"79":[2463,2621],"80":[2648,2657],"81":[2673,2703],"82":[2767,2837],"83":[2766,2838],"84":[2717,2840],"85":[2854,2886],"86":[2950,3020],"87":[2949,3021],"88":[2900,3023],"89":[3037,3069],"90":[3133,3180],"91":[3132,3181],"92":[3083,3183],"93":[3197,3229],"94":[3293,3340],"95":[3292,3341],"96":[3243,3343],"97":[3357,3389],"98":[3453,3469],"99":[3452,3470],"100":[3403,3472],"101":[3486,3518],"102":[2659,3528],"103":[2631,3529],"104":[2631,3530],"105":[2442,3536],"106":[2418,3537],"107":[2418,3538],"108":[3599,3983],"109":[3589,3984],"110":[4011,4020],"111":[4036,4066],"112":[4130,4213],"113":[4129,4214],"114":[4080,4216],"115":[4230,4262],"116":[4326,4409],"117":[4325,4410],"118":[4276,4412],"119":[4426,4458],"120":[4522,4603],"121":[4521,4604],"122":[4472,4606],"123":[4620,4652],"124":[4716,4797],"125":[4715,4798],"126":[4666,4800],"127":[4814,4846],"128":[4910,4962],"129":[4909,4963],"130":[4860,4965],"131":[4979,5011],"132":[5075,5125],"133":[5074,5126],"134":[5025,5128],"135":[5142,5174],"136":[5238,5303],"137":[5237,5304],"138":[5188,5306],"139":[5320,5352],"140":[5416,5481],"141":[5415,5482],"142":[5366,5484],"143":[5498,5530],"144":[5594,5657],"145":[5593,5658],"146":[5544,5660],"147":[5674,5706],"148":[5770,5833],"149":[5769,5834],"150":[5720,5836],"151":[5850,5882],"152":[5946,5980],"153":[5945,5981],"154":[5896,5983],"155":[5997,6029],"156":[6093,6125],"157":[6092,6126],"158":[6043,6128],"159":[6142,6174],"160":[4022,6184],"161":[3994,6185],"162":[3994,6186],"163":[3568,6192],"164":[3544,6193],"165":[3544,6194],"166":[6257,6416],"167":[6246,6417],"168":[6444,6454],"169":[6470,6500],"170":[6564,6598],"171":[6563,6599],"172":[6514,6601],"173":[6615,6647],"174":[6711,6754],"175":[6710,6755],"176":[6661,6757],"177":[6771,6803],"178":[6867,6927],"179":[6866,6928],"180":[6817,6930],"181":[6944,6976],"182":[7040,7127],"183":[7039,7128],"184":[6990,7130],"185":[7144,7176],"186":[6456,7186],"187":[6427,7187],"188":[6427,7188],"189":[6225,7194],"190":[6200,7195],"191":[6200,7196],"192":[7259,7358],"193":[7248,7359],"194":[7386,7396],"195":[7412,7442],"196":[7506,7538],"197":[7505,7539],"198":[7456,7541],"199":[7555,7587],"200":[7651,7685],"201":[7650,7686],"202":[7601,7688],"203":[7702,7734],"204":[7798,7835],"205":[7797,7836],"206":[7748,7838],"207":[7852,7884],"208":[7948,7996],"209":[7947,7997],"210":[7898,7999],"211":[8013,8045],"212":[7398,8055],"213":[7369,8056],"214":[7369,8057],"215":[7227,8063],"216":[7202,8064],"217":[7202,8065],"218":[8135,11366],"219":[8122,11367],"220":[11397,11407],"221":[11397,11407],"222":[11376,11408],"223":[11459,11492],"224":[11430,11493],"225":[11430,11493],"226":[11417,11494],"227":[11543,11573],"228":[11881,11964],"229":[11986,12117],"230":[12139,12303],"231":[12325,12394],"232":[12416,12432],"233":[11859,12450],"234":[11587,13009],"235":[13023,13057],"236":[13365,13448],"237":[13470,13601],"238":[13623,13787],"239":[13809,13878],"240":[13900,13916],"241":[13343,13934],"242":[13071,14424],"243":[14438,14472],"244":[14780,14863],"245":[14885,15016],"246":[15038,15202],"247":[15224,15293],"248":[15315,15331],"249":[14758,15349],"250":[14486,15907],"251":[15921,15955],"252":[16263,16346],"253":[16368,16499],"254":[16521,16685],"255":[16707,16776],"256":[16798,16814],"257":[16241,16832],"258":[15969,17503],"259":[17517,17551],"260":[17859,17942],"261":[17964,18095],"262":[18117,18281],"263":[18303,18372],"264":[18394,18410],"265":[17837,18428],"266":[17565,18994],"267":[19008,19042],"268":[19350,19433],"269":[19455,19586],"270":[19608,19772],"271":[19794,19863],"272":[19885,19901],"273":[19328,19919],"274":[19056,20552],"275":[20566,20598],"276":[11529,20608],"277":[11504,20609],"278":[11504,20610],"279":[8101,20616],"280":[8071,20617],"281":[8071,20618],"282":[20701,24653],"283":[20688,24654],"284":[24695,24930],"285":[24686,24931],"286":[24686,24931],"287":[24664,24932],"288":[24985,25018],"289":[24955,25019],"290":[24955,25019],"291":[24942,25020],"292":[25069,25099],"293":[25404,25487],"294":[25509,25640],"295":[25662,25826],"296":[25848,25985],"297":[26007,26044],"298":[25382,26062],"299":[25113,26735],"300":[26749,26783],"301":[27088,27171],"302":[27193,27324],"303":[27346,27510],"304":[27532,27669],"305":[27691,27707],"306":[27066,27725],"307":[26797,28284],"308":[28298,28332],"309":[28641,28724],"310":[28746,28877],"311":[28899,29063],"312":[29085,29222],"313":[29244,29260],"314":[28619,29278],"315":[28346,29925],"316":[29939,29973],"317":[30278,30361],"318":[30383,30514],"319":[30536,30700],"320":[30722,30859],"321":[30881,30918],"322":[30256,30936],"323":[29987,31737],"324":[31751,31785],"325":[32090,32173],"326":[32195,32326],"327":[32348,32512],"328":[32534,32671],"329":[32693,32709],"330":[32068,32727],"331":[31799,33378],"332":[33392,33426],"333":[33735,33818],"334":[33840,33971],"335":[33993,34157],"336":[34179,34316],"337":[34338,34354],"338":[33713,34372],"339":[33440,35111],"340":[35125,35261],"341":[25055,35271],"342":[25030,35272],"343":[25030,35273],"344":[20667,35279],"345":[20624,35280],"346":[20624,35281],"347":[35358,35873],"348":[35345,35874],"349":[35910,36078],"350":[35901,36079],"351":[35901,36079],"352":[35884,36080],"353":[36128,36161],"354":[36103,36162],"355":[36103,36162],"356":[36090,36163],"357":[36212,36296],"358":[36604,36687],"359":[36709,36840],"360":[36862,37026],"361":[37048,37115],"362":[37137,37153],"363":[36582,37171],"364":[36310,37663],"365":[37677,37709],"366":[36198,37719],"367":[36173,37720],"368":[36173,37721],"369":[35324,37727],"370":[35287,37728],"371":[35287,37729],"372":[169,37731],"373":[152,37732],"374":[152,37733]};var __coverageWrap = function (index, value) {if (__coverage[index]) console.log("COVERED " + "\"/Users/smoeller/Repos/github/shannonmoeller/toga/test/spec/toga-spec.js\"" + " " + index);delete __coverage[index];return value};
/*jshint maxlen:false */
{ __coverageWrap(0);'use strict';};

{ __coverageWrap(3);var assert = __coverageWrap(2,__coverageWrap(1,require('assert')));};
{ __coverageWrap(6);var fs = __coverageWrap(5,__coverageWrap(4,require('fs')));};
{ __coverageWrap(9);var toga = __coverageWrap(8,__coverageWrap(7,require('../../lib/toga')));};
{ __coverageWrap(11);var Toga = __coverageWrap(10,toga);};

{ __coverageWrap(374);__coverageWrap(373,describe('Toga', __coverageWrap(372,function () {
    { __coverageWrap(21);__coverageWrap(20,it('should ignore non-blocks', __coverageWrap(19,function() {
        { __coverageWrap(13);var ignore = __coverageWrap(12,"// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = '/** ignore */';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n");};

        { __coverageWrap(18);__coverageWrap(17,assert.deepEqual(__coverageWrap(14,toga(ignore)), __coverageWrap(16,[
            __coverageWrap(15,{ 'type': 'Code', 'body': '// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = \'/** ignore */\';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n' })
        ])));};
    })));};

    { __coverageWrap(58);__coverageWrap(57,it('should parse empty blocks', __coverageWrap(56,function() {
        { __coverageWrap(23);var empty = __coverageWrap(22,"/**/\n/***/\n/** */\n/**\n *\n */\n/**\n\n*/\n");};

        { __coverageWrap(28);__coverageWrap(27,assert.deepEqual(__coverageWrap(24,toga()), __coverageWrap(26,[
            __coverageWrap(25,{ 'type': 'Code', 'body': 'undefined' })
        ])));};

        { __coverageWrap(33);__coverageWrap(32,assert.deepEqual(__coverageWrap(29,toga(null)), __coverageWrap(31,[
            __coverageWrap(30,{ 'type': 'Code', 'body': 'null' })
        ])));};

        { __coverageWrap(38);__coverageWrap(37,assert.deepEqual(__coverageWrap(34,toga('')), __coverageWrap(36,[
            __coverageWrap(35,{ 'type': 'Code', 'body': '' })
        ])));};

        { __coverageWrap(55);__coverageWrap(54,assert.deepEqual(__coverageWrap(39,toga(empty)), __coverageWrap(53,[
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

        { __coverageWrap(74);__coverageWrap(73,assert.deepEqual(__coverageWrap(61,toga(desc)), __coverageWrap(72,[
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

        { __coverageWrap(104);__coverageWrap(103,assert.deepEqual(__coverageWrap(80,toga(tag)), __coverageWrap(102,[
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

        { __coverageWrap(162);__coverageWrap(161,assert.deepEqual(__coverageWrap(110,toga(arg)), __coverageWrap(160,[
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

        { __coverageWrap(188);__coverageWrap(187,assert.deepEqual(__coverageWrap(168,toga(type)), __coverageWrap(186,[
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

        { __coverageWrap(214);__coverageWrap(213,assert.deepEqual(__coverageWrap(194,toga(name)), __coverageWrap(212,[
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
        { __coverageWrap(222);var standardParser = __coverageWrap(221,__coverageWrap(220,new Toga()));};
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

        { __coverageWrap(287);var handlebarParser = __coverageWrap(286,__coverageWrap(285,new Toga(__coverageWrap(284,{
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

        { __coverageWrap(352);var perlParser = __coverageWrap(351,__coverageWrap(350,new Toga(__coverageWrap(349,{
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

},{"../../lib/toga":1,"assert":3,"fs":2}]},{},[8])