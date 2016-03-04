import test from 'ava';
import tunic from '../src/tunic';
import * as commentStyles from '../src/commentStyles';

test('angleBangDashDash', async assert => {
	const src = `
		<!--
		 ! # Description
		 !
		 ! Long description that spans multiple
		 ! lines and even has markdown type things.
		 !
		 ! @arg {Type} name Description.
		 !-->
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.angleBangDashDash}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('bangBang', async assert => {
	const src = `
		!> # Description
		!!
		!! Long description that spans multiple
		!! lines and even has markdown type things.
		!!
		!! @arg {Type} name Description.
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.bangBang}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('curlyDashPipe', async assert => {
	const src = `
		{-|
		 - # Description
		 -
		 - Long description that spans multiple
		 - lines and even has markdown type things.
		 -
		 - @arg {Type} name Description.
		 -}
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.curlyDashPipe}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('curlyHashHash', async assert => {
	const src = `
		{##
		 # Description
		 # ===========
		 #
		 # Long description that spans multiple
		 # lines and even has markdown type things.
		 #
		 # @arg {Type} name Description.
		 #}
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.curlyHashHash}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description\n===========\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('curlyPercPerc', async assert => {
	const src = `
		{%%
		 % # Description
		 %
		 % Long description that spans multiple
		 % lines and even has markdown type things.
		 %
		 % @arg {Type} name Description.
		 %}
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.curlyPercPerc}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('dashDashBang', async assert => {
	const src = `
		--! # Description
		--!
		--! Long description that spans multiple
		--! lines and even has markdown type things.
		--!
		--! @arg {Type} name Description.
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.dashDashBang}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('eqBegin', async assert => {
	const src = `
=begin
# Description

Long description that spans multiple
lines and even has markdown type things.

@arg {Type} name Description.
=end
hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.eqBegin}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\nhello world\n\t'
				}
			}
		]
	});
});

test('eqPod', async assert => {
	const src = `
=pod
# Description

Long description that spans multiple
lines and even has markdown type things.

@arg {Type} name Description.
=cut
hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.eqPod}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\nhello world\n\t'
				}
			}
		]
	});
});

test('hashHash', async assert => {
	const src = `
		##
		# Description
		# ===========
		#
		# Long description that spans multiple
		# lines and even has markdown type things.
		#
		# @arg {Type} name Description.
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.hashHash}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description\n===========\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('hashHashHash', async assert => {
	const src = `
		###
		# Description
		# ===========
		#
		# Long description that spans multiple
		# lines and even has markdown type things.
		#
		# @arg {Type} name Description.
		###
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.hashHashHash}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description\n===========\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('parenStarStar', async assert => {
	const src = `
		(**
		 * # Description
		 *
		 * Long description that spans multiple
		 * lines and even has markdown type things.
		 *
		 * @arg {Type} name Description.
		 *)
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.parenStarStar}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('percPerc', async assert => {
	const src = `
		%%
		% # Description
		%
		% Long description that spans multiple
		% lines and even has markdown type things.
		%
		% @arg {Type} name Description.
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.percPerc}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('percPercPerc', async assert => {
	const src = `
		%%%
		% # Description
		%
		% Long description that spans multiple
		% lines and even has markdown type things.
		%
		% @arg {Type} name Description.
		%%%
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.percPercPerc}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('quoteQuote', async assert => {
	const src = `
		""
		" # Description
		"
		" Long description that spans multiple
		" lines and even has markdown type things.
		"
		" @arg {Type} name Description.
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.quoteQuote}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('quoteQuoteQuote', async assert => {
	const src = `
		"""
		" # Description
		"
		" Long description that spans multiple
		" lines and even has markdown type things.
		"
		" @arg {Type} name Description.
		"""
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.quoteQuoteQuote}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('singSing', async assert => {
	const src = `
		''
		' # Description
		'
		' Long description that spans multiple
		' lines and even has markdown type things.
		'
		' @arg {Type} name Description.
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.singSing}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('singSingSing', async assert => {
	const src = `
		'''
		' # Description
		'
		' Long description that spans multiple
		' lines and even has markdown type things.
		'
		' @arg {Type} name Description.
		'''
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.singSingSing}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});

test('slashSlashSlash', async assert => {
	const src = `
		/// # Description
		///
		/// Long description that spans multiple
		/// lines and even has markdown type things.
		///
		/// @arg {Type} name Description.
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.slashSlashSlash}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\t\thello world\n\t'
				}
			}
		]
	});
});

test('slashStarStar', async assert => {
	const src = `
		/**
		 * # Description
		 *
		 * Long description that spans multiple
		 * lines and even has markdown type things.
		 *
		 * @arg {Type} name Description.
		 */
		hello world
	`;

	assert.same(tunic.parse(src, {commentStyle: commentStyles.slashStarStar}), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: '# Description\n\nLong description that spans multiple\nlines and even has markdown type things.\n\n',
					tags: [
						{
							type: 'CommentTag',
							tag: 'arg',
							kind: 'Type',
							name: 'name',
							description: 'Description.'
						}
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello world\n\t'
				}
			}
		]
	});
});
