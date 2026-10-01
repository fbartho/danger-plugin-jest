# @fbartho/danger-plugin-jest

[![npm version](https://img.shields.io/npm/v/@fbartho/danger-plugin-jest.svg)](https://www.npmjs.com/package/@fbartho/danger-plugin-jest)

> [Danger](https://github.com/danger/danger-js) plugin for Jest

**Forked to bug-fix** [`macklinu/danger-plugin-jest`](https://github.com/macklinu/danger-plugin-jest), published as [`@fbartho/danger-plugin-jest`](https://www.npmjs.com/package/@fbartho/danger-plugin-jest). The fork reports failing tests when Danger runs without a pull request (`danger local`, or `danger ci` on a GitHub Actions push).

## Usage

### Setup Jest

This Danger plugin relies on modifying your Jest configuration slightly on CI to also output a JSON file of the results.

You need to make the `yarn jest` command include: `--outputFile test-results.json --json`. This will run your tests
like normal, but will also create a file with the full test results after.

> You may also want to add the JSON output file to your `.gitignore`, since it doesn't need to be checked into source control.

### Setup Danger

Install this Danger plugin:

```sh
yarn add @fbartho/danger-plugin-jest --dev
```

By default, this package will assume you've set the filename as `test-results.json`, but you can use any path.

```js
// dangerfile.js
import path from 'path'
import jest from '@fbartho/danger-plugin-jest'

// Default
jest()
// Custom path
jest({ testResultsJsonPath: path.resolve(__dirname, 'tests/results.json') })
```

See [`src/index.ts`](https://github.com/fbartho/danger-plugin-jest/blob/main/src/index.ts) for more details.

## Changelog

Version 1.4.1 adds the fix listed above. Earlier versions are in the upstream [release history](https://github.com/macklinu/danger-plugin-jest/releases).

## Development

Install [Yarn](https://yarnpkg.com/en/), and install the dependencies - `yarn install`.

Run the [Jest](https://facebook.github.io/jest/) test suite with `yarn test`.

Releases are published to npm manually with `npm publish`.

:heart:
