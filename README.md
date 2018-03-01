# npm-package-editor

> npm package editor that preserve newline and indentation

This is a mere wrapper around `automerge` so that we can use to edit npm package tree and preserve all the indentation, newline settings.

We can use this package to edit the tree directly using `.set()` method or we can edit the tree object directly and merge the new tree onto the old tree later with `.merge()`.

## Usage

```js
var npmPackageEditor = require('npm-package-editor')

var originTree = fs.readFileSync('./package.json', 'utf-8')
var mutated = JSON.parse(originTree)
mutated.dependencies.debug = '^1.0.0'
mutated.description = 'new description'
delete mutated.license

var newTree = npmPackageEditor(originTree)
    .merge(mutated)
    .toString()

// or
var anotherTree = npmPackageEditor(originTree)
    .set('dependencies.detect-indent', '^5.0.1')
    .toJSON()
```

## API

## License

[MIT](./LICENSE)