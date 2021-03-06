import test from 'ava';
import tunic from '../src/tunic';
import * as tagStyles from '../src/tagStyles';

test('atCurlyDash', async assert => {
	const src = `
		/**
		 * Description.
		 * @arg {Type} name - Description.
		 * @arg {Type} name Description.
		 * @arg {Type} - Description.
		 * @arg {Type} Description.
		 * @arg name - Description.
		 * @arg name Description.
		 * @arg - Description.
		 * @arg Description.
		 * @arg
		 *   Description.
		 * @arg
		 * Description.
		 */
		hello

		/**
		 * Description.
		 * @tag {Type} name - Description.
		 * @tag {Type} name Description.
		 * @tag {Type} - Description.
		 * @tag {Type} Description.
		 * @tag name - Description.
		 * @tag name Description.
		 * @tag - Description.
		 * @tag Description.
		 * @tag
		 *   Description.
		 * @tag
		 * Description.
		 */
		world
	`;

	assert.same(tunic.parse(src, { tagStyle: tagStyles.atCurlyDash }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\n\n\n\n\n\n\nDescription.',
					tags: [
						{ type: 'CommentTag', tag: 'arg', kind: 'Type', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: 'Type', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: 'Type', name: 'Description.', description: '' },
						{ type: 'CommentTag', tag: 'arg', kind: 'Type', name: 'Description.', description: '' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: 'Description.', description: '' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: 'Description.', description: '' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: '', description: '\n  Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello\n\n'
				}
			},
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\n\n\n\n\n\n\nDescription.',
					tags: [
						{ type: 'CommentTag', tag: 'tag', kind: 'Type', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: 'Type', name: '', description: 'name Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: 'Type', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: 'Type', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: 'name Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: '\n  Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\tworld\n\t'
				}
			}
		]
	});
});

test('backslashCurlyDash', async assert => {
	const src = `
		/**
		 * Description.
		 * \\arg {Type} name - Description.
		 * \\arg {Type} name Description.
		 * \\arg {Type} - Description.
		 * \\arg {Type} Description.
		 * \\arg name - Description.
		 * \\arg name Description.
		 * \\arg - Description.
		 * \\arg Description.
		 * \\arg
		 *   Description.
		 * \\arg
		 * Description.
		 */
		hello

		/**
		 * Description.
		 * \\tag {Type} name - Description.
		 * \\tag {Type} name Description.
		 * \\tag {Type} - Description.
		 * \\tag {Type} Description.
		 * \\tag name - Description.
		 * \\tag name Description.
		 * \\tag - Description.
		 * \\tag Description.
		 * \\tag
		 *   Description.
		 * \\tag
		 * Description.
		 */
		world
	`;

	assert.same(tunic.parse(src, { tagStyle: tagStyles.backslashCurlyDash }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\n\n\n\n\n\n\nDescription.',
					tags: [
						{ type: 'CommentTag', tag: 'arg', kind: 'Type', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: 'Type', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: 'Type', name: 'Description.', description: '' },
						{ type: 'CommentTag', tag: 'arg', kind: 'Type', name: 'Description.', description: '' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: 'Description.', description: '' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: 'Description.', description: '' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: '', description: '\n  Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello\n\n'
				}
			},
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\n\n\n\n\n\n\nDescription.',
					tags: [
						{ type: 'CommentTag', tag: 'tag', kind: 'Type', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: 'Type', name: '', description: 'name Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: 'Type', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: 'Type', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: 'name', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: 'name Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: '\n  Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\tworld\n\t'
				}
			}
		]
	});
});

test('colon', async assert => {
	const src = `
		/**
		 * Description.
		 * arg : Description.
		 * arg: Description.
		 * arg :
		 *   Description.
		 * arg :
		 * Description.
		 */
		hello

		/**
		 * Description.
		 * tag : Description.
		 * tag: Description.
		 * tag :
		 *   Description.
		 * tag :
		 * Description.
		 */
		world
	`;

	assert.same(tunic.parse(src, { tagStyle: tagStyles.colon }), {
		type: 'Documentation',
		blocks: [
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\nDescription.',
					tags: [
						{ type: 'CommentTag', tag: 'arg', kind: '', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: '', description: '\n  Description.' },
						{ type: 'CommentTag', tag: 'arg', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\thello\n\n'
				}
			},
			{
				type: 'Block',
				comment: {
					type: 'Comment',
					description: 'Description.\n\n\n\n\nDescription.',
					tags: [
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: 'Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: '\n  Description.' },
						{ type: 'CommentTag', tag: 'tag', kind: '', name: '', description: '' }
					]
				},
				code: {
					type: 'Code',
					code: '\n\t\tworld\n\t'
				}
			}
		]
	});
});
