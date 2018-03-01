var assert = require('assert')
var detectIndent = require('detect-indent')
var detectNewline = require('detect-newline')
var dset = require('dset')
var Automerge = require('automerge')
var omitDeep = require('omit-deep-lodash')

var DEFAULT_INDENT = 2
var CRLF = '\r\n'
var LF = '\n'

module.exports = function(json) {
    return new NpmPackageEditor(json)
}

function NpmPackageEditor(json) {
    assert.equal(
        typeof json === 'object' || typeof json === 'string',
        true,
        'data must be string or object'
    )

    var originDoc = Automerge.init('1-origin')
    // actor name as `1-origin` because of merge strategy https://github.com/automerge/automerge/issues/68
    originDoc = Automerge.change(originDoc, 'Initialize data', doc => {
        doc.json = typeof json === 'object' ? json : JSON.parse(json)
    })

    var jsonString = typeof json === 'object' ? JSON.stringify(json) : json
    this._doc = originDoc
    this._indent = detectIndent(jsonString).indent || DEFAULT_INDENT
    this._newline = detectNewline(jsonString) || LF

    return this
}

NpmPackageEditor.prototype.toString = function toString() {
    let json = JSON.stringify(
        omitDeep(this._doc.json, ['_objectId', '_conflicts']),
        null,
        this._indent
    )
    if (this._newline === CRLF) {
        return json.replace(/\n/g, CRLF) + CRLF
    }

    return json + LF
}

NpmPackageEditor.prototype.toJSON = function toJSON() {
    return this._doc.json
}

NpmPackageEditor.prototype.merge = function merge(newData) {
    assert.equal(
        typeof newData === 'object' || typeof newData === 'string',
        true,
        'data must be string or object'
    )

    let newDoc = Automerge.change(Automerge.init('2-edit'), doc => {
        doc.json = typeof newData === 'object' ? newData : JSON.parse(newData)
    })
    this._doc = Automerge.merge(this._doc, newDoc)

    return this
}

NpmPackageEditor.prototype.set = function set(path, value) {
    this._doc = Automerge.change(this._doc, `set data at path ${path}`, doc => {
        dset(doc.json, path, value)
    })

    return this
}
