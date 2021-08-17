<div align="center">
  <img src="logo.jpg" alt="loadr" width="400" />
</div>

<div align="center">
  <a href="https://npmjs.org/package/loadr">
    <img src="https://badgen.now.sh/npm/v/loadr" alt="version" />
  </a>
  <a href="https://github.com/lukeed/loadr/actions">
    <img src="https://github.com/lukeed/loadr/workflows/CI/badge.svg" alt="CI" />
  </a>
  <!-- <a href="https://npmjs.org/package/loadr">
    <img src="https://badgen.now.sh/npm/dm/loadr" alt="downloads" />
  </a> -->
  <a href="https://packagephobia.now.sh/result?p=loadr">
    <img src="https://packagephobia.now.sh/badge?p=loadr" alt="install size" />
  </a>
</div>

<div align="center">
  Quickly attach <em>multiple</em> ESM Loaders and/or Require Hooks together <br>
	but without the repetitive `--experimental-loader` and/or `--require` Node flags
</div>


## Features

* Extremely lightweight
* Easily chain multiple [ESM Loaders](https://nodejs.org/api/esm.html#esm_loaders) together<sup>†</sup>
* Interleave additional [`--require` hooks](https://nodejs.org/api/cli.html#cli_r_require_module) at the same time
* Command spawns as a `ChildProcess`, forwarding the current `process.env` context

> <sup>†</sup> The ESM Loader API is still **experimental** and will change in the future.

## Install

```
$ npm install --save-dev loadr
```


## Usage

```sh
# Run `npm test` using the `loadr.mjs` configuration file
$ loadr -- npm test

# Run `npm test` using custom `loadr.custom.js` file
$ loadr -c loadr.custom.js -- npm test

# Run `node server.mjs` w/o system bell
$ loadr -q -- node server.mjs
```


## CLI

The `loadr` binary expects the following usage:

```sh
$ loadr [options] -- <command>
```

> **Important:** The `--` is required! It separates your `command` from your `loadr` arguments.

Please run `loadr --help` for additional information.

## Configuration

Unless specified via the `-c` or `--config` CLI arguments, `loadr` looks for a `loadr.mjs` configuration file in the current working directory – aka `process.cwd()`.

### loaders
Type: `string[]`

A list of files and/or modules to be added as an `--experimental-loader` hook.

> **Important:** Any relative file paths will be resolved from the current working directory.

```js
// loadr.mjs
export const loaders = [
  "ts-node/esm", // third-party module
  "./tests/loader.mjs", // local file
];
```

### requires
Type: `string[]`

A list of files and/or modules to be added as a `--require` hook. Please note that ESM files cannot be loaded via a `require()` statement.

> **Important:** Any relative file paths will be resolved from the current working directory.

```js
// loadr.mjs
export const requires = [
  "esm", // third-party module
  "dotenv/register", // third-party module
  "./tests/setup.js", // local file
];
```

### quiet
Type: `Boolean`<br>
Default: `false`

By default, `loadr` invokes the system bell when your `command` process terminates with a non-zero exit code.

> **Note:** If defined, the `-q` or `--quiet` CLI argument takes precedence over the configuation file.

```js
// loader.mjs
export const quiet = true;
```

## License

MIT © [Luke Edwards](https://lukeed.com)
