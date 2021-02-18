![@typhonjs-fvtt/eslint-config-foundry.js](https://i.imgur.com/2ty8gTM.png)

[![NPM](https://img.shields.io/npm/v/@typhonjs-fvtt/eslint-config-foundry.js?style=plastic)](https://www.npmjs.com/package/@typhonjs-fvtt/eslint-config-foundry.js)
[![License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=plastic)](https://github.com/typhonjs-fvtt/eslint-config-foundry.js/blob/main/LICENSE)

### Why:

This module provides shared [ESLint](http://eslint.org/) configuration files for [Foundry VTT](https://foundryvtt.com) / 
[foundry.js](https://foundryvtt.com/api/foundry.js.html) containing all exported globals for module / system 
development. This configuration file is designed as an addon to other configuration files of your choice as it 
only defines the `foundry.js` globals for use with directives like `no-shadow` or `@typescript-eslint/no-shadow` if you 
are using Typescript. Enable ESLint in your IDE of choice and feel relief that you are not overwriting any globals
defined in `foundry.js`!

Please see the `.eslintrc` file in [demo-rollup-module](https://github.com/typhonjs-fvtt/demo-rollup-module/blob/main/.eslintrc) 
for a complete example. 

### Installation:

`npm install --save-dev @typhonjs-fvtt/eslint-config-foundry.js` or add to `package.json`.

To use:

Create a minimal `.eslintrc` file in the root path of a project.

```
/**
 * Loads https://github.com/typhonjs-fvtt/eslint-config-foundry.js/latest
 * NPM: https://www.npmjs.com/package/@typhonjs-fvtt/eslint-config-foundry.js
 *
 * Note: specific versions are located in /<VERSION>
 */
{
  "extends": "@typhonjs-fvtt/eslint-config-foundry.js"

  // Prevents overwriting any built in globals particularly from `@typhonjs-fvtt/eslint-config-foundry.js`. 
  // `event / window.event` shadowing is allowed due to being a common variable name and an uncommonly used browser 
  // feature.
  //
  // Note: if you are using Typescript you must use `@typescript-eslint/no-shadow`
  "rules": {
    "no-shadow": ["error", { "builtinGlobals": true, "hoist": "all", "allow": ["event"] }]
  }
}
```

### Versions:

This module follows the semantic versioning of Foundry VTT. You will also be able to target specific versions described
below. The `latest` config which is the `default` will match the version of this module. So if you install
`@typhonjs-fvtt/eslint-config-foundry.js@0.7.9` the default and latest eslint config corresponds with the `0.7.9`
release of Foundry VTT (foundry.js).

Latest version: `0.7.9`

All versions:
- `0.7.8` - `0.7.9`
- `latest` (0.7.9)
- `latest-0.7.x` (0.7.9)

To reference a particular version in the eslint `extends` field specify it via `/<version>` from the list above.

Example of specifying the latest 0.7.x version:

`"extends": "@typhonjs-fvtt/eslint-config-foundry.js/latest-0.7.x"`

### Example IDE Integration

![IDE Integration](https://imgur.com/eFI3shs.png)

![IDE Integration 2](https://imgur.com/zEIn5JH.png)
