import {parse} from '../src/tunic';
import requireGlob from 'require-glob';
import test from 'ava';
import tosource from 'tosource';
import {join} from 'path';
import {readFile} from 'fs';

function glob(pattern) {
	return new Promise((resolve, reject) => {
		requireGlob(pattern, {cwd: __dirname}, (err, data) => {
			return err ? reject(err) : resolve(data);
		});
	});
}

function read(filePath) {
	return new Promise((resolve, reject) => {
		readFile(join(__dirname, filePath), 'utf8', (err, data) => {
			return err ? reject(err) : resolve(data.trim());
		});
	});
}

test('should parse custom grammar', async assert => {
	const grammars = await glob('../src/grammars/{c,javascript}.js');

	const tests = Object.keys(grammars).map(async grammar => {
		const fixture = await read(`./fixtures/${grammar}.txt`);
		const expected = await read(`./expected/${grammar}.txt`);
		const actual = parse(fixture, grammars[grammar]);

		assert.is(tosource(actual), expected, grammar);
	});

	return Promise.all(tests);
});
