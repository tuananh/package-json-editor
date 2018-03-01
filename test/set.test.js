var fs = require('fs')
var path = require('path')
var t = require('tape')
var npmPackageEditor = require('../src')

var oldTree = fs.readFileSync(
    path.resolve(__dirname + '/package.json'),
    'utf-8'
)

t.test('test init from object', t => {
    var json = JSON.parse(oldTree)
    var newTree = npmPackageEditor(json).toJSON()

    t.equal(typeof newTree, 'object')
    t.end()
})

t.test('test .set()', t => {
    var newTree = npmPackageEditor(oldTree)
        .set('dependencies.detect-indent', '^5.0.1')
        .set('dependencies.detect-newline', '^2.1.1')
        .toJSON()

    t.equal(newTree.dependencies['detect-indent'], '^5.0.1')
    t.equal(newTree.dependencies['detect-newline'], '^2.1.1')
    t.end()
})
