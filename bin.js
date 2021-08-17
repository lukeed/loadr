#!/usr/bin/env node
let i = 0, command = '';
let argv = process.argv.slice(2);

for (; i < argv.length; i++) {
	if (argv[i] === '--') {
		command = argv.slice(i+1).join(' ');
		argv = argv.slice(0, i);
		break;
	}
}

if (argv.includes('-h') || argv.includes('--help')) {
	let msg = '';
	msg += '\n  Usage\n    $ loadr [options] -- <command>\n';
	msg += '\n  Options';
	msg += `\n    -c, --config    Path to configuration file (default: loadr.mjs)`;
	msg += `\n    -q, --quiet     Silence the system bell on error(s)`;
	msg += '\n    -v, --version   Displays current version';
	msg += '\n    -h, --help      Displays this message\n';
	msg += '\n  Examples';
	msg += '\n    $ loadr -- npm test';
	msg += '\n    $ loadr -c loadr.config.js -- uvu tests\n';
	console.log(msg);
	process.exit(0);
}

if (argv.includes('-v') || argv.includes('--version')) {
	const { version } = require('./package.json');
	console.log(`loadr, v${version}`);
	process.exit(0);
}

if (!command) {
	console.error('! missing command');
	process.exit(1);
}

i = argv.indexOf('--config');
if (!~i) i = argv.indexOf('-c');

let { existsSync } = require('fs');
let { resolve } = require('path');

let quiet = argv.includes('-q') || argv.includes('--quiet');
let config = resolve('.', !!~i && argv[++i] || 'loadr.mjs');

function run(NODE_OPTIONS) {
	let env = { ...process.env, NODE_OPTIONS };
	let { exec } = require('child_process');
	return new Promise((res, rej) => {
		let pid = exec(command, { env });
		if (pid.stderr) pid.stderr.pipe(process.stderr);
		if (pid.stdout) pid.stdout.pipe(process.stderr);
		pid.on('error', rej).on('exit', code => {
			return code ? rej(code) : res(0);
		});
	})
}

if (existsSync(config)) {
	import(config).then(async m => {
		m = m.default || m;
		quiet = quiet || !!m.quiet;

		let options = '';

		(m.loaders || []).forEach(str => {
			if (options) options += ' ';
			options += `--experimental-loader ${str}`;
		});

		(m.requires || []).forEach(str => {
			if (options) options += ' ';
			options += `-r ${str}`;
		});

		try {
			await run(options);
		} catch (code) {
			quiet || process.stdout.write('\u0007');
			process.exitCode = typeof code == 'number' ? code : 1;
		}
	});
} else {
	console.error('! config file missing:', config);
	process.exit(1);
}
