var fs = require('fs')
var path = require('path')
var t = require('tape')
var npmPackageEditor = require('../src')

var originTree = fs.readFileSync(
    path.resolve(__dirname + '/package.json'),
    'utf-8'
)

t.test('merge test', t => {
    var mutated = JSON.parse(originTree)
    var newDescription = 'new description'
    mutated.description = newDescription
    mutated.dependencies.debug = '^1.0.0'
    delete mutated.license

    var newTree = npmPackageEditor(originTree)
        .merge(mutated)
        .toJSON()

    t.equal(newTree.description, newDescription)
    t.equal(newTree.license, undefined)
    t.equal(newTree.dependencies.debug, '^1.0.0')

    t.end()
})
