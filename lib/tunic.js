'use strict';

var Transform = require('stream').Transform;
var inherits = require('mout/lang/inheritPrototype');

/**
 * @class Tunic
 * @constructor
 */
function Tunic() {
    Transform.apply(this, arguments);
}

/**
 * Tunic extends Transform.
 * @type {Transform}
 */
var proto = inherits(Tunic, Transform);

/**
 * @method _transform
 * @param {Buffer|String} chunk
 * @param {String} encoding
 * @param {Function} callback
 */
proto._transform = function(chunk, encoding, callback) {
    this.push(chunk);

    callback();
};

module.exports = Tunic;
