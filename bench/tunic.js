import Benchmark from 'benchmark';
import tunic from '../src/tunic';
import * as babel from 'babel-core';
import hljs from 'highlight.js';

const src = `
	/**
	 * # Descriptions
	 *
	 * Long description that spans multiple
	 * lines and even has markdown type things.
	 *
	 * * And
	 * * Lists
	 *
	 *     var code = 'samples';
	 *
	 * @arg {Type} name Description.
	 * @arg {Type} name Description that is really long
	 *   and wraps to other lines.
	 * @arg {Type} name Description that is really long
	 *   and wraps to other lines.
	 *
	 *   And has line breaks, etc.
	 *
	 * @example
	 *
	 *     var foo = 'bar';
	 *
	 * @tag Foo bar.
	 * @tag
	 *
	 * Like more paragraphs.
	 */

	/**
	 * # Named Tags
	 *
	 * @arg        name  Description here.
	 * @argument   name  Description here.
	 * @class      name  Description here.
	 * @exports    name  Description here.
	 * @extends    name  Description here.
	 * @imports    name  Description here.
	 * @method     name  Description here.
	 * @module     name  Description here.
	 * @param      name  Description here.
	 * @parameter  name  Description here.
	 * @prop       name  Description here.
	 * @property   name  Description here.
	 *
	 * @arg {Type} name - Description here.
	 * @arg {Type} name Description here.
	 * @arg {Type} - Description here.
	 * @arg name - Description here.
	 * @arg name Description here.
	 * @arg - Description here.
	 * @arg
	 */

	/**
	 * # Unnamed Tags
	 *
	 * @tag {Type} name - Description here.
	 * @tag {Type} name Description here.
	 * @tag {Type} - Description here.
	 * @tag name - Description here.
	 * @tag name Description here.
	 * @tag - Description here.
	 * @tag
	 */

	/**
	 * # Complex Names
	 *
	 * @arg [name="hello world"] Description here.
	 * @arg [name={}] Description here.
	 * @arg [name] Description here.
	 * @arg name Description here.
	 * @arg name
	 */

	/**
	 * # Complex Types
	 *
	 * @tag {Function(String|Object, ...[Number]): Number} Description here.
	 * @tag {Array.<Object.<String,Number>>} Description here.
	 * @tag {String|Object} Description here.
	 * @tag {Type} Description here.
	 * @tag {Type}
	 */

	/** One line */

	/**
	 * # Non-matching Patterns
	 */

	// ignore

	/* ignore */

	/*! ignore */

	//
	// ignore
	//

	/*
	 * ignore
	 */

	/*!
	 * ignore
	 */

	// /** ignore
	var foo = '/** ignore */';
	var foo = function(/** ignore */) {};
	console.log(foo(/** ignore */));
	// ignore */
`;

/* * /

tunic.parse(src);
process.exit();

/* */

function log(value) {
	console.log(JSON.stringify(value, null, 2));
}

// log(babel.transform(src).ast);
// log(hljs.highlight('javascript', src));
log(tunic.parse(src));

/* */

new Benchmark.Suite()
	.add('babel', () => {
		return babel.transform(src).ast;
	})
	.add('hljs', () => {
		return hljs.highlight('javascript', src);
	})
	.add('tunic', () => {
		return tunic.parse(src);
	})
	.on('cycle', event => {
		console.log(String(event.target));
	})
	.on('complete', function () {
		console.log('Fastest is ', this.filter('fastest').map('name'));
	})
	.run({async: true});
