global.requestIdleCallback = false;

const test = require('tape');
const fn = require('../dist/workshy');

test('workshy', t => {
	t.is(typeof fn, 'function', 'exports a function');
	t.is(typeof fn(), 'function', '~> returns function output');
	t.end();
});
